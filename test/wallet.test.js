const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Blockchain = require("../blockchain/blockchain");
const {INITIAL_BALANCE} = require("../config");

describe('Wallet', function(){
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('creating a transaction', function(){
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd-4ddr355';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('and doing the same transaction', function(){
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', function(){
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the `sendAmount` output for the recipient', function(){
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });

    describe('calculating a balance', function(){
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;

            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates the balance for blockchain transactions matching the recipient', function(){
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });

        it('calculates the balance for blockchain transactions matching the sender', function(){
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

        describe('and the recipient conducts a transaction', function(){
            let subtractBalance, recipientBalance;

            beforeEach(() => {
                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sende sends another to the recipient', function(){
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculate the recipient balance only using transactions since its most recent one', function(){
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });

        });

    });

});