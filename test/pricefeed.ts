import { ethers } from "hardhat";
import { expect } from "chai";
import {MockV3Aggregator} from "../typechain-types";

describe("MockV3Aggregator", function () {
  let mockV3Aggregator: MockV3Aggregator;

  beforeEach(async function () {
    const MockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator");
    mockV3Aggregator = await MockV3AggregatorFactory.deploy(18, ethers.utils.parseEther("2000")) as MockV3Aggregator;
    await mockV3Aggregator.deployed();
  });

  it("should have correct initial state", async function () {
    expect(await mockV3Aggregator.decimals()).to.equal(18);
    const [, initialAnswer] = await mockV3Aggregator.latestRoundData();
    expect(initialAnswer).to.equal(ethers.utils.parseEther("2000"));
  });
});