const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

import { BigNumber } from "ethers";

const NAME = "Recovery";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet ] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy();

        await victimContract.generateToken("Simple", 10);

        const lostSimpleToken = await ethers.getContractAt(
          "SimpleToken",
          "0xa16e02e87b7454126e5e10d957a927a7f5b5d2be",
          owner
        );

        await owner.sendTransaction({
          to: lostSimpleToken.address,
          value: ethers.utils.parseEther("0.1"),
        });

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract, balanceBefore;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
             balanceBefore = new BigNumber.from(await ethers.provider.getBalance(attackerWallet.address));

            const AttackerFactory = await ethers.getContractFactory("Solution16");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);

            await attackerContract.connect(attackerWallet).attack();
        });

        after(async function () {
            const balanceAfter = new BigNumber.from(await ethers.provider.getBalance(attackerWallet.address));
            const balanceSub = balanceAfter.sub(balanceBefore);
            expect(balanceSub).to.be.closeTo(
                                            new BigNumber.from(ethers.utils.parseEther("0.1")),
                                            ethers.utils.parseEther("0.001")
                                          );
        });
    });
});