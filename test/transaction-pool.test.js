const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');
const Blockchain = require("../blockchain/blockchain");

describe('TransactionPool', function(){
    let tp, senderWallet, transaction, bc;

    beforeEach(() => {
        tp = new TransactionPool();
        senderWallet = new Wallet();
        bc = new Blockchain()
        transaction = senderWallet.createTransaction('r4nd-4ddr355', 30, bc, tp);
    });

    it('adds a transaction to the pool', function(){
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', function(){
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(senderWallet, 'foo-4ddr355', 40);
        tp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    it('clear transactions', function(){
        tp.clear();
        expect(tp.transactions.length).toEqual(0);
    });

    describe('mixing valid and corrupt transactions', function(){
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...tp.transactions]
            for (let i = 0; i < 6; i++) {
                senderWallet = new Wallet();
                transaction = senderWallet.createTransaction('r4nd-4ddr355', 30, bc, tp);
                if (i % 2 === 0) {
                    transaction.input.amount = 999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows difference between valid and corrupt transactions', function(){
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions', function(){
            const newValidTransactions = tp.validTransactions();
            expect(newValidTransactions).toEqual(validTransactions);
        });

    });

});