
![](/images/StrongLoop.png)

## JavaScript & Node.js Fundamentals

---

![fit](/images/StrongLoop_Hyperscale.png)

---

## Agenda

1. Why Server-Side JavaScript?
<!-- .element: class="fragment" -->
1. What is Node.js?
<!-- .element: class="fragment" -->
1. JavaScript fundamentals
<!-- .element: class="fragment" -->
1. Node Specifics
<!-- .element: class="fragment" -->
1. Modules and npm
<!-- .element: class="fragment" -->
1. Build a simple web app
<!-- .element: class="fragment" -->

---

# Why Server-Side JavaScript?

---

## Why Server-Side JavaScript?

* Node is fast.
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
* Frameworks and tools may not be as mature (yet)
<!-- .element: class="fragment" -->
* Callback Hell
<!-- .element: class="fragment" -->
* JavaScript "quirks"
<!-- .element: class="fragment" -->

---

![fit](/images/Node_not_just_hipsters.png)

---

### Node is Single-Threaded

_(But that's ok...)_

---

![fit](/images/threaded.png)

---

![fit](/images/event-loop.png)

---

### TL;DR:

Don't use Node.js for CPU-intensive tasks.

^Node.js certainly has some disadvantages, but it is currently one of the best tools out there in order to create asynchronous, non-blocking apps.

---

# What is Node?

---

### The Node Core

* V8: The engine
* LibUv: Event loop and asynchronous I/O
<!-- .element: class="fragment" -->
* A standard library
<!-- .element: class="fragment" -->

^It's written originally for *nix systems. Libev provides a simple yet optimized event loop for the process to run on. You can read more about libev here.  
It handles file descriptors, data handlers, sockets etc. You can read more about it here here.  
LibUv performs, mantains and manages all the io and events in the event pool. ( in case of libeio threadpool ). You should check out Ryan Dahl's tutorial on libUv. That will start making more sense to you about how libUv works itself and then you will understand how node.js works on the top of libuv and v8.

---

![fit](/images/Node-Architecture.png)

---

## A Few JavaScript Fundamentals

---

## Variables

* **Primitives**
  * (string, number, boolean, symbol (ES6))
  * null, undefined
* **Objects**
  * (Date, Array, Function, Dog, Employee, etc)

---

## Variables

Primitive **values** are immutable!

**Variables** are dynamic.

```js
var name = "StrongLoop";  // the string VALUE can never change...

var name = 42;  // ...but what `name` points to can!
```
<!-- .element: class="fragment" -->

---

### Null vs Undefined

`null` is a variable with a null value (nothing there)

`undefined` is the absence of a value at all

---

### Undefined

```js
var strongloop;

console.log( typeof strongloop ); // "undefined"
console.log( typeof foobar );     // "undefined"
console.log( strongloop );        // "undefined"
console.log( foobar );            // ReferenceError: foobar is not defined
```

^An "undefined" variable is one that has been declared in the accessible scope, but at the moment has no other value in it.

---

## Objects

Object literal notation

```js
var obj = {
    answer: 42,
    question: null,
    computer: 'Earth'
}

obj.answer     // 42
obj['answer']  // 42

obj.foo = "bar"
```

---

## Objects

Object instances

```js
var obj = new Object({
    answer: 42
});

obj.answer     // 42
obj.foo = "bar"
```

---

## Functions

Functions **are** objects!

---

## Creating Functions

```js
function foo() {
    // do stuff!
    
    return "foo";
};
```

---

## Creating Functions

```js
var foo = function bar() {
    // do stuff!
    
    return "foo";
};
```

---

## Creating Functions

```js
var foo = function bar() {
    // do stuff!
    
    return "foo";
};

foo.name === "bar"
```

---

### Calling a Function

```js
function sayHello( recipient ) {
    return 'Hello ' + recipient;
};

console.log( sayHello( "World" ) );  // "Hello World"
```

---

### Calling a Function

```js
function sayHello( recipient ) {
    return 'Hello ' + recipient;
};

sayHello.call( this, "World" );  // "Hello World"
```

^Discuss function context and "this"

---

### Function Context

```js
function sayHello( recipient ) {
    
    // what is "this" in here???
    
    return this.greeting + ' ' + recipient;
};

sayHello( "World" );  // "undefined World"
```

---

### Function Context

```js
var a = [ 1, 2, 3 ];

a.pop(); // 3
```

Inside `pop()` the context will be `a`

---

### Switching Function Context

```js
function sayHello( recipient ) {
    return this.greeting + ' ' + recipient;
};

sayHello( "World" );  // "undefined World"

sayHello.call( { greeting: "Gutentag" }, "World" );  // "Gutentag World"
```

---

### Switching Function Context

```js
function sayHello( recipient ) {
    return this.greeting + ' ' + recipient;
};

sayHello.apply( myContext, ["World"] );
```

---

### Functions as Values

Functions are first-class citizens

---

### Functions as Values

```js
function readFile(fileName, callback) { /* ... */ }

readFile('foobar.json', function(data) {
    // ...
});
```

---

### Functions as Values

```js
function readFile(fileName, callback) { /* ... */ }

function processData(data) {
    // ...
}

readFile('foobar.json', processData);
```

---

## Variable Hoisting

```js
function foobar() {
    
    console.log( x );   // 42? ReferenceError?
    
    var x = 42;
}
```

---

## Variable Hoisting

```js
function foobar() {
    var x;
    console.log( x );   // undefined!
    
    x = 42;
}
```

^ discuss let and const for ES6!

---

## Variable Hoisting - Functions

```js
function foobar() {
    
    console.log( getAnswer() );   // ???
    
    function getAnswer() {
        return 42;
    }
}
```

---

## Variable Scope

---

### Functions Create Scope

```js
var y = 2,
    z = 5;

function foobar( x ) {
    var z = 3;
    
    console.log( x, y, z );   // 1, 2, 3
}

foobar( 1 );

console.log( x );   // ReferenceError
console.log( y );   // 2
console.log( z );   // 5
```

^ Discuss how functions have their own scope, plus any parent scope!
Discuss ES6 block scoping with let and const

---

### Closures

This scope (and scope chain) is the underlying nature of closures in JavaScript.

---

### Closures

Code in a function (closure) has access to...

* **its own scope**  
_(variables defined between its curly brackets)_
* **any outer function's scope**  
_(at time of definition, if any exist)_
* **the global scope**  
_(`window` in the browser, `global` in Node)_

---

### Closures

```js
var baz;
function foo() {
    var x = 1;
    function bar() {
        var y = 2;
        function bat() {
            var z = 3;
            baz = function() {
                console.log( x, y, z );
            }
        }
        bat();
    }
    bar();
}
foo();
baz();  // 1, 2, 3
```

---

### Function Arguments in Node

By convention, a callback is always the last argument...

```js
fs.readFile('foo/bar.json', function readCallback(...) {
    // ...
});
```

---

### Arguments in Node

...And callbacks should always have a potential `Error` object as the first argument

```js
fs.readFile('foo/bar.json', function readCallback(err, results) {
    
    // Was there an error?
    if (err) {
        // handle it
        return;
    }
    
    // handle results
});
```

---

## Node Specifics

---

### Global Context

In the browser this is `window`.

In Node this is `global`.

<p class="fragment">Do NOT use `global` for inter-module communication!</p>

---

## The Node `process` is...

* the interface to the current Node process
* accessible from any module
* an `EventEmitter`

---

### Environment Variables

Environment variables can be accessed via the `env` object:

```js
console.log( process.env );

{ SHELL: '/bin/bash',
  USER: 'jordan',
  HOME: '/home/jordan',
  PORT: 3000,
  NODE_ENV: 'development',
  ...
}
```

---

### Commandline Arguments

The command line accepts arguments:

```no-highlight
$ echo "Hello World!"  // "Hello World" is the argument here
```

Node makes these arguments accessible via `process.argv`

---

### Commandline Arguments

The `argv` property is array-like, but be careful, the first two elements are 'node' and the script filename!

```no-highlight
$ node app.js arg1 arg2 arg3=val3
```

```js
process.argv == [
    'node', 'app.js', 'arg1', 'arg2', 'arg3=val3'
]
```

---

### Killing the Process

To exit the Node process, use the `exit()` function:

```js
process.exit( 0 );

process.exit( 127 );
```

---

### Process events

```js
process.on('uncaughtException', function(err) {
    
    // log the error, but let the process live
    console.log('Caught exception: ' + err);
    
});

process.on('SIGINT', function gracefulShutdown() {
    // ...
});
```

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

### Module Patterns

There are various patterns...

* Simple Object API
<!-- .element: class="fragment" -->
* Revealing Module (Function Initialization)
<!-- .element: class="fragment" -->
* Object Constructor
<!-- .element: class="fragment" -->

(And any combination of these!)
<!-- .element: class="fragment" -->

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

Modules are cached by Node, thus requiring a module twice could yield unexpected results.
<!-- .element: class="fragment" -->

---

### Modules are Cached!

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
    var privateVariable = 'secret!';
    
    return {
        salary: 50000,
        giveRaise: function(amount) {
            this.salary += amount;
        }
    };
};
```

```js
var getWorker = require('./worker');

