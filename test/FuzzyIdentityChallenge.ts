const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
var crypto = require("crypto");

const NAME = "FuzzyIdentityChallenge";

describe.only(NAME, function () {
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
            const privateKey = findMatchingPrivateKey();
            console.log(privateKey);
            const newWallet = new ethers.Wallet(privateKey);
            const newSigner = newWallet.connect(ethers.provider);
            await owner.sendTransaction({
              to: newSigner.address,
              value: ethers.utils.parseEther("1.0"),
            });

            const AttackerFactory = await ethers.getContractFactory("FuzzyIdentityChallengeHack");
            attackerContract = await AttackerFactory.connect(newSigner).deploy(victimContract.address);
            await attackerContract.connect(attackerWallet).attack();
        });

        after(async function () {
            expect(await victimContract.isComplete()).to.be.equal(true);
        });
    });
});

const findMatchingPrivateKey = () => {
  const NONCE = ethers.BigNumber.from(`0`);
  let foundKey: HDNode | undefined = undefined;
  // choose 512 bits of randomness like BIP39 would for when deriving seed from mnemonic
  // this is probably very inefficient compared to just deriving a key from randomness
  // as it involves several hash functions when deriving the key from index
  const masterKey = ethers.utils.HDNode.fromSeed(crypto.randomBytes(512 / 8));
  const getPathForIndex = (index: number) => `m/44'/60'/0'/0/${index}`;

  let counter = 0;

  while (!foundKey) {
    const key = masterKey.derivePath(getPathForIndex(counter));
    const from = key.address;
    const contractAddr = ethers.utils.getContractAddress({
      from,
      nonce: NONCE,
    });
    //if (contractAddr.toLowerCase().includes(`badc0de`)) {
    if (contractAddr.toLowerCase().includes(`badc`)) {
      foundKey = key;
    }

    counter++;
    if (counter % 1000 == 0) {
      console.log(`Checked ${counter} addresses`);
    }
  }

  return foundKey.privateKey;
};