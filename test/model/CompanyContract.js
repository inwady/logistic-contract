import Contract from './Contract';
import { assertEvents } from '../util/assert';

let Company = artifacts.require("Company");

class CompanyContract extends Contract {
    constructor(fromAccount, name) {
        super(fromAccount);
        this.name = name || "unknown";
    }

    async initContract() {
        console.log(this.name);
        console.log(this.fromAccount);
        this.contract = await Company.new(this.name, {from: this.fromAccount});
    }

    async addValidator(address) {
        assert.isNotNull(this.contract, "bad contract");

        let block = await this.contract.addValidator(address, {from: this.fromAccount});
        assertEvents(block, "AddValidator");

        return this._getGasUsed(block);
    }

    async removeValidator(address) {
        assert.isNotNull(this.contract, "bad contract");

        let block = await this.contract.removeValidator(address, {from: this.fromAccount});
        assertEvents(block, "RemoveValidator");

        return this._getGasUsed(block);
    }
}

export default CompanyContract;
