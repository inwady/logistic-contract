import Contract from './Contract';
import { assertEvents } from '../util/assert';
import { parseDestination } from '../object/Destination';

let Logistic = artifacts.require("Logistic");

class LogisticContract extends Contract {
    constructor(fromAccount, destinationArray) {
        super(fromAccount);
        this.destinations = destinationArray;
    }

    async initContract(value) {
        let resultForSolidity = parseDestination(this.destinations);
        this.contract = await Logistic.new(...resultForSolidity, {
            from: this.fromAccount,
            value: value,
        });
    }

    async validatorSend(validatorAddress, secret, finalFlag) {
        finalFlag = finalFlag || false;

        let block = await this.contract.validatorSend(secret, {from: validatorAddress});

        let events = ["SuccessPath"];
        if (finalFlag)
            events.push("SuccessDestination");

        assertEvents(block, ...events);

        return this._getGasUsed(block);
    }

    /* use view */
    async getPath(someAddress, pathId) {
        return await this.contract.getPath(pathId, {from: someAddress});
    }
}

export default LogisticContract;
