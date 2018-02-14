import CompanyContract from './model/CompanyContract';
import LogisticContract from "./model/LogisticContract";
import {Destination} from "./object/Destination";
import {etowei, getBigWeiBalance} from "./util/util";

let expectThrow = require('./util/expectThrow');
let BigNumber = require('bignumber.js');

let COMMISSION_PERCENT = 6;

contract("Company", function(accounts) {
    const role = {
        company: accounts[0],
        validator: accounts[1],
    };

    let tests;

    tests = [0.1, 5.5, 10];
    tests.forEach(function(ethereumPayment) {
        it("check commission of validator", async function () {
            const payment = etowei(ethereumPayment);
            const bigPayment = new BigNumber(payment);
            let bigCommission = bigPayment.mul(COMMISSION_PERCENT).div(100);

            let companyContract = new CompanyContract(role.company, "company");
            await companyContract.initContract();

            await companyContract.addValidator(role.validator);

            let gasUsed, amount, beforeAmount = await getBigWeiBalance(role.validator);

            let contract = companyContract.getImplContract();
            let block = await contract.payForTransfer({
                from: role.validator,
                value: payment,
            });

            amount = await getBigWeiBalance(role.validator);
            gasUsed = companyContract._getGasUsed(block);

            assert.isOk(amount.plus(gasUsed).plus(payment).minus(beforeAmount).equals(bigCommission), "bad commission");
        });
    });

});
