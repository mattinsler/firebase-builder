URL = require 'url'
path = require 'path'

try
  Firebase = require path.join(process.cwd(), 'node_modules', 'firebase')
catch err
  console.log '\nYou must npm install firebase in order to use firebase-builder\n'
  throw err

error = (err, callback) ->
  throw err unless callback?
  callback(err)

success = (client, callback) ->
  callback(null, client) if callback?
  client

build = (config, callback) ->
  if typeof config is 'function'
    callback = config
    config = {}
  
  config = {url: config} if typeof config is 'string'
  
  if config.url?
    parsed = URL.parse(config.url)
  else if config.name?
    parsed = URL.parse("https://#{config.name}.firebaseio.com")
  else
    error(new Error('firebase-builder requires either a url or name property'), callback)
  
  auth = parsed.auth
  if auth?
    a = auth.split(':')
    token = a[1] if a.length is 2
  delete parsed.auth
  
  parsed.pathname = config.root if config.root?
  token = config.token if config.token?
  
  client = new Firebase(URL.format(parsed))
  
  return success(client, callback) unless token?
  
  client.auth token, (err, auth_data) ->
    return error(err, callback) if err?
    success(client, callback)
  
  client

module.exports = build