var workerOne = getWorker({});
workerOne.giveRaise(10000);  // salary === 51000

var workerTwo = getWorker({ limit: 5000 });
workerTwo.giveRaise(10000);  // salary === 55000
```
<!-- .element: class="fragment" -->

---

### Object Constructor Pattern

```js
var Worker = module.exports = function Worker() {};

Worker.prototype.salary = 50000;
Worker.prototype.giveRaise = function(amount) {
    this.salary += amount;
};
```

```js
var Worker = require('./worker');

var workerOne = new Worker();
workerOne.giveRaise(1000);   // salary === 51000

var workerTwo = new Worker();
workerTwo.giveRaise(8000);   // salary === 58000
```
<!-- .element: class="fragment" -->

---

## Introduction to NPM

![](/images/npm.png)

^Discuss what NPM is, the capabilities it adds. Lecture on how it can also be used for much more than merely the repository of where libraries are but also a deployment tool, how the package.json file comes into place and more.

---

### A package manager for Node.

* Website: [npmjs.com](https://www.npmjs.com)
* Command-line tool: `npm`
* Registries: both public and private

_Note that npm is bundled with Node.js!_
<!-- .element: class="fragment" -->

---

### Project Meta Information

`package.json` tracks project info

You should **always** create one!

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

### The basic `package.json`

```js
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "This is my project!",
  "main": "main.js",
  "scripts": {
    "test": "grunt test"
  },
  "author": "John Doe <john@doe.com>",
  "license": "MIT"
}
```

^Discuss various "missing" or incorrect items from the basic generated file:
"private"
don't use version 1.0.0

---

## Setting Up npm

Let's also set some basic config values...

```no-highlight
$ npm set init.author.name "Your Name"
$ npm set init.author.email "you@example.com"
$ npm set init.author.url "http://yourblog.com"
```
<!-- .element: class="fragment" -->

Sign up on the npm website and then verify yourself:
<!-- .element: class="fragment" -->

```no-highlight
$ npm adduser
```
<!-- .element: class="fragment" -->

---

### Installing Packages

**Locally in a Project**  
_(most of your projects' dependencies: express, lodash, mongodb, etc)_

```no-highlight
/my-project$ npm install loopback
/my-project$ npm install mondodb lodash
```

```no-highlight
/my-project/mode_modules
|_ lodash
|_ loopback
|_ mongodb
```
<!-- .element: class="fragment" -->

^Discuss node_modules/ directory and nested dependencies

---

### Project dependencies

You should almost always be saving dependencies to your `package.json`:

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

^Discuss semver

---

### Global Packages

Mostly for tools (scaffolding, testing, build, deploy, etc)

```no-highlight
$ npm install -g strongloop
$ npm install -g grunt-cli
```

---

### Publishing Your Own Module

```no-highlight
/my-project$ npm publish
```

Seriously, it's that easy!

(But remember to set `"private": false`)

---

## Building a Basic Web Application


---

### The Server, the Request, and the Response

```js
var http = require('http');

