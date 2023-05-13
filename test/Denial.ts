const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

const NAME = "Denial";

describe.only(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy({value: ethers.utils.parseEther("1")});

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            const AttackerFactory = await ethers.getContractFactory("Solution14");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);

            //await expect(victimContract.connect(owner).withdraw()).to.be.revertedWithoutReason();

            let tx = await victimContract.connect(owner).withdraw();
            console.log(tx);

            console.log("Victim contract", await victimContract.contractBalance());
            console.log("Attacker Balance", await ethers.provider.getBalance(attackerContract.address));
        });

        after(async function () {

        });
    });
});