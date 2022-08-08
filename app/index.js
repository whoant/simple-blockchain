const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const P2pServer = require('./p2p-server');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();
const p2pServer = new P2pServer(bc, tp);

app.use(express.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const newBlock = bc.addBlock(req.body.data);
    console.log(`New block addded: ${newBlock.toString()}`)
    p2pServer.syncChain();
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/public-key', (req, res) => {
    res.json({
        publicKey: wallet.publicKey
    });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();