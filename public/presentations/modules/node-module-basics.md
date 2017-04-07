## Node Modules and `npm`

---

## Basic Module Usage

```js
var express = require('express');

var app = express();
```

---

### Requiring Modules

Modules can live in different places:

```js
var filesSys = require('fs'),             // core module
    express  = require('express'),        // from /node_modules/
    router   = require('./app/router'),   // file (".js" optional)
    mymod    = require('./my/module/'),   // 'main' file in directory
    config   = require('../config.json'); // import & parse JSON file
```

^ requiring dir will require `main` file as specified in that dir's package.json
or `index.js` by default

---

### Hello World Module

```js
// in my-module.js
console.log( 'Hello World' );
```

```js
// in main.js
require('./my-module');
```
<!-- .element: class="fragment" -->

```no-highlight
$ node main.js
Hello World
```
<!-- .element: class="fragment" -->

---

### Creating a Module API

```js
// in my-module.js
module.exports = function sayHello( recipient ) {
    console.log( 'Hello ' + recipient );
}
```
<!-- .element: class="fragment" -->

```js
// in main.js
var foobar = require('./my-module');

foobar( 'StrongLoop!' );
```
<!-- .element: class="fragment" -->

```no-highlight
$ node main.js
Hello StrongLoop!
```
<!-- .element: class="fragment" -->
