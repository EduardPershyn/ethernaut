const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

const NAME = "King";

describe.only(NAME, function () {
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
            // New king
            const AttackerFactory = await ethers.getContractFactory("Solution13");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);
            await attackerContract.connect(attackerWallet).attack({value: ethers.utils.parseEther("2")});

            // Try Reclaim kingship
//             await owner.sendTransaction({
//               to: victimContract.address,
//               value: ethers.utils.parseEther("0"),
//             });
        });

        after(async function () {
            expect(await victimContract._king()).to.be.equal(attackerContract.address);
        });
    });
});