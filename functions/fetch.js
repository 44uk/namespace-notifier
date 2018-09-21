const phin = require('phin').promisified;
const headers = { 'content-type': 'application/json' };

const NAMESPACE_RENTAL_BLOCKS = 525600;
const NAMESPACE_RERENTABLE_BLOCKS = 43200;

module.exports = (nodeUrl, namespace) => {
  const NODE_URL = nodeUrl;
  const NAMESPACE = namespace;
  return phin({
    url: `${NODE_URL}/namespace?namespace=${NAMESPACE}`,
    parse: 'json'
  })
    .then(response => {
      if(response.statusCode !== 200) { throw new Error(response.body.message); }
      const ns = response.body;
      return Promise.all([
        Promise.resolve(ns),
        phin({url: `${NODE_URL}/chain/height`, parse: 'json'}),
        phin({url: `${NODE_URL}/block/at/public`, method: 'POST', parse: 'json', data: { height: ns.height }, headers})
      ]);
    })
    .then(responses => {
      const namespace = responses[0];
      const currentHeight = responses[1].body.height;
      const block = responses[2].body;
      const leftBlocks = block.height + NAMESPACE_RENTAL_BLOCKS - currentHeight;
      const isExpired = leftBlocks <= 0;
      const isRerentable = leftBlocks < NAMESPACE_RERENTABLE_BLOCKS;
      const createdAt = new Date(Date.UTC(2015, 2, 29, 0, 6, 25, 0) + (block.timeStamp * 1000));
      const expirationAt = new Date(createdAt.getTime() + NAMESPACE_RENTAL_BLOCKS * 60 * 1000);
      const rerentableUntil = new Date(expirationAt.getTime() + NAMESPACE_RERENTABLE_BLOCKS * 60 * 1000);
      return Object.assign({
        isExpired,
        isRerentable,
        createdAt,
        expirationAt,
        rerentableUntil,
        leftBlocks,
        currentHeight
      }, namespace);
    })
  ;
}
