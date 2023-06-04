// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./MagicNum.sol";

import "hardhat/console.sol";

interface ISolver {
    function whatIsTheMeaningOfLife() external pure returns(uint256);
}

contract Solver {
    function whatIsTheMeaningOfLife() external pure returns(uint256) {
        return 42;
    }
}

contract Solution18 {
    MagicNum public victim;

    constructor(MagicNum victim_) {
        victim = victim_;
    }

    function attack() external  {
        // 10 bytes long Solver bytecode implementation
        // Push and store our value (0x2a) in the memory
        // 1. 0x60 - PUSH1 --> PUSH(0x2a) --> 0x602a (Pushing 2a or 42)
        // 2. 0x60 - PUSH1 --> PUSH(0x80) --> 0x6080 (Pushing an arbitrary selected memory slot 80)
        // 3. 0x52 - MSTORE --> MSTORE --> 0x52 (Store value p=0x2a at position v=0x80 in memory)
        //
        // Return the stored value
        // 1. 0x60 - PUSH1 --> PUSH(0x20) --> 0x6020 (Size of value is 32 bytes)
        // 2. 0x60 - PUSH1 --> PUSH(0x80) --> 0x6080 (Value was stored in slot 0x80)
        // 3. 0xf3 - RETURN --> RETURN --> 0xf3 (Return value at p=0x80 slot and of size s=0x20)


        //bytes memory code = "\x60\x2a\x60\x80\x52\x60\x20\x60\x80\xf3";
        bytes memory code = hex"60_2a_60_80_52_60_20_60_80_f3";

        //address newContract = address(new Solver());
        address newContract = deploy(code);
        victim.setSolver(newContract);
    }

    function checkNumber() external view returns(uint256) {
        return ISolver(victim.solver()).whatIsTheMeaningOfLife();
    }

    function deploy(bytes memory _data) internal returns (address pointer) {

        bytes memory code = abi.encodePacked(
            hex"63",
            uint32(_data.length),
            hex"80_60_0E_60_00_39_60_00_F3",
            _data
        );

        assembly {
            pointer := create(0, add(code, 32), mload(code))
        }
    }
    /*
      0x00    0x63         0x63XXXXXX  PUSH4 _data.length  size
      0x01    0x80         0x80        DUP1                size size
      0x02    0x60         0x600e      PUSH1 14            14 size size
      0x03    0x60         0x6000      PUSH1 00            0 14 size size
      0x04    0x39         0x39        CODECOPY            size
      0x05    0x60         0x6000      PUSH1 00            0 size
      0x06    0xf3         0xf3        RETURN
      <CODE>
    */
}
