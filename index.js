const event = {
  nodeUrl: 'http://88.99.192.82:7890',
  namespace: 'alice',
  //namespace: 'local',
  //namespace: 'openapostille'
};
const context = {};
const callback = function() {};
require('./src').handler(event, context, callback);

