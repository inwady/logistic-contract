import { role } from './Logistic';

import CompanyContract from './model/CompanyContract';

let expectThrow = require('./util/expectThrow');

contract("Company", function(accounts) {
    const role = {
        company: accounts[0],
        validator: accounts[1],
    };

    it("smoke test", async function() {
        let companyContract = new CompanyContract(role.company, "company");
        await companyContract.initContract();

        await companyContract.addValidator(role.validator);
        await companyContract.removeValidator(role.validator);
    });

    it("bad validator", async function() {
        let companyContract = new CompanyContract(role.company, "company");
        await companyContract.initContract();

        await expectThrow(companyContract.removeValidator(role.validator));
    });
});
