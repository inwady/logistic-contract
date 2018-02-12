pragma solidity ^0.4.17;

contract Owner {
    address public owner;
    uint public creationTime;

    function Owner() public {
        owner = msg.sender;
        creationTime = now;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function getCreationTime() public view returns (uint) {
        return creationTime;
    }
}
