pragma solidity ^0.4.17;

import './ownership/OwnerOfValidators.sol';

contract Company is OwnerOfValidators {
    string public name;

    function Company(string name_) public {
        name = name_;
    }

    function payForTransfer() external payable {
        require(msg.value > 0);

        // ourValidators[msg.sender].transfer(1);
        PayValidator(msg.sender);
    }

    event PayValidator(address validatorAddress);
}
