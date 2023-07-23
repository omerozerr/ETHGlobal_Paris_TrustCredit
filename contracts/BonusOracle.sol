// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./libraries/IterableMapping.sol";

contract BonusOracle is Ownable {
    using IterableMapping for IterableMapping.Map;

    // internal map to hold NFT bonuses.
    IterableMapping.Map internal _nftBonus;
    // internal map to hold NFT bonus deadlines.
    mapping(address => uint256) internal _nftBonusDeadlines;
    // internal map to hold ERC20 price feeds. (only enter X/USD pairs)
    mapping(address => address) internal _priceFeeds;

    ///
    /// Errors
    error InvalidInput();

    ///
    /// Constructor

    constructor() { }

    ///
    /// Events
    event NewTokenBonus(address indexed tokenContract, uint256 bonus, uint256 deadline);

    ///
    /// View

    function getNFTBonus(address tokenContract) internal view returns (uint256) {
        // Check deadline.
        if (block.timestamp > _nftBonusDeadlines[tokenContract]) return 0;
        return _nftBonus.get(tokenContract);
    }

    /// @dev Use this to calculate account NFT bonus.
    function getAccountNFTBonus(address account) external view returns (uint256) {
        uint256 totalBonus = 0;
        uint256 size = _nftBonus.size();
        for (uint256 i = 0; i < size; i++) {
            // Fetch token contract.
            address tokenContract = _nftBonus.getKeyAtIndex(i);

            // check balance.
            uint256 balance = IERC721(tokenContract).balanceOf(account);
            if (balance == 0) continue;

            // check deadline.
            if (_nftBonusDeadlines[tokenContract] <= block.timestamp) continue;

            // increase bonus
            totalBonus += (getNFTBonus(tokenContract) * balance);
        }

        // Limit to 1000;
        if (totalBonus > 1000) totalBonus = 1000;
        return totalBonus;
    }

    /// @dev Use this to get ERC20 bonus.
    /// @dev This gets limited at user id.
    function getERC20Bonus(address tokenContract) external view returns (uint256) {
        // Get token's price feed.
        address priceFeed = _priceFeeds[tokenContract];
        if (priceFeed == address(0)) return 0;

        // Get price from the feed.
        (
        ,int price,,,
        ) = AggregatorV3Interface(priceFeed).latestRoundData();

        // Check if the price is negative.
        if (price <= 0) return 0;

        // 0.05 bonus per USD
        return uint256(price) * 5 / 100;
    }

    /// @dev I'm just too lazy to add price feed to `LendingProtocol`
    function getERC20Price(address tokenContract) external view returns (uint256) {
        // Get token's price feed.
        address priceFeed = _priceFeeds[tokenContract];
        if (priceFeed == address(0)) return 0;

        // Get price from the feed.
        (
            ,int price,,,
        ) = AggregatorV3Interface(priceFeed).latestRoundData();

        // Check if the price is negative.
        if (price <= 0) return 0;
        return uint256(price);
    }

    ///
    /// Owner only

    // @dev Use this to set token bonuses.
    function setTokenBonus(
        address tokenContract,
        uint256 bonus,
        uint256 deadlineSec
    ) public onlyOwner {
        uint256 duration = block.timestamp + deadlineSec;
        _nftBonus.set(tokenContract, bonus);
        _nftBonusDeadlines[tokenContract] = duration;
        emit NewTokenBonus(tokenContract, bonus, duration);
    }

    // @dev Use this to set bulk bonuses in one tx.
    function setTokenBonusMulti(
        address[] memory tokenContracts,
        uint256[] memory bonuses,
        uint256[] memory deadlineSecs
    ) external onlyOwner {
        require(
            tokenContracts.length == bonuses.length &&
            tokenContracts.length == deadlineSecs.length,
            "invalid input"
        );

        for (uint256 i = 0; i < tokenContracts.length; i++) {
            setTokenBonus(tokenContracts[i], bonuses[i], deadlineSecs[i]);
        }
    }

    // @dev Use this to add X/USD price feeds.
    function addPriceFeed(address tokenContract, address priceFeed) external onlyOwner {
        if (tokenContract == address(0) || priceFeed == address(0))
            revert InvalidInput();

        // Set token price feed;
        _priceFeeds[tokenContract] = priceFeed;
    }
}