## Simple Tip #1:

## Know the API docs!

[nodejs.org/api](https://nodejs.org/api)

---

## Simple Tip #2:

## Use Strict Mode!

```js
'use strict';

var http = require('http');

server = http.createServer(function() { ... });
```
<!-- .element: class="fragment" -->

---

## Simple Tip #3:

## Name your inline functions!

```javascript
var fs = require('fs');
fs.readFile('config.json', function (err, data) {
    // What is this function called? What's in your stack trace?
});
```
<!-- .element: class="fragment" -->

```javascript
fs.readFile('config.json', function readConfig(err, data) {
    // Much better!
});
```
<!-- .element: class="fragment" -->

---

## Simple Tip #4:

## Don't forget callbacks are *error-first*

```javascript
var fs = require('fs');

fs.readFile('config.json', function readConfig(data) {
    if (data) {
        // wait... what is the first argument?
    }
});
```
<!-- .element: class="fragment" -->
