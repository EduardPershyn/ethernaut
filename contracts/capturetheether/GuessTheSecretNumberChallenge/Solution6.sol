// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// PRN games can be guessed by duplicating prng code

interface IGuessTheSecretNumberChallenge {
    function guess(uint8 n) external payable;
}

contract Solution6 {
    IGuessTheSecretNumberChallenge public victim;

    constructor(IGuessTheSecretNumberChallenge victim_) {
        victim = victim_;
    }

    function attack() external payable {
        bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;
        uint8 answer;
        for (uint8 n = 0; n < type(uint8).max; n++) {
            if (keccak256(abi.encodePacked(n)) == answerHash) {
                answer = n;
                victim.guess{value:1 ether}(answer);
                return;
            }
        }
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    receive() external payable {
    }
}
