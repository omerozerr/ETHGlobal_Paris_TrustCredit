import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import {BonusOracle, MockERC721, MockV3Aggregator} from "../typechain-types";

describe("BonusOracle", function () {
    let bonusOracle: BonusOracle;
    let mockERC721: MockERC721;
    let mockAggregator: MockV3Aggregator;
    let signers: Signer[];

    beforeEach(async function () {
        // Get signers
        signers = await ethers.getSigners();

        // Deploy the IterableMapping library
        const IterableMappingFactory = await ethers.getContractFactory("IterableMapping");
        const iterableMapping = await IterableMappingFactory.deploy();
        await iterableMapping.deployed();

        // Deploy the BonusOracle contract with the library linked
        const BonusOracleFactory = await ethers.getContractFactory("BonusOracle", {
            libraries: {
                "IterableMapping": iterableMapping.address,
            },
        });
        bonusOracle = await BonusOracleFactory.deploy() as BonusOracle;
        await bonusOracle.deployed();

        const MockERC721Factory = await ethers.getContractFactory("MockERC721");
        mockERC721 = await MockERC721Factory.deploy() as MockERC721;
        await mockERC721.deployed();

        const MockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator");
        mockAggregator = await MockV3AggregatorFactory.deploy(18, ethers.utils.parseEther("2000")) as MockV3Aggregator;
        await mockAggregator.deployed();
    });

    describe("setTokenBonus", function () {
        it("should set token bonus correctly", async function () {
            await bonusOracle.setTokenBonus(mockERC721.address, 100, 3600);
        });

        it("should not allow non-owners to set token bonus", async function () {
            await expect(bonusOracle.connect(signers[1]).setTokenBonus(mockERC721.address, 100, 3600)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("getAccountNFTBonus", function () {
        it("should return correct NFT bonus", async function () {
            await mockERC721.safeMint(await signers[0].getAddress(), 1);
            await bonusOracle.setTokenBonus(mockERC721.address, 100, 3600);
        });

        it("should return zero if no NFT bonus", async function () {
            const bonus = await bonusOracle.getAccountNFTBonus(await signers[0].getAddress());
            expect(bonus).to.equal(0);
        });
    });

    describe("getERC20Bonus", function () {
        it("should return correct ERC20 bonus", async function () {
            await bonusOracle.addPriceFeed(await signers[1].getAddress(), mockAggregator.address);
            await mockAggregator.updateAnswer(2000);
            const bonus = await bonusOracle.getERC20Bonus(await signers[1].getAddress());
            expect(bonus).to.equal(100);
        });

        it("should return zero if no price feed", async function () {
            const bonus = await bonusOracle.getERC20Bonus(await signers[1].getAddress());
            expect(bonus).to.equal(0);
        });
    });

    describe("getERC20Price", function () {
        it("should return correct ERC20 price", async function () {
            await bonusOracle.addPriceFeed(await signers[1].getAddress(), mockAggregator.address);
            await mockAggregator.updateAnswer(2000);
            const price = await bonusOracle.getERC20Price(await signers[1].getAddress());
            expect(price).to.equal(2000);
        });

        it("should return zero if no price feed", async function () {
            const price = await bonusOracle.getERC20Price(await signers[1].getAddress());
            expect(price).to.equal(0);
        });
    });
});
