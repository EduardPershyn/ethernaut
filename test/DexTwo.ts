const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "DexTwo";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy();

        const Token1Factory = await ethers.getContractFactory("SwappableTokenTwo");
        const token1Contract = await Token1Factory.deploy(victimContract.address, "Token1", "T1", 110);

        const Token2Factory = await ethers.getContractFactory("SwappableTokenTwo");
        const token2Contract = await Token2Factory.deploy(victimContract.address, "Token2", "T2", 110);

        await victimContract.setTokens(token1Contract.address, token2Contract.address);
        await token1Contract.transfer(attackerWallet.address, 10);
        await token2Contract.transfer(attackerWallet.address, 10);
        await token1Contract.transfer(victimContract.address, 100);
        await token2Contract.transfer(victimContract.address, 100);

        return { owner, victimContract, attackerWallet, token1Contract, token2Contract };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract, token1Contract, token2Contract;
        before(async function () {
            ({ owner, victimContract, attackerWallet, token1Contract, token2Contract } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            const AttackerFactory = await ethers.getContractFactory("Solution15");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);
        });

        after(async function () {
            expect(await token1Contract.balanceOf(victimContract.address)).to.be.equal(0);
            expect(await token2Contract.balanceOf(victimContract.address)).to.be.equal(0);
        });
    });
});