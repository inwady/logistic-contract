pragma solidity ^0.4.17;

import './Owner.sol';

contract OwnerOfValidators is Owner {
    mapping(address => bool) public ourValidators;

    function addValidator(address validator) public onlyOwner {
        ourValidators[validator] = true;
        AddValidator(validator);
    }

    function removeValidator(address validator) public onlyOwner {
        delete ourValidators[validator];
        RemoveValidator(validator);
    }

    event AddValidator(address addr);
    event RemoveValidator(address addr);
}
