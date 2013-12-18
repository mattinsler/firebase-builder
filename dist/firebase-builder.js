(function() {
  var Firebase, URL, build, err, error, path, success;

  URL = require('url');

  path = require('path');

  try {
    Firebase = require(path.join(process.cwd(), 'node_modules', 'firebase'));
  } catch (_error) {
    err = _error;
    console.log('\nYou must npm install firebase in order to use firebase-builder\n');
    throw err;
  }

  error = function(err, callback) {
    if (callback == null) {
      throw err;
    }
    return callback(err);
  };

  success = function(client, callback) {
    if (callback != null) {
      callback(null, client);
    }
    return client;
  };

  build = function(config, callback) {
    var a, auth, client, parsed, token;
    if (typeof config === 'function') {
      callback = config;
      config = {};
    }
    if (typeof config === 'string') {
      config = {
        url: config
      };
    }
    if (config.url != null) {
      parsed = URL.parse(config.url);
    } else if (config.name != null) {
      parsed = URL.parse("https://" + config.name + ".firebaseio.com");
    } else {
      error(new Error('firebase-builder requires either a url or name property'), callback);
    }
    auth = parsed.auth;
    if (auth != null) {
      a = auth.split(':');
      if (a.length === 2) {
        token = a[1];
      }
    }
    delete parsed.auth;
    if (config.root != null) {
      parsed.pathname = config.root;
    }
    if (config.token != null) {
      token = config.token;
    }
    client = new Firebase(URL.format(parsed));
    if (token == null) {
      return success(client, callback);
    }
    client.auth(token, function(err, auth_data) {
      if (err != null) {
        return error(err, callback);
      }
      return success(client, callback);
    });
    return client;
  };

  module.exports = build;

}).call(this);
