import CompanyContract from './model/CompanyContract';
import LogisticContract from './model/LogisticContract';

import { getBigWeiBalance, etowei } from './util/util';
import { Destination } from './object/Destination';

let expectThrow = require('./util/expectThrow');

contract("Logistic", function(accounts) {
    let tests;

    const role = {
        sender: accounts[0],
        receiver: accounts[1],

        /* train */
        trainCompany: accounts[2],
        trainValidator: accounts[3],

        /* air */
        airCompany: accounts[4],
        airValidator: accounts[5],

        some: accounts[6]
    };

    const secrets = {
        secret1: "secret",
        secret1Hash: "0x2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b",
        secret2: "secret2",
        secret2Hash: "0x35224d0d3465d74e855f8d69a136e79c744ea35a675d3393360a327cbf6359a2",
        someHash: "0xa6b46dd0d1ae5e86cbc8f37e75ceeb6760230c1ca4ffbcb0c97b96dd7d9c464b"
    };

    async function startCompaniesTrainAir() {
        let trainContract = new CompanyContract(role.trainCompany, "train");
        await trainContract.initContract();
        await trainContract.addValidator(role.trainValidator);

        let airContract = new CompanyContract(role.airCompany, "air");
        await airContract.initContract();
        await airContract.addValidator(role.airValidator);

        return [trainContract, airContract];
    }

    async function startCompanyTrain() {
        let trainContract = new CompanyContract(role.trainCompany, "train");
        await trainContract.initContract();
        await trainContract.addValidator(role.trainValidator);
        return trainContract;
    }

    it("base smoke test", async function() {
        let companies = await startCompaniesTrainAir();

        let data = [
            new Destination(companies[0].address, 10, secrets.secret1Hash, secrets.someHash),
            new Destination(companies[1].address, 10, secrets.secret2Hash, secrets.someHash)
        ];

        let logisticContract = new LogisticContract(role.sender, data);
        await logisticContract.initContract(20);

        let checkPath = (path, destinations) => {
            destinations.toArray().forEach((v, i) => assert.equal(v, path[i], `bad save path ${i} in contract`));
        };

        checkPath(await logisticContract.getPath(role.some, 0), data[0]);
        checkPath(await logisticContract.getPath(role.some, 1), data[1]);

        /* pass train */
        await logisticContract.validatorSend(role.trainValidator, secrets.secret1);

        /* pass air */
        await logisticContract.validatorSend(role.airValidator, secrets.secret2, true);

        /* bad */
        await expectThrow(logisticContract.validatorSend(role.trainValidator, secrets.secret1));
        await expectThrow(logisticContract.validatorSend(role.airValidator, secrets.secret2));
    });

    it("check bad path", async function() {
        let logisticContract = new LogisticContract(role.sender, []);

        /* cannot create contract */
        await expectThrow(logisticContract.initContract(20));
    });

    it("bad validator or hash", async function () {
        let trainContract = new CompanyContract(role.trainCompany, "train");
        await trainContract.initContract();

        await trainContract.addValidator(role.trainValidator);

        let data = [ new Destination(trainContract.address, 10, secrets.secret1Hash, secrets.someHash) ];

        let logisticContract = new LogisticContract(role.sender, data);
        await logisticContract.initContract(10);

        /* try bad validator */
        await expectThrow(logisticContract.validatorSend(role.some, secrets.secret1));

        /* try bad hash */
        await expectThrow(logisticContract.validatorSend(role.trainValidator, secrets.secret2));
    });

    it("return money if a lot", async function() {
        let trainContract = startCompanyTrain();

        let data = [
            new Destination(trainContract.address, 10, secrets.secret1Hash, secrets.someHash),
        ];

        let amount, beforeAmount = await getBigWeiBalance(role.sender);
        let logisticContract = new LogisticContract(role.sender, data);
        await logisticContract.initContract(20);

        amount = await getBigWeiBalance(role.sender);

        assert.isOk(beforeAmount.minus(amount).minus(logisticContract.contractGasUsage).equals(10),
            "bad contract, contract didn't return money");
        assert.isOk((await logisticContract.getBigBalance()).equals(10),
            "bad amount in contract");
    });

    it("revert if not enough", async function() {
        let trainContract = startCompanyTrain();

        let data = [
            new Destination(trainContract.address, 10, secrets.secret1Hash, secrets.someHash),
        ];

        let amount, beforeAmount = await getBigWeiBalance(role.sender);
        let logisticContract = new LogisticContract(role.sender, data);

        await expectThrow(logisticContract.initContract(9));
    });

    tests = [true, false];
    tests.forEach(function(isExpire) {
        it("return money if company was " + ((isExpire) ? "late" : "in time"), async function () {
            let time = 1000; /* seconds */
            let trainContract = await startCompanyTrain();

            let data = [
                new Destination(trainContract.address, 10, secrets.secret1Hash, secrets.someHash, time),
            ];

            let logisticContract = new LogisticContract(role.sender, data);
            await logisticContract.initContract(10);

            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [(isExpire) ? time + 1 : time - 1],
                id: 0
            });

            web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});

            let promise = logisticContract.validatorSend(role.trainValidator, secrets.secret1, true);
            if (!isExpire) {
                await promise;
            } else {
                await expectThrow(promise);
            }
        });
    });

});
