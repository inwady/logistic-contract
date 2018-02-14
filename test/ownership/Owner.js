'use strict';

let Owner = artifacts.require("Owner");

contract("Owner", function(accounts) {
    let role = {
        owner: accounts[0],
    };

    it("base smoke test", async function() {
        let contract = await Owner.new({from: role.owner});
        assert.equal(await contract.owner(), role.owner, "bad owner");
    });

    it("create contract, check time", async function() {
        let contract = await Owner.new({from: role.owner});
        let blockNumber = web3.eth.getTransactionReceipt(contract.transactionHash).blockNumber;
        assert.equal(await contract.creationTime(), web3.eth.getBlock(blockNumber).timestamp, "bad timestamp");
    });
});