var server = http.createServer(function handleRequests(req, res) {
    res.writeHead( 200, {
        'Content-Type': 'text/html',
        'Location': 'The Interwebs'
    });
    res.end( '&lt;h1>Hello World!&lt;/h1>' );
});

server.listen(8080, '127.0.0.1', function() {
    console.log('The server is up!');
});
```

---

### Hello Server

Run our server using the CLI:

```no-highlight
/my-project$ node server.js
```

And now visit <http://localhost:8080>

---

## Non-Blocking I/O

---

### Synchronous

Synchronous code executes in sequence

```js
function createObjects() {
    var o;
    for (var i=0; i<10000; ++i) { o = new Object(); }
    console.log('done creating objects');
}

createObjects();
console.log('this is the end');
```

```no-highlight
$ node main.js
done creating objects
this is the end
```
<!-- .element: class="fragment" -->

---

## Asynchronous

```js
function addRecords(cb) {
    db.insert([ ... ], function() {
        cb();
    });
}

addRecords(function() {
    console.log('done creating records');
});
console.log('this is the end');
```

```no-highlight
$ node main.js
this is the end
done creating records
```
<!-- .element: class="fragment" -->

---

![fit](/images/event-loop.png)

---

## Node-style Callbacks

Callbacks should be last in the arguments and use error-first convention:

```js
var fs = require('fs');

