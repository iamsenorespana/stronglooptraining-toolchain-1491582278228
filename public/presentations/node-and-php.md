
![](/images/StrongLoop.png)

## Node.js: the 800-pound Gorilla

![{{speaker}}]()

---

![fit](/images/StrongLoop_who.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/api-connector.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/micro-services.png)

---

## Why Node.js?

* Node is fast.
<!-- .element: class="fragment" -->
  * Non-blocking I/O
<!-- .element: class="fragment" -->
  * JavaScript arms race (V8)
<!-- .element: class="fragment" -->
* One language to rule them all
<!-- .element: class="fragment" -->
* Solid Standard (ECMAScript)
<!-- .element: class="fragment" -->
* Vibrant Ecosystem (npm)
<!-- .element: class="fragment" -->

---

### Caveats

* Have to think in async
<!-- .element: class="fragment" -->
  * Callback Hell
<!-- .element: class="fragment" -->
* Frameworks and tools may not be as mature (yet)
<!-- .element: class="fragment" -->
* JavaScript "quirks"
<!-- .element: class="fragment" -->

---

### Node is Single-Threaded

_(But that's ok...)_

---

<!-- .slide: data-background="white" -->

![fit](/images/threaded.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/event-loop.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/Node_not_just_hipsters.png)

---

# What is Node?

### Node is not JavaScript exactly...
<!-- .element: class="fragment" -->

"JavaScript" is a trademarked term!
<!-- .element: class="fragment" -->

---

## Node is ECMAScript

### So what is ECMAScript?
<!-- .element: class="fragment" -->

---

### ECMAScript is a Language Specification...

...with various implementations:
* Chrome's **V8**
* Mozilla's **SpiderMonkey** (properly "JavaScript")
* Microsoft's **Chakra** (or **JScript** before IE10)
* Adobe's **Tamarin** (ActionScript)
* **Rhino** (an early server-side implenentation - in Java)

---

### The Node Core

Node builds on V8 with C++ and JS code.

* V8: The engine
* LibUv: Event loop and asynchronous I/O
<!-- .element: class="fragment" -->
* A standard library
<!-- .element: class="fragment" -->

---

![fit](/images/Node-Architecture.png)

---

## Node Modules and `npm`

---

## Basic Module Usage

```js
var express = require('express');

var app = express();
```

---

### Requiring Modules

Modules can live different places:

```js
var filesystem = require('fs'),       // core module
    express = require('express'),     // from /node_modules/ (via npm)
    router = require('./app/router'), // app file (".js" is optional)
    config = require('../config/config.json');
```

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

---

### Module Exports

Whatever is on the `module.exports` property becomes  
the return value of `require('foobar')`!

---

### Comparisons to PHP

Is this just like a `require 'file.php'`?

<p class='fragment'>
    Not exactly. Modules in Node have their own scope.
    <br><br>
    **Only what you place on the `exports`** property will "escape" the module!
</p>

---

### Comparisons to PHP

```php
// file-1.php
function foo() {
    // ...
}
```

```php
// file-2.php

require 'file-1.php'

foo(); // this works in php!
```

But in Node, the `foo` function would have to be "exported".

---

### Comparisons to PHP

We also have no distinction between `include` and `require`.

In PHP, `include` generates a warning, but in Node, `require` will always fail if the module is not readable.

---

### Module Patterns

**Simple Object API** vs **Revealing Module**

---

### Simple Object API

```js
module.exports = {
    name: "StrongLoop",
    version: "1.0.0",
    sayHello: function() {
        return "Hello " + this.name;
    }
};
```

```js
var api = require('./my-module');
console.log( api.sayHello() );  // "Hello StrongLoop"
```
<!-- .element: class="fragment" -->

---

### Why not use a simple Object?

**Modules are cached by Node!**

Requiring a module twice could yield unexpected results if not coded properly.
<!-- .element: class="fragment" -->

---

### Module Caching

```js
module.exports = {
    salary: 50000,
    giveRaise: function(amount) {
        this.salary += amount;
    }
};
```
<!-- .element: class="fragment" -->

```js
var workerOne = require('./worker');
workerOne.giveRaise(10000);
console.log( workerOne.salary );  // 60000

var workerTwo = require('./worker');
workerTwo.giveRaise(10000);
console.log( workerTwo.salary );  // 70000!
```
<!-- .element: class="fragment" -->

---

### Revealing Module Pattern

```js
module.exports = function createWorker(options) {
    return {
        salary: options.salary || 50000,
        giveRaise: function(amount) {
            this.salary += amount;
        }
    };
};
```

```js
var getWorker = require('./worker');

var workerOne = getWorker({ salary: 30000 });
workerOne.giveRaise(7000);  // salary === 37000

var workerTwo = getWorker();
workerTwo.giveRaise(5000);  // salary === 55000
```
<!-- .element: class="fragment" -->

---

### How do I use module X?

READ THE DOCS.
<!-- .element: class="fragment" -->

Doesn't have docs? Use a different module.
<!-- .element: class="fragment" -->

---

## NPM

The Node Package Manager.

Think of it like composer for Node  
(since composer is strongly inspired by it).

---

### A package manager for Node.

* Website: [npmjs.com](https://www.npmjs.com)
* Command-line tool: `npm`
* Registries: both public and private

_Note that npm is bundled with Node.js!_
<!-- .element: class="fragment" -->

---

### Project Meta Information

Before using npm in your project,  
create a `package.json` file to track meta info.

<p class="fragment"><strong>Every Node project should have one!</strong></p>

---

### Creating a `package.json`

```no-highlight
/my-project$ npm init

This utility will walk you through creating a package.json
file.  It only covers the most common items, and tries to
guess sane defaults.
...

Press ^C at any time to quit
name: (my-package-name)
```
<!-- .element: class="fragment" -->

---

### A basic `package.json`

```js
{
  "name": "my-project",
  "version": "0.1.0",
  "private": true,
  "description": "This is my project!",
  "main": "main.js",
  "scripts": {
    "test": "grunt test"
  },
  "author": "John Doe <john@doe.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.12.4"
  }
}
```

---

### Installing Packages

**Locally in a Project**  
_(most of your projects' dependencies: express, lodash, mongodb, etc)_

```no-highlight
/my-project$ npm install express
/my-project$ npm install mondodb lodash redis
```

```no-highlight
/my-project/mode_modules
|_ lodash
|_ loopback
|_ mongodb
|_ redis
```
<!-- .element: class="fragment" -->

---

### Project dependencies

You should almost always be **saving** dependencies to your `package.json`:

```no-highlight
/my-project$ npm install express --save
/my-project$ npm install grunt --save-dev
```

```js
{
  ...,
  dependencies: {
    "express": "^4.12.4"
  },
  devDependencies: {
    "grunt": "^0.4.5"
  }
}
```
<!-- .element: class="fragment" -->

---

### Global Packages

Used for various tooling  
(scaffolding, testing, build, deploy, etc)

```no-highlight
$ npm install -g strongloop
$ npm install -g grunt-cli
```

---

### Publishing a Module

Step 1: Create your user account on npmjs.com

Then add your user account locally

```no-highlight
~$ npm adduser
Username: johndoe
Password: 
Email: (this IS public) john@doe.com
```

---

### Publishing a Module

Step 2: Publish!

```no-highlight
~$ npm publish
```

_Don't forget to set `"private": false` in package.json!_

---

# Other Node Specifics

---

## Global Context

In the browser this is `window`.

In Node this is `global`.

<p class="fragment">Do NOT use `global` for inter-module communication!</p>

---

## The Node `process` is...

* an interface to the current Node system process
* accessible from any module
* an `EventEmitter`

---

### The Node `process`

We can access many things on `process`:

* Environment variables (`process.env`)
* CLI args (`process.argv`)
* System Process ID (`process.pid`)
* etc, etc...

Think of it like PHP's `$_SERVER`, `$_ENV`, etc.

---

# Built-in Libraries

---

## HTTP

```js
var http = require( 'http' ),
    url = require( 'url' );

var server = http.createServer( function handleRequests( req, res ) {
    if ( url.parse(req.url).pathname !== '/' ) {
        res.writeHead( 404, 'Not Found' );
        res.end();
        return;
    }
    
    res.writeHead( 200, {
        'Content-Type': 'text/html'
    } );
    res.end( '<h1>Hello World!</h1>' );
} );

server.listen( 3000, '127.0.0.1', function() {
    console.log( 'The server is up!' );
} );
```
<!-- .element: class="fragment" -->

---

## FileSystem

```js
var fs = require( 'fs' );

fs.readFile( 'config.json', function( err, data ) {
    if ( err ) {
        // handle it!
        console.error( err.stack );
        return;
    }
    
    // `data` is a Buffer, so decode it first...
    console.log( data.toString('utf-8') );
});
```

---

## More Core

* Child Processes (`spawn` & `exec`)
* Streams
* Crypto
* Cluster
* Events
* ...

---

# Data Sources

---

![inline](/images/datasources.png)

---

## MySQL

```
~/my-app$ npm install mysql --save
```

---

### MySQL Module Usage

```js
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  database: 'test'
});
connection.connect();

connection.query(
    'SELECT * FROM `books` WHERE ',
    function(err, rows, fields) {
        if (err) { /* ... */ return; }

        rows.forEach(function(row) { /* ... */ });
        
        connection.end();
    }
);
```

---

### ORMs and ODMs

#### [sequelize](http://docs.sequelizejs.com/en/latest/)
<!-- .element: class="fragment" -->

#### [Mongoose (MongoDB)](http://mongoosejs.com/)
<!-- .element: class="fragment" -->

#### [Waterline](https://github.com/balderdashy/waterline)
<!-- .element: class="fragment" -->

---

### Sequelize

```bash
$/my-app$ npm install --save sequelize
```

```js
var Sequalize = require('sequalize');

var db = new Sequelize('mysql://user:pass@foo.com:3306/dbname');
```
<!-- .element: class="fragment" -->

---

### Sequalize Models

Now we create a model, and sync it to the table:

```js
var User = db.define('user', {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    salary: Sequelize.FLOAT // Note that in JS, this is just a number!
});
```

```js
User.sync().then(function() {
    // Now we're ready to use it!
});
```

---

### Sequalize Models

```js
User.findById(13)
    .then(function(user) {
        // `null` indicates no entry for that id!
        console.log( user );
    })
    .catch(function(err) {
        // oops, there was an error accessing the DB!
    });
```

```js
User.find({ where: { firstName: { $like: 'jordan' } } })
    .then(function(records) {
        // ...
    });
```
<!-- .element: class="fragment" -->

---

## So it's just... &nbsp;&nbsp;JavaScript?

<br><br>

# YES!
<!-- .element: class="fragment" -->

---

# Cool.

Iknowright?
<!-- .element: class="fragment" -->

---

# Integration

---

## Integration

Node and PHP both have their good parts...

...why not use them in tandem?

---

## Step One:

**Externalize storage of session data!**

---

<!-- .slide: data-background="white" -->

![](/images/php-and-node.png)

---

## Step Two:

Proxy requests from your web server to Node

---

### Proxying Requests: Apache

```xml
<VirtualHost 123.45.67.89:80>
    ServerName foobar.com
    
    ## ...
    
    <Location /api>
        ProxyPass http://localhost:3000/
        ProxyPassReverse http://localhost:3000/
    </Location>
    
</VirtualHost>
```

<div class="fragment">
    <p>And don't forget to load these modules:</p>
    <pre><code>LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so</code></pre>
</div>

---

### Proxying Requests: nginx

```nginx
server {
    listen 80;
    server_name foobar.com;
    
    ## ...
    
    location ~ /api {
        proxy_pass localhost:3000;
    }
}
```

<p class="fragment"><em>
    By the way, with nginx you'll<br>also probably need to use PHP-FPM
</em></p>

---

## Ok, maybe we can use Node...

So which framework?
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

![fit](/images/rest-roundup.png)

---

## Choosing a Framework

---

## Pattern #1: Convention

Express, Restify, Kraken

* No questions about "how to do it"
* Advanced features fit in easier
* Weaknesses
  * Can be Opinionated
  * Manual CRUD

---

## Pattern #2: Configuration

Hapi, LoopBack, Sails

* Lower learning curve
* Better documentation
* Weaknesses
  * Opinionated
  * Some Manual CRUD
  * Advanced functions can require more effort

---

## Pattern #3: Isomorphic

Meteor, flatiron, LoopBack

* Sharing of Code (Client & Server)
* Automatic endpoint generation & routing
* Weaknesses
  * High learning curve
  * Custom front-end code sometimes still required

---

## Pattern #4: ORM & MBaaS

LoopBack, Sails

* Model Driven Development
  * Multiple data sources
* Possible to have Isomorphic JS
* Automatic REST endpoint generation
  * Includes routing & CRUD
* Weaknesses
  * Non-data-backed APIs require effort
  * Can be opinionated, but not always

---

## I'm already using Node.js...

## But now I need to scale it.
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

![fit](/images/arc-products.png)

---

## Installing StrongLoop

```no-highlight
~$ sudo npm install -g strongloop
```

```no-highlight
~$ cd my-project
~/my-project$ slc start
...
~/my-project$ slc arc
```
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

![](/images/arc-login.png)

---

<!-- .slide: data-background="white" -->

![](/images/arc-metrics.png)

---

<!-- .slide: data-background="white" -->

![](/images/arc-heap-normal.png)

---

<!-- .slide: data-background="white" -->

![](/images/heap-problem.png)

---

<!-- .slide: data-background="white" -->

![](/images/arc-profiler-heap.png)

---

<!-- .slide: data-background="white" -->

![](/images/arc-build-deploy.png)

---

<!-- .slide: data-background="white" -->

![](/images/arc-pm.png)

---

## Want to Get Started?

[strongloop.com/get-started](https://strongloop.com/get-started/)

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]()

![{{contact}}]()

![{{url}}]()
