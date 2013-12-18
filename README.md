# firebase-builder

Easily create/configure a Firebase client

## Installation
```
npm install --save firebase firebase-builder
```

## Usage

```javascript
var builder = require('firebase-builder');

// create a client from a URL
var client = builder('https://example.firebaseio.com');
var client = builder({url: 'https://example.firebaseio.com'});

// create a client from a URL rooted at child foo/bar
var client = builder({url: 'https://example.firebaseio.com/foo/bar'});

// create a client from a URL with an auth token
var client = builder({url: 'https://:auth-token@example.firebaseio.com'});

// create a client from properties
var client = builder({
  name: 'example',      // your firebase name
  root: 'foo/bar',      // (optional) the child to root your Firebase client at
  token: 'token'        // (optional) your Firebase Token from the Auth tab or self-generated
});

// create a client from a mix of URL and properties
var client = builder({
  url: 'https://example.firebaseio.com',
  token: 'token'
});

// Get a callback when auth is completed
var client = builder('https://:auth-token@example.firebaseio.com', function(err, client) {
  if (!err) console.log('Authentication is complete!');
});
```

## License
Copyright (c) 2013 Matt Insler  
Licensed under the MIT license.
