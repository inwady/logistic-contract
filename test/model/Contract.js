import { getBigWeiBalance } from '../util/util';

class Contract {
    constructor(fromAccount) {
        this.contract = null;
        this.fromAccount = fromAccount;
    }

    initContract() { throw "need to implement this method"; }

    async getBigBalance() {
        assert.isNotNull(this.contract, "bad contract");

        return await getBigWeiBalance(this.contract.address);
    }

    get contractGasUsage() {
        let block = web3.eth.getTransactionReceipt(this.contract.transactionHash);
        return block.gasUsed * web3.eth.getTransaction(this.contract.transactionHash).gasPrice;
    }

    get address() {
        return this.contract.address;
    }

    getImplContract() {
        return this.contract;
    }

    get transaction() {
        return this.contract.transactionHash;
    }

    _getGasUsed(block) {
        return block.receipt.gasUsed * web3.eth.getTransaction(block.tx).gasPrice;
    }
}

export default Contract;
