const Block = require('../blockchain/block');

describe('Block', () => {

    let data, lastBlock, block;
    beforeEach(() => {
        data = 'Tuan';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    })

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data)
    });

    it('set the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash)
    });
});
