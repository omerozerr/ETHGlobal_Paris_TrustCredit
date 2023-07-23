import { ethers } from "hardhat";
import { expect } from "chai";
import { BonusOracle, LendingProtocol, MockERC20, UserID, LendingAccount6551, MockRegistry6551, MockERC721 } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LendingProtocol", function () {
    let signers: SignerWithAddress[];
    let lendingProtocol: LendingProtocol;
    let mockERC20: MockERC20;
    let bonusOracle: BonusOracle;
    let userId: UserID;
    let lendingAccount: LendingAccount6551;
    let mockRegistry: MockRegistry6551;
    let mockERC721: MockERC721;

    beforeEach(async function () {
        signers = await ethers.getSigners();

        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        mockERC20 = (await MockERC20Factory.deploy()) as MockERC20;

        const IterableMappingFactory = await ethers.getContractFactory("IterableMapping");
        const iterableMapping = await IterableMappingFactory.deploy();

        const BonusOracleFactory = await ethers.getContractFactory("BonusOracle", {
            libraries: {
                IterableMapping: iterableMapping.address
            }
        });
        bonusOracle = (await BonusOracleFactory.deploy()) as BonusOracle;

        const UserIDFactory = await ethers.getContractFactory("UserID");
        userId = (await UserIDFactory.deploy(bonusOracle.address)) as UserID;

        const MockRegistry6551Factory = await ethers.getContractFactory("MockRegistry6551");
        mockRegistry = (await MockRegistry6551Factory.deploy()) as MockRegistry6551;

        const LendingProtocolFactory = await ethers.getContractFactory("LendingProtocol");
        lendingProtocol = (await LendingProtocolFactory.deploy(userId.address, bonusOracle.address, mockERC20.address, mockERC20.address)) as LendingProtocol;

        const MockERC721Factory = await ethers.getContractFactory("MockERC721");
        mockERC721 = (await MockERC721Factory.deploy()) as MockERC721;
        await mockERC721.safeMint(signers[0].address, 1);

        const LendingAccount6551Factory = await ethers.getContractFactory("LendingAccount6551");
        const imp = await LendingAccount6551Factory.deploy();

        // Create a new LendingAccount6551 for each test using the mock registry
        const implementation = imp.address;
        const chainId = (await ethers.provider.getNetwork()).chainId; // Get chainId from Hardhat
        const tokenId = 1;
        const salt = 123456;
        const initData = "0x"; // Replace with your actual initialization data
        await mockRegistry.createAccount(implementation, chainId, mockERC721.address, tokenId, salt, initData);
        const lendingAccountAddress = await mockRegistry.account(implementation, chainId, mockERC721.address, tokenId, salt);
        lendingAccount = LendingAccount6551Factory.attach(lendingAccountAddress) as LendingAccount6551;
    });

    describe("deposit", function () {
        it("should increase contract's balance", async function () {
            await mockERC20.mint(signers[0].address, ethers.utils.parseEther("1"));
            await mockERC20.approve(lendingProtocol.address, ethers.utils.parseEther("1"));
            const beforeBalance = await mockERC20.balanceOf(lendingProtocol.address);
            await lendingProtocol.deposit(mockERC20.address, ethers.utils.parseEther("1"));
            const afterBalance = await mockERC20.balanceOf(lendingProtocol.address);
            expect(afterBalance.sub(beforeBalance)).to.equal(ethers.utils.parseEther("1"));
        });
    });

    describe("borrow", function () {
        it("should decrease contract's balance and increase user's balance", async function () {
            await mockERC20.mint(signers[0].address, ethers.utils.parseEther("2"));
            await mockERC20.approve(lendingProtocol.address, ethers.utils.parseEther("2"));
            await lendingProtocol.deposit(mockERC20.address, ethers.utils.parseEther("2"));
            const beforeContractBalance = await mockERC20.balanceOf(lendingProtocol.address);
            const beforeUserBalance = await mockERC20.balanceOf(signers[0].address);
            await lendingProtocol.borrow(mockERC20.address, lendingAccount.address, ethers.utils.parseEther("1"));
            const afterContractBalance = await mockERC20.balanceOf(lendingProtocol.address);
            const afterUserBalance = await mockERC20.balanceOf(signers[0].address);
            expect(beforeContractBalance.sub(afterContractBalance)).to.equal(ethers.utils.parseEther("1"));
            expect(afterUserBalance.sub(beforeUserBalance)).to.equal(ethers.utils.parseEther("1"));
        });
    });

    describe("repay", function () {
        it("should increase contract's balance and decrease user's balance", async function () {
            await mockERC20.mint(signers[0].address, ethers.utils.parseEther("20"));
            await mockERC20.approve(lendingProtocol.address, ethers.constants.MaxUint256);
            await lendingProtocol.deposit(mockERC20.address, ethers.utils.parseEther("2"));
            await lendingProtocol.borrow(mockERC20.address, lendingAccount.address, ethers.utils.parseEther("1"));
            const beforeContractBalance = await mockERC20.balanceOf(lendingProtocol.address);
            const beforeUserBalance = await mockERC20.balanceOf(signers[0].address);
            await lendingProtocol.repay(mockERC20.address);
            const afterContractBalance = await mockERC20.balanceOf(lendingProtocol.address);
            const afterUserBalance = await mockERC20.balanceOf(signers[0].address);
            expect(afterContractBalance.sub(beforeContractBalance)).to.equal(ethers.utils.parseEther("1.02"));
            expect(beforeUserBalance.sub(afterUserBalance)).to.equal(ethers.utils.parseEther("1.02"));
        });
    });
});
