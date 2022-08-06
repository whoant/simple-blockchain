const Wallet = require("./wallet");
const Transaction = require("./wallet/transaction");
senderWallet = new Wallet();
amount = 50;
recipient = 'r3c1p13nt';
transaction = Transaction.newTransaction(senderWallet, recipient, amount);
console.log(transaction);