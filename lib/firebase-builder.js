var URL = require('url');
var path = require('path');

var error = function(err, callback) {
  if (!callback) { throw err; }
  callback(err);
};

var success = function(client, callback) {
  callback && callback(null, client);
}

module.exports = function(Firebase) {
  return function(config, callback) {
    if (typeof(config) === 'function') {
      callback = config;
      config = {};
    }
    
    if (typeof(config) === 'string') { config = {url: config}; }
    
    var parsed;
    if (config.url) {
      parsed = URL.parse(config.url);
    } else if (config.name) {
      parsed = URL.parse('https://' + config.name + '.firebaseio.com');
    } else {
      error(new Error('firebase-builder requires either a url or name property'), callback);
    }
    
    var auth = parsed.auth;
    delete parsed.auth;
    
    var token;
    if (auth) {
      var match = /^[^:]*:(.+)$/.exec(auth);
      if (match) { token = match[1]; }
    }
    
    if (config.root) { parsed.pathname = config.root; }
    if (config.token) { token = config.token; }
    
    var client = new Firebase(URL.format(parsed));
  
    if (token) {
      var onComplete = function(err, authData) {
        if (err) { return error(err, callback); }
        success(client, callback);
      };
      
      if (typeof(client.authWithCustomToken) === 'function') {
        client.authWithCustomToken(token, onComplete);
      } else {
        client.auth(token, onComplete);
      }
    } else {
      success(client, callback);
    }
    
    return client;
  };
};