fs.readFile('foo/bar.json', function readCallback(err, results) {
    
    if (err) {
        // handle it
        return;
    }
    
    // handle results
});
```

---

### Server, Redux

```js
var http = require('http');

var server = http.createServer(function handleRequests(req, res) {
    res.writeHead( 200, {
        'Content-Type': 'text/html',
        'Location': 'The Interwebs'
    });
    res.end( '&lt;h1>Hello World!&lt;/h1>' );
});

server.listen(8080, '127.0.0.1', function() {
    console.log('The server is up!');
});
```

---

### A Simple Router

```js
var routes = {
    '/': '&lt;h1>Welcome to StrongLoop!&lt;/h1>',
    '/about-us': '&lt;h1>StrongLoop is the bees knees.&lt;/h1>',
    '/events': '&lt;h1>Come find us at these great events!&lt;/h1>'
};

module.exports = function routeRequests(req, cb) {
    
    // Check the req.url property for a match
    // then return the correct content, or an error!
    
};
```

---

### Routing Requests

```js
var urlParser = require('url');
var routes = { '/path': 'content', ... };

module.exports = function routeRequests(req, cb) {
    var url = urlParser.parse(req.url, true);
    
    if (routes[ url.pathname ]) {
        
        cb( null, routes[ url.pathname ] );
        
    } else {
        var err = new Error('Not Found');
        err.code = 404;
        cb(err);
    }
};
```

---

### Using Our New Router

```js
var server = http.createServer(function handleRequests(req, res) {
    router(req, function completeRequest(err, content) {
        var code = 200,
            body = '';
        
        if (err) {
            code = err.code || 500;
            body = err.message;
        } else {
            body = content;
        }
        
        res.writeHead( code, { 'Content-Type': 'text/html' } );
        res.end( body );
    });
});
// ...
```

---

## Maintaining Asynchronicity 

---

### Making Things Asyncronous

```js
// in router.js

module.exports = function routeRequests(req, cb) {
    var url = urlParser.parse(req.url, true);
    
    if (routes[ url.pathname ]) {
        
        // What if this was more than just return a string??
        // DB calls, File IO, REST APIs, etc...
        
        cb( null, routes[ url.pathname ] );
        
    } else {
        // ...
    }
};
```

---

### Making Things Asyncronous

```js
// in router.js

module.exports = function routeRequests(req, cb) {
    var url = urlParser.parse(req.url, true);
    
    if (routes[ url.pathname ]) {
        
        // *** Let's make it async! ***
        process.nextTick(function() {
            
            cb( null, routes[ url.pathname ] );
            
        });
        
    } else {
        // ...
    }
};
```

---

# Questions?

### JavaScript & Node.js Fundamentals

![](/images/StrongLoop.png)

Join us for more events!  
[strongloop.com/developers/events](https://strongloop.com/developers/events/)