// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./UserID.sol";
import "./LendingAccount6551.sol";
import "./interfaces/IKeeperRegistrarInterface.sol";

contract LendingProtocol is ReentrancyGuard, Context {
    using SafeERC20 for IERC20;

    /// the user id contract.
    UserID internal _userIds;

    /// the bonus oracle.
    BonusOracle internal _bonusOracle;

    /// internal map to hold deposits. (ex. _deposits[account][token])
    mapping(address => mapping(address => uint256)) internal _deposits;
    /// internal map to hold borrows. (ex. _borrows[account][token])
    mapping(address => mapping(address => uint256)) internal _borrows;
    // internal map to hold repayment amounts. (ex. _repayments[account][token]);
    mapping(address => mapping(address => uint256)) internal _repayments;
    // internal map to hold current position token. (only one token before closing position);
    mapping(address => address) internal _activePosTokens;
    // internal array to hold users
    // @dev it's 4 am an i don't have the mentality to write a proper wrapper
    // @dev you should make sure that user only gets pushed once at production. im too lazy rn.
    address[] internal _allUsers;

    /// supported tokens.
    address internal immutable _dai;
    address internal immutable _weth;

    ///
    /// Errors
    error InvalidToken();
    error InvalidAmount();
    error TransferFailed();
    error InvalidDeposit();
    error InsufficientDeposit();
    error InvalidOwner();
    error MaxBorrowExceed();
    error InsufficientBorrow();
    error InsufficientPayment();

    ///
    /// Events

    event Deposit(
        address indexed account,
        address indexed token,
        uint amount
    );

    event Borrow(
        address indexed account,
        address indexed tokenAddress,
        uint amount
    );

    event Repay(
        address indexed accountAddress,
        address indexed tokenAddress,
        uint amount
    );

    event Withdraw(
        address indexed accountAddress,
        address tokenAddress,
        uint amount
    );

    ///
    /// Modifiers.

    modifier accountOwnerOnly(address account6551) {
        // Get token owner.
        address owner = IERC6551Account(payable(account6551)).owner();
        if (_msgSender() != owner)
            revert InvalidOwner();
        _;
    }

    modifier activeTokenOnly(IERC20 tokenContract) {
        if (
            address(tokenContract) != _dai &&
            address(tokenContract) != _weth
        ) revert InvalidToken();

        // Check active token.
        address activeToken = _activePosTokens[msg.sender];
        if (activeToken != address(0) && activeToken != address(tokenContract))
            revert InvalidToken();

        _;
    }

    ///
    /// Constructor.

    constructor(
        UserID userIdContract,
        BonusOracle bonusOracle,
        address dai,
        address weth
    ) {
        _userIds = userIdContract;
        _bonusOracle = bonusOracle;
        _dai = dai;
        _weth = weth;
    }

    ///
    /// Deposit / Withdraw

    function deposit(IERC20 tokenContract, uint256 amount) external  {
        // Check token.
        if (address(tokenContract) == address(0))
            revert InvalidToken();

        // Check amount.
        if (amount <= 0)
            revert InvalidAmount();

        // Get previous balance of the pools.
        uint256 beforeBalance = tokenContract.balanceOf(address(this));

        // Transfer tokens optimistically.
        if (!tokenContract.transferFrom(_msgSender(), address(this), amount))
            revert TransferFailed();

        // Check transferred amounts.
        uint256 afterBalance = tokenContract.balanceOf(address(this));
        if (afterBalance - beforeBalance != amount)
            revert InvalidDeposit();

        // Increase deposit for user.
        _deposits[_msgSender()][address(tokenContract)] += amount;
        emit Deposit(_msgSender(), address(tokenContract), amount);
    }

    function withdraw(IERC20 tokenContract, uint256 amount) external {
        // Check token.
        if (address(tokenContract) == address(0))
            revert InvalidToken();

        // Check amount.
        if (amount <= 0)
            revert InvalidAmount();

        // Check deposit.
        if (amount > _deposits[_msgSender()][address(tokenContract)])
            revert InsufficientDeposit();

        // Transfer tokens optimistically.
        if (!tokenContract.transfer(_msgSender(), amount))
            revert TransferFailed();

        // Decrease the deposit.
        _deposits[_msgSender()][address(tokenContract)] -= amount;
        emit Withdraw(_msgSender(), address(tokenContract), amount);
    }

    ///
    /// Borrow / Repay

    function borrow(IERC20 tokenContract, LendingAccount6551 account6551, uint256 amount)
        external nonReentrant accountOwnerOnly(address(account6551)) activeTokenOnly(tokenContract)
    {
        // Calculate the maximum borrow.
        uint256 maxBorrow = getMaxBorrow(tokenContract, account6551);
        uint256 prevBorrow = _borrows[_msgSender()][address(tokenContract)];

        // Check amount.
        if ((prevBorrow + amount) > maxBorrow)
            revert MaxBorrowExceed();

        // Transfer tokens optimistically.
        if (!tokenContract.transfer(_msgSender(), amount))
            revert TransferFailed();

        // Add to users.
        _allUsers.push(_msgSender());

        // Increase the borrow.
        _activePosTokens[_msgSender()] = address(tokenContract);
        _borrows[_msgSender()][address(tokenContract)] += amount;
        emit Borrow(_msgSender(), address(tokenContract), amount);
    }

    function repay(IERC20 tokenContract) external nonReentrant activeTokenOnly(tokenContract) {
        // Check total borrow.
        uint256 totalBorrow = _borrows[_msgSender()][address(tokenContract)];
        if (totalBorrow == 0)
            revert InsufficientBorrow();

        // Calculate the debt; (2 percent fee)
        uint256 debt = totalBorrow * 102 / 100;

        // Get previous balance of the pools.
        uint256 beforeBalance = tokenContract.balanceOf(address(this));

        // Transfer tokens optimistically.
        if (!tokenContract.transferFrom(_msgSender(), address(this), debt))
            revert TransferFailed();

        // Check transferred amounts.
        uint256 afterBalance = tokenContract.balanceOf(address(this));
        if (afterBalance - beforeBalance < debt)
            revert InsufficientPayment();

        // Update maps.
        _activePosTokens[_msgSender()] = address(0);
        _borrows[_msgSender()][address(tokenContract)] = 0;
        _repayments[_msgSender()][address(tokenContract)] += debt;
        emit Repay(_msgSender(), address(tokenContract), debt);
    }

    ///
    /// View

    function getDeposit(address user, address token) external view returns (uint256) {
        return _deposits[user][token];
    }

    function getBorrow(address user, address token) external view returns (uint256)  {
        return _borrows[user][token];
    }

    function getTotalRepay(address user, address token) external view returns (uint256)  {
        return _repayments[user][token];
    }

    /// @dev Use this to calculate maximum borrow that an user can have.
    function getMaxBorrow(IERC20 tokenContract, LendingAccount6551 account6551) public view returns (uint256){
        uint256 totalDeposit = _deposits[_msgSender()][address(tokenContract)];
        uint256 totalRepay = _repayments[_msgSender()][address(tokenContract)];
        uint256 creditScore = _userIds.getAccountCreditScore(address(account6551), address(tokenContract), totalRepay);
        uint256 maxBorrow = totalDeposit * (65 + (creditScore * 15 / 1000)) / 100;
        return maxBorrow;
    }

    /// @dev Use this to check if user got liquidated.
    function checkIfLiquidated(address user) public view returns (bool) {
        // Get active token.
        address activeToken = _activePosTokens[user];
        if (activeToken == address(0)) return false;

        // Get token price.
        uint256 daiPrice = _bonusOracle.getERC20Price(_dai);
        uint256 wethPrice = _bonusOracle.getERC20Price(_weth);

        // Calculate the user's borrow.
        uint256 totalBorrow = _borrows[user][_dai] * daiPrice;
        totalBorrow += _borrows[user][_weth] * wethPrice;

        // Calculate the value of the collateral (total deposit).
        uint256 totalDeposit = _deposits[user][_dai] * daiPrice;
        totalDeposit += _deposits[user][_weth] * wethPrice;

        // Check if the total borrow is greater than the value of the collateral.
        return totalBorrow > totalDeposit;
    }

    ///
    /// TODO: Chainlink Automations to check user liq.


}