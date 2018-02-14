pragma solidity ^0.4.17;

import './ownership/OwnerOfValidators.sol';

contract Company is OwnerOfValidators {
    string public nameOfCompany;
    uint constant COMMISSION_PERCENT = 6; /* % */

    function Company(string name) public {
        nameOfCompany = name;
    }

    /**
     *
     */
    function payForTransfer() external payable {
        require(msg.value > 0);
        require(ourValidators[tx.origin]);

        /* send commission */
        uint commission = (msg.value * COMMISSION_PERCENT) / 100;
        tx.origin.transfer(commission);

        PayValidator(tx.origin, commission);
        SuccessDelivery(msg.sender);
    }

    event PayValidator(address validatorAddress, uint amount);
    event SuccessDelivery(address addressContract);
}
