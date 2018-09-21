const fetch = require('./fetch');
exports.handler = (event, context, callback) => {
  fetch(event.nodeUrl, event.namespace)
    .then(data => {
      console.log(data);
      if(typeof callback === 'function') { callback(data) }
    })
    .catch(err => {
      console.error(err);
    })
  ;
}

