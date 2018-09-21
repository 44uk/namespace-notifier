const fetch = require('../fetch');
const nock = require('nock');

const NODE_URL = 'http://88.99.192.82:7890';

beforeEach(() => {
  nock(NODE_URL)
    .get('/namespace')
    .query({ namespace: 'namespace.notfound'})
    .reply(404, {
      timeStamp: 109916031,
      error: "Not Found",
      message: "invalid namespace 'namespace.notfound' (org.nem.core.model.namespace.Namespace)",
      status: 404
    })
  ;

  nock(NODE_URL)
    .get('/chain/height')
    .reply(200, {
      height: 1815761
    })
  ;

  nock(NODE_URL)
    .get('/namespace')
    .query({ namespace: 'alice'})
    .reply(200, {
      owner: 'NB6ZRQVQAJLIXAQBNEKBSWTVIXUYPBTIRIFFYOYW',
      fqn: 'alice',
      height: 1531225
    })
  ;

  nock(NODE_URL)
    .post('/block/at/public', {
      height: 1531225
    })
    .reply(200, {
      timeStamp: 92704617,
      signature: 'd8afbf014be537af2384b2e598201da5d83a6890923805f160087fdad93ae4cea94d224d491d2ca586ca7a32ab469bfa9000712069183ca09748c7427645c006',
      prevBlockHash: {
        data: '1920f572d35b639937ae4ab1470d08dc7109ebb08e7ed194f2264db4910dbe47'
      },
      type: 1,
      transactions: [
        { timeStamp: 92704501,
          parent: null,
          signature: '834a737903038f4aec78f5b648de09f08004e3f7023344fbb183f23141109777731f123eb132593fc3190803ac83a284e513b34ea0928d560f0dec7ee77a020c',
          fee: 150000,
          rentalFeeSink: 'NAMESPACEWH4MKFMBCVFERDPOOP4FK7MTBXDPZZA',
          rentalFee: 100000000,
          newPart: 'alice',
          type: 8193,
          deadline: 92790901,
          version: 1744830465,
          signer: '5ab2c880300960dc87d0aa86c6a4d01082994fd09066cf0bc6b5e7aa852274b8' }
      ],
      version: 1744830465,
      signer: '1fcc13c57ac9954e608814af9e88b121299996892fe0dd2dfbe1312d0c2eaf6e',
      height: 1531225
    })
  ;

  nock(NODE_URL)
    .get('/namespace')
    .query({ namespace: 'namespace.rerentable'})
    .reply(200, {
      owner: 'NB6ZRQVQAJLIXAQBNEKBSWTVIXUYPBTIRIFFYOYW',
      fqn: 'namespace.rerentable',
      height: 1290161
    })
  ;

  nock(NODE_URL)
    .post('/block/at/public', {
      height: 1290161
    })
    .reply(200, {
      timeStamp: 92704617,
      signature: 'd8afbf014be537af2384b2e598201da5d83a6890923805f160087fdad93ae4cea94d224d491d2ca586ca7a32ab469bfa9000712069183ca09748c7427645c006',
      prevBlockHash: {
        data: '1920f572d35b639937ae4ab1470d08dc7109ebb08e7ed194f2264db4910dbe47'
      },
      type: 1,
      transactions: [
        { timeStamp: 92704501,
          parent: null,
          signature: '834a737903038f4aec78f5b648de09f08004e3f7023344fbb183f23141109777731f123eb132593fc3190803ac83a284e513b34ea0928d560f0dec7ee77a020c',
          fee: 150000,
          rentalFeeSink: 'NAMESPACEWH4MKFMBCVFERDPOOP4FK7MTBXDPZZA',
          rentalFee: 100000000,
          newPart: 'namespace.rerentable',
          type: 8193,
          deadline: 92790901,
          version: 1744830465,
          signer: '5ab2c880300960dc87d0aa86c6a4d01082994fd09066cf0bc6b5e7aa852274b8' }
      ],
      version: 1744830465,
      signer: '1fcc13c57ac9954e608814af9e88b121299996892fe0dd2dfbe1312d0c2eaf6e',
      height: 1290161
    })
  ;
});
afterEach(() => nock.cleanAll() );

test('when namespace is not found', (done) => {
  const namespace = 'namespace.notfound';
  fetch(NODE_URL, namespace)
    .catch(err => {
      expect(err).toBeInstanceOf(Object);
      expect(err.message).toBe(`invalid namespace '${namespace}' (org.nem.core.model.namespace.Namespace)`);
      done();
    })
  ;
});

test('namespace has many blocks', (done) => {
  const namespace = 'alice';
  fetch(NODE_URL, namespace)
    .then(data => {
      expect(data).toBeInstanceOf(Object);
      expect(data.isRerentable).toBe(false);
      expect(data.createdAt).toBeInstanceOf(Date);
      expect(data.expirationAt).toBeInstanceOf(Date);
      expect(data.rerentableUntil).toBeInstanceOf(Date);
      expect(data.leftBlocks).toBeGreaterThanOrEqual(0);
      expect(data.leftBlocks).toBeLessThanOrEqual(525600);
      expect(data.currentHeight).toBeGreaterThanOrEqual(0);
      expect(data.owner).toMatch(/[0-9A-Z]{40}/);
      expect(data.fqn).toMatch(/[a-z0-9‘_\-.]{1,64}/);
      expect(data.height).toBeGreaterThanOrEqual(0);
      done();
    })
  ;
});

test('namespace is rerentable', (done) => {
  const namespace = 'namespace.rerentable';
  fetch(NODE_URL, namespace)
    .then(data => {
      expect(data).toBeInstanceOf(Object);
      expect(data.isRerentable).toBe(true)
      expect(data.createdAt).toBeInstanceOf(Date);
      expect(data.expirationAt).toBeInstanceOf(Date);
      expect(data.rerentableUntil).toBeInstanceOf(Date);
      expect(data.leftBlocks).toBeGreaterThanOrEqual(0);
      expect(data.leftBlocks).toBeLessThanOrEqual(43200);
      expect(data.currentHeight).toBeGreaterThanOrEqual(0);
      expect(data.owner).toMatch(/[0-9A-Z]{40}/);
      expect(data.fqn).toMatch(/[a-z0-9‘_\-.]{1,64}/);
      expect(data.height).toBeGreaterThanOrEqual(0);
      done();
    })
  ;
});

