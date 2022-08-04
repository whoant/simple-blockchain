const Blockchain = require('../blockchain/blockchain');
const Block = require('../blockchain/block');

describe('Blockchain', () => {
    let bc;
    let bc2;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it('validates a valid chain', function () {
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true)
    });

    it('invalidates a chain with a corrupt genesis block', function () {
        bc2.chain[0].data = 'Tuan';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain', function () {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the chain with a valid chain', function () {
        bc2.addBlock('Tuan');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replaces the chain with one of less than or equal to length ', function () {
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain)
    });

});