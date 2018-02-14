class Destination {
    constructor(companyContract, cost, secret, secretOfDocument, ttl) {
        this.companyContract = companyContract;
        this.cost = cost;
        this.secret = secret;
        this.secretOfDocument = secretOfDocument;
        this.ttl = ttl || 10; /* seconds */
    }

    toArray() {
        return [this.companyContract, this.cost, this.secret, this.secretOfDocument, this.ttl];
    }

    static get _lengthOfArray() {
        return 5;
    }
}

function parseDestination(arrayDestination) {
    let result = Array.from({length: Destination._lengthOfArray}, () => []);
    arrayDestination.forEach((v) => {
        let data = v.toArray();

        result.forEach((ar, i) => {
            ar.push(data[i])
        });
    });

    return result;
}

export { Destination, parseDestination };
