// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./BonusOracle.sol";

contract UserID is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // the NFT bonus oracle.
    BonusOracle internal _bonusOracle;

    constructor(
        BonusOracle erc721Oracle
    ) ERC721("UserID", "UID") {
        _bonusOracle = erc721Oracle;
    }

    ///
    /// View

    function bonusOracle() external view returns (address) {
        return address(_bonusOracle);
    }

    /// @dev Use this to calculate user's credit score depending on total repays.
    function getAccountCreditScore(address account, address repayToken, uint256 totalRepays) public view returns (uint256) {
        // Check balance.
        if (balanceOf(account) == 0) return 0;

        // Get NFT weight.
        uint256 nftWeight = _bonusOracle.getAccountNFTBonus(account);

        // Get token weight.
        uint256 erc20Weight = _bonusOracle.getERC20Bonus(repayToken) * totalRepays;

        // Calculate score.
        uint256 score = (
            (nftWeight * 2 / 10) +
            (erc20Weight * 8 / 10)
        );

        // Normalize score.
        if (score < 1) score = 1;
        if (score > 1000) score = 1000;

        return score;
    }

    ///
    /// ERC-721 Functions

    function safeMint() public payable {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    // TODO: Do dynamic NFT ?
    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    ///
    /// Hooks

    function _beforeTokenTransfer(
        address from,
        address,
        uint256
    ) internal pure override {
        require(
            from == address(0),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }
}