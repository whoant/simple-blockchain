const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

describe('Transaction', function(){
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(senderWallet, recipient, amount);
    })

    it('outputs the `amount` subtracted from the wallet balance', function(){
        expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount).toEqual(senderWallet.balance - amount)
    });

    it('outputs the `amount` added to the recipient', function(){
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount)
    });

    it('inputs the balance of the wallet', function(){
        expect(transaction.input.amount).toEqual(senderWallet.balance)
    });

    it('validates a valid transaction', function(){
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', function(){
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transacting with an amount that exceeds the balance', function(){
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(senderWallet, recipient, amount)
        });

        it('doest not create the transaction', function(){
            expect(transaction).toEqual(undefined)
        });

    });

    describe('and update a transaction', function(){
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr355';
            transaction = transaction.update(senderWallet, nextRecipient, nextAmount);
        });

        it(`substracts the next amount from the sender's output`, function(){
            expect(transaction.outputs.find(output => output.address === senderWallet.publicKey).amount).toEqual(senderWallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', function(){
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount)
        });

    });

});
