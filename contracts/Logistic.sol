pragma solidity ^0.4.17;

import './Company.sol';
import './ownership/Owner.sol';

contract Logistic is Owner {
    struct FinalDestination {
        address companyContract;
        uint cost;

        bytes32 secret;
        bytes32 secretOfDocument;
    }

    FinalDestination[] public basicPlaces;
    uint public currentDestination;

    modifier active() {
        require(currentDestination >= 0 && currentDestination < basicPlaces.length);
        _;
    }

    function Logistic(address[] companyContract,
        uint[] cost,
        bytes32[] secret,
        bytes32[] secretOfDocument) public {
        require(companyContract.length > 0);
        require(companyContract.length == cost.length);
        require(companyContract.length == secret.length);
        require(companyContract.length == secretOfDocument.length);

        for (uint i = 0; i < companyContract.length; i++) {
            basicPlaces.push(FinalDestination({
                companyContract: companyContract[i],
                cost: cost[i],
                secret: secret[i],
                secretOfDocument: secretOfDocument[i]
            }));
        }

        currentDestination = 0;
    }

    function getPath(uint pathId) public view returns (address, uint, bytes32, bytes32) {
        require(pathId < basicPlaces.length);
        return (basicPlaces[pathId].companyContract,
            basicPlaces[pathId].cost,
            basicPlaces[pathId].secret,
            basicPlaces[pathId].secretOfDocument);
    }

    function validatorSend(string secret) external payable active {
        FinalDestination memory dst = basicPlaces[currentDestination];
        require(sha256(secret) == dst.secret);

        currentDestination += 1;

        Company(dst.companyContract).payForTransfer.value(dst.cost)();
        SuccessDestination(currentDestination - 1);
    }

    event SuccessDestination(uint number);
}
