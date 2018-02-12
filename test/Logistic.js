import CompanyContract from './model/CompanyContract';
import LogisticContract from './model/LogisticContract';

import Destination from './object/Destination';

// TODO getCreationTime

contract("Logistic", function(accounts) {
    const role = {
        sender: accounts[0],
        receiver: accounts[1],
        trainCompany: accounts[2],
        airCompany: accounts[3],
        some: accounts[4]
    };

    const secrets = {
        secret1: "secret",
        secret1Hash: "0x2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b",
        secret2: "secret2",
        secret2Hash: "0x35224d0d3465d74e855f8d69a136e79c744ea35a675d3393360a327cbf6359a2",
        someHash: "0xa6b46dd0d1ae5e86cbc8f37e75ceeb6760230c1ca4ffbcb0c97b96dd7d9c464b"
    };

    async function startCompanies() {
        let trainContract = new CompanyContract(role.trainCompany, "train");
        await trainContract.initContract();

        let airContract = new CompanyContract(role.airCompany, "air");
        await airContract.initContract();

        return [trainContract, airContract];
    }

    it("base smoke test", async function() {
        console.log("!");
        let companies = await startCompanies();
        console.log("!");
        let data = [
            new Destination(companies[0], 10, secrets.secret1Hash, secrets.someHash),
            new Destination(companies[1], 10, secrets.secret2Hash, secrets.someHash)
        ];
        console.log("!");

        let logistic = new LogisticContract(role.sender, data);
        console.log("!");
        logistic.initContract();
    });
});