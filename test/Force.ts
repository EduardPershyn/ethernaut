const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Force";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy();

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            const AttackerFactory = await ethers.getContractFactory("Solution11");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);

            await attackerContract.connect(attackerWallet).attack({value: ethers.utils.parseEther("1")});
        });

        after(async function () {
            expect(await ethers.provider.getBalance(victimContract.address)).to.be.above(0);
        });
    });
});