const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const P2pServer = require('./p2p-server');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const Miner = require("./miner");

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(express.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const newBlock = bc.addBlock(req.body.data);
    console.log(`New block addded: ${newBlock.toString()}`)
    p2pServer.syncChains();
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
    res.json({
        publicKey: wallet.publicKey,
        balance: wallet.calculateBalance(bc)
    });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();