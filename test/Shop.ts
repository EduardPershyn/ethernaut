const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Shop";

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
            const BuyerFactory = await ethers.getContractFactory("BuyerImpl");
            const buyerContract = await BuyerFactory.connect(attackerWallet).deploy(victimContract.address);

            const AttackerFactory = await ethers.getContractFactory("Solution5");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(buyerContract.address);

            await attackerContract.connect(attackerWallet).attack();
        });

        after(async function () {
            expect(await victimContract.price.call()).to.be.below(100);
        });
    });
});