import Contract from './Contract';
import { assertEvents } from '../util/assert';

let Logistic = artifacts.require("Logistic");

function parseDestination(arrayDestination) {
    if (arrayDestination.length <= 0)
        throw "bad array destination";

    result = null;
    arrayDestination.forEach((v) => {
        let data = v.toArray();
        (result || Array(data.length).fill([])).forEach((ar, i) => ar.push(data[i]));
    });
}

class LogisticContract extends Contract {
    constructor(fromAccount, destinationArray) {
        super(fromAccount);
        this.destinations = destinationArray;
    }

    async initContract() {
        resultForSolidity = parseDestination(this.destinations);
        this.contract = await Logistic.new(...resultForSolidity, {from: this.fromAccount});
    }

    async getPath(pathId) {
        let block = await contract.getPath(pathId, {from: role.some});
        console.log("getPath gas: " + this._getGasUsed(block));
        return block;
    }

    async validatorSend(validatorAddress, secret) {
        let block = await this.contract.validatorSend(secret, {from: validatorAddress});
        assertEvents(block, "SuccessDestination");

        return this._getGasUsed(block);
    }
}

export default LogisticContract;
