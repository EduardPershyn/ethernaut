const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenBankChallenge";

describe(NAME, function () {
    describe("exploit", async function () {
        let victimContract;

        it("conduct your attack here", async function () {
            const [owner, attackerWallet] = await ethers.getSigners();
            const AttackerFactory = await ethers.getContractFactory("Solution10");
            const attackerContract = await AttackerFactory.connect(attackerWallet).deploy();

            const VictimFactory = await ethers.getContractFactory(NAME);
            victimContract = await VictimFactory.deploy(attackerContract.address);

            await attackerContract.connect(attackerWallet).setVictim(victimContract.address);

            await attackerContract.connect(attackerWallet).attack();
        });

        after(async function () {
            expect(await victimContract.isComplete()).to.be.equal(true);
        });
    });
});