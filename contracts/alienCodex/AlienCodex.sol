// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

//import "openzeppelin-contracts-06/access/Ownable.sol";

import './Ownable-05.sol';
//import '../helpers/Ownable-05.sol';


contract AlienCodex is Ownable {

    bool public contact;
    bytes32[] public codex;

    modifier contacted() {
        assert(contact);
        _;
    }

    function makeContact() public {
        contact = true;
    }

    function record(bytes32 _content) contacted public {
        codex.push(_content);
    }

    function retract() contacted public {
        codex.length--;
    }

    function revise(uint i, bytes32 _content) contacted public {
        codex[i] = _content;
    }
}