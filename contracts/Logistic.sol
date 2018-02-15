pragma solidity ^0.4.17;

import './Company.sol';
import './ownership/Owner.sol';

contract Logistic is Owner {
    struct FinalDestination {
        address companyContract;
        uint cost;
        bytes32 hashOfSecret;
        bytes32 hashOfTravelDocs;
        uint ttl;
    }

    FinalDestination[] public basicPlaces;
    uint public currentDestination;
    uint public lastTime;

    modifier active() {
        require(currentDestination >= 0 && currentDestination < basicPlaces.length);
        _;
    }

    function Logistic(address[] companyContract,
        uint[] cost,
        bytes32[] hashOfSecret,
        bytes32[] hashOfTravelDocs,
        uint[] ttl) public payable {

        require(companyContract.length > 0);
        require(companyContract.length == cost.length);
        require(companyContract.length == hashOfSecret.length);
        require(companyContract.length == hashOfTravelDocs.length);
        require(companyContract.length == ttl.length);

        currentDestination = 0;
        lastTime = now;

        uint finalCost = 0; uint tempCost;
        for (uint i = 0; i < companyContract.length; i++) {
            tempCost = finalCost;
            finalCost += cost[i];

            /* Integer Overflow */
            require(finalCost >= tempCost);

            basicPlaces.push(FinalDestination({
                companyContract: companyContract[i],
                cost: cost[i],
                hashOfSecret: hashOfSecret[i],
                hashOfTravelDocs: hashOfTravelDocs[i],
                ttl: ttl[i]
                }));
        }

        require(msg.value >= finalCost);

        /* return rest amount */
        if (msg.value > finalCost) {
            uint restAmount = msg.value - finalCost;
            ReturnMoney(msg.sender, restAmount);
            msg.sender.transfer(restAmount);
        }
    }

    function getPath(uint pathId) public view returns (address, uint, bytes32, bytes32, uint) {
        require(pathId < basicPlaces.length);
        return (basicPlaces[pathId].companyContract,
        basicPlaces[pathId].cost,
        basicPlaces[pathId].hashOfSecret,
        basicPlaces[pathId].hashOfTravelDocs,
        basicPlaces[pathId].ttl);
    }

    function validatorSend(string secret) public active {
        FinalDestination memory dst = basicPlaces[currentDestination];
        require(sha256(secret) == dst.hashOfSecret);
        require(lastTime + dst.ttl >= now);

        currentDestination += 1;

        Company(dst.companyContract).payForTransfer.value(dst.cost)();

        /* last validator */
        if (currentDestination != basicPlaces.length)
            SuccessPath(currentDestination - 1);
        else
            SuccessDestination();
    }

    function returnMoney() public onlyOwner active {
        FinalDestination memory dst = basicPlaces[currentDestination];
        require(lastTime + dst.ttl < now);

        ReturnMoneyAll(owner);

        /* company was late */
        selfdestruct(owner);
    }

    event ReturnMoney(address addr, uint amount);
    event ReturnMoneyAll(address addr);

    event SuccessPath(uint number);
    event SuccessDestination();
}
