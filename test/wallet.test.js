const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

describe('Wallet', function(){
    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('creating a transaction', function(){
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd-4ddr355';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('and doing the same transaction', function(){
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', function(){
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the `sendAmount` output for the recipient', function(){
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });

        });

    });

});