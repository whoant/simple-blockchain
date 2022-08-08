const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');

describe('TransactionPool', function(){
    let tp, senderWallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        senderWallet = new Wallet();
        transaction = Transaction.newTransaction(senderWallet, 'r4nd-4dr355', 30);
        tp.updateOrAddTransaction(transaction);
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

});