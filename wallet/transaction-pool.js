const Transaction = require("./transaction");

class TransactionPool {
    constructor(){
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction)
        }
    }

    existingTransaction(address){
        return this.transactions.find(t => t.input.address === address);
    }

    validTransaction(){
        return this.transactions.filter(transaction => {
            const outputTransaction = transaction.outputs.reduce((total, output) => {
                return total + output;
            }, 0);

            if (transaction.input.amount !== outputTransaction) {
                console.log(`Invalid transaction from ${transaction.input.address}`);
                return;
            }

            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}`);
                return;
            }

            return transaction;
        });
    }

}

module.exports = TransactionPool;