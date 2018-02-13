class Destination {
    constructor(companyContract, cost, secret, secretOfDocument) {
        this.companyContract = companyContract;
        this.cost = cost;
        this.secret = secret;
        this.secretOfDocument = secretOfDocument;
    }

    toArray() {
        return [this.companyContract, this.cost, this.secret, this.secretOfDocument];
    }
}

const destinationCountArguments = 4;

export { Destination, destinationCountArguments };
