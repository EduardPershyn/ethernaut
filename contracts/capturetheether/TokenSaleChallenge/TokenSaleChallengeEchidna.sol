pragma solidity ^0.4.21;

import "./TokenSaleChallenge.sol";

contract TokenSaleChallengeEchidna is TokenSaleChallenge {

    address echidna = msg.sender;

    function TokenSaleChallengeEchidna() public payable TokenSaleChallenge(echidna) {}

    function isCompleteTest() public {
        assert(isComplete() == false);
    }
}