import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import {BonusOracle, MockERC721, MockV3Aggregator, UserID} from "../typechain-types";

describe("UserID", function () {
    let userID: UserID;
    let bonusOracle: BonusOracle;
    let mockERC721: MockERC721;
    let mockAggregator: MockV3Aggregator;
    let signers: Signer[];

    beforeEach(async function () {
        // Get signers
        signers = await ethers.getSigners();

        const MockERC721Factory = await ethers.getContractFactory("MockERC721");
        mockERC721 = await MockERC721Factory.deploy() as MockERC721;
        await mockERC721.deployed();

        const MockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator");
        mockAggregator = await MockV3AggregatorFactory.deploy(18, ethers.utils.parseEther("2000")) as MockV3Aggregator;
        await mockAggregator.deployed();

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

        const UserIDFactory = await ethers.getContractFactory("UserID");
        userID = await UserIDFactory.deploy(bonusOracle.address) as UserID;
        await userID.deployed();
    });

    describe("bonusOracle", function () {
        it("should return correct bonus oracle address", async function () {
            const oracleAddress = await userID.bonusOracle();
            expect(oracleAddress).to.equal(bonusOracle.address);
        });
    });

    describe("getAccountCreditScore", function () {
        it("should return zero if account does not own any tokens", async function () {
            const score = await userID.getAccountCreditScore(await signers[1].getAddress(), mockERC721.address, 0);
            expect(score).to.equal(0);
        });

        it("should return correct credit score", async function () {
            await userID.safeMint({ value: ethers.utils.parseEther("1") });
            await bonusOracle.setTokenBonus(mockERC721.address, 100, 3600);
            await bonusOracle.addPriceFeed(await signers[1].getAddress(), mockAggregator.address);
            await mockAggregator.updateAnswer(2000);
            const score = await userID.getAccountCreditScore(await signers[0].getAddress(), await signers[1].getAddress(), 1);
            expect(score).to.be.within(1, 1000);
        });
    });

    describe("safeMint", function () {
        it("should mint a new token", async function () {
            await userID.safeMint({ value: ethers.utils.parseEther("1") });
            expect(await userID.balanceOf(await signers[0].getAddress())).to.equal(1);
        });
    });

    describe("_beforeTokenTransfer", function () {
        it("should not allow token transfer", async function () {
            await userID.safeMint({ value: ethers.utils.parseEther("1") });
            await expect(userID.transferFrom(await signers[0].getAddress(), await signers[1].getAddress(), 0)).to.be.revertedWith("This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
        });
    });
});
