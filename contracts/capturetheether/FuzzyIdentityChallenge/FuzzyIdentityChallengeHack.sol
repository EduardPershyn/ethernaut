// SPDX-License-Identifier: GPL-3.0
//pragma solidity ^0.4.21;
pragma solidity ^0.8.0;

import "./FuzzyIdentityChallenge.sol";

// To take ownership we need contract with address containing 'badc0de' string in it.
// We need create contract with address containing 'badc0de'.
// CREATE opcode takes (msg.sender, nonce)
// We need private key that will give on 0 nonce, contract address with 'badc0de' .
// We can generate private keys until we find one. Generation code see inside ts file.
// TIP: CREATE only on sol 0.4, sol 0.8 has CREATE2 with salt logic.

import "hardhat/console.sol";

//contract FuzzyIdentityHackHelper is IName {
//    function name() external view returns (bytes32) {
//        return "smarx";
//    }
//
//    function auth(FuzzyIdentityChallenge victim) public {
//        victim.authenticate();
//    }
//}

contract FuzzyIdentityChallengeHack is IName {
    FuzzyIdentityChallenge public victim;

    constructor(FuzzyIdentityChallenge victim_) public {
        victim = victim_;
    }

    function name() external view returns (bytes32) {
        return "smarx";
    }

    function attack() external {
        //bytes32 salt = bytes32(1234);
        //FuzzyIdentityHackHelper helper = new FuzzyIdentityHackHelper{salt: 1234}();

//        FuzzyIdentityHackHelper helper = new FuzzyIdentityHackHelper();
//        console.log(address(helper));
//        helper.auth(victim);

        console.log(address(this));
        victim.authenticate();
    }
}
