
<!-- .slide: class="no-footer" -->

![](/images/StrongLoop.png)

# Introduction to Node.js

![{{speaker}}]()

---

# Follow Along!

![{{url}}]()

---

<!-- .slide: data-background="white" -->

![fit](/images/StrongLoop_who.png)

---

## Agenda

1. Why Node? And what is it?
<!-- .element: class="fragment" -->
1. Node's module system
<!-- .element: class="fragment" -->
1. Core Libraries
<!-- .element: class="fragment" -->
1. Managing Async Code
<!-- .element: class="fragment" -->
1. Building applications with Express.js
<!-- .element: class="fragment" -->
1. Logging and Debugging
<!-- .element: class="fragment" -->
1. Build, Deploy, and Scale
<!-- .element: class="fragment" -->
1. Monitoring and Profiling
<!-- .element: class="fragment" -->

---

## Prerequisites

Install [Node](https://nodejs.org/download/) and start coding!

<div class="fragment">
    <p>For DevOps portions, install StrongLoop tools:</p>
    
    <pre><code>~$ npm install -g strongloop</code></pre>
    
    <em style="font-size:0.8em;">(Note that you'll need Python ~2.7 for some of these tools.)</em>
</div>

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

<!-- .slide: data-background="white" -->

![fit](/images/Node_not_just_hipsters.png)

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

## Node Modules and `npm`

---

### Basic Module Usage

```js
var express = require('express');

var app = express();
```

---

### Requiring Modules

Modules can live different places:

```js
var filesSys = require('fs'),             // core module
    express  = require('express'),        // from /node_modules/
    router   = require('./app/router'),   // file (".js" optional)
    config   = require('../config.json'); // JSON or .js files
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
        salary: options.salary || 50000,
        giveRaise: function(amount) {
            this.salary += amount;
        }
    };
};
```

```js
var getWorker = require('./worker');

var workerOne = getWorker({ salary: 40000 });
workerOne.giveRaise(10000);  // salary === 41000

var workerTwo = getWorker({ salary: 60000 });
workerTwo.giveRaise(5000);  // salary === 65000
```
<!-- .element: class="fragment" -->

---

### Object Constructor Pattern

```js
var Worker = module.exports = function Worker() {
    // worker initialization
};

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

### Project Meta Information with `package.json`

---

### `package.json` tracks project info

You should **always** create one!

```no-highlight
~/my-project$ npm init

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
"private": true
don't use version: 1.0.0!

---

### Installing Packages

**Locally in a Project**  
_(most of your projects' dependencies: express, lodash, mongodb, etc)_

```no-highlight
~/my-project$ npm install loopback
~/my-project$ npm install mondodb lodash
```

```no-highlight
~/my-project/mode_modules
|_ lodash
|_ loopback
|_ mongodb
```
<!-- .element: class="fragment" -->

^Discuss node_modules/ directory and nested dependencies

---

### Project dependencies

You should save dependencies to your `package.json`:

```no-highlight
~/my-project$ npm install express --save
~/my-project$ npm install grunt --save-dev
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
~$ npm install -g strongloop
~$ npm install -g grunt-cli
```

---

### Publishing Your Own Module

```no-highlight
~/my-module$ npm publish
```

Seriously, it's that easy!

(But remember to set `"private": false`)

---

### Private Registries

* Hosted by npmjs, or
* Hosted by you

^Discuss the differences between npmjs.org and enterprise private repositories. Elaborate on how internal can be used and mixed with the public repository.

---

### Private Registries

* Code is not exposed to outside world
* No external dependencies (if self-hosted)

---

## Node Core

---

### The global context

In the browser this is `window`.

In Node this is `global`.

---

`global.require()` is the same as `require()`

`global.process === process`

`global.console === console`

^Discuss why you don't really want to use the `global` object for things

---

## The Node `process` is...

* the interface to the current Node process
* accessible from anywhere (via `global`)
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
process.exit( 0 );   // success!

process.exit( 189 ); // failure
```

---

### Process events

```js
process.on('uncaughtException', function(err) {
    
    // log the error, but let the process live
    console.log('Caught exception: ' + err);
    
    process.exit( 189 );
});

process.on('SIGINT', function gracefulShutdown() {
    // ...
});
process.on('SIGTERM', function gracefulShutdown() {
    // ...
});
```

---

## The Node `console`

Very similar to the browser `console` object...

...but not quite as full featured.
<!-- .element: class="fragment" -->

---

## The Node `console`

```js
// print to stdin
console.log('message', data);
console.log('message from user id: %d', id);

// print to stderr
console.error('this is an error');
console.error(err.stack);
```

^ Mention that stdin & out are streams, but we'll cover those later

---

## The Node `console`

```js
// start a timer...
console.time('some label');

// do some stuff

console.timeEnd('some label');
```

```
~$ node script.js
 some label: 262ms
```
<!-- .element: class="fragment" -->

---

## The Node `console`

```js
console.trace('print the stack to this point...');
```

---

## The `http` Module

---

### Server, Request, and Response

```js
// server.js
var http = require('http');

var server = http.createServer(function handleRequests(req, res) {
    res.writeHead( 200, {
        'Content-Type': 'text/plain',
        'Location': 'The Interwebs'
    });
    res.end( 'Hello World!' );
});

server.listen(3000, '127.0.0.1', function() {
    console.log('The server is up!');
});
```

^ Be sure to discuss `https` as well (same API, different module)

---

## Hello Server

Run our server using the CLI:

```no-highlight
/my-project$ node server.js
```

And now visit <http://localhost:3000>

---

## Child Processes

A child process is a process created by another process.

To have Node applications run other processes, use the `child_process` module.

---

## Execute a Process

The `exec` function runs a shell command, and invokes a callback
with references to the child process' standard output and error

```js
var cp = require('child_process');
var ps = cp.exec('ps aux', function (err, stdout, stderr) {
    console.log('STDOUT: ', stdout); // data written to stdout
    console.log('STDERR: ', stderr); // data written to stderr
});
```

Note: `stderr` does not always show only errors, as there are programs that use it to output additional data.

---

The `exec` callback also provides an error object as its first argument,
which can be analyzed in the event process execution fails.

```js
var ps = cp.exec('nonexistant-command', function (err, stdout, stderr) {
    if (err) {
        // stack trace
        console.log(err.stack);

        // exit code
        console.log(err.code);
    }
});
```

---

## Spawn a Process

To acess a child process' streams, use the `spawn` function

```js
var spawn = require('child_process').spawn;
var echo  = spawn('echo', ['Manage child processes in Node']);
var tee   = spawn('tee', ['spawn.txt']);

echo.stdout.on('data', function (data) {
  tee.stdin.write(data);
});

echo.stderr.on('data', function (data) {
  console.log('echo stderr: ' + data);
});

echo.on('close', function (code) {
  tee.stdin.end();
});
```

---

Note:

* `spawn` returns an instance of the `ChildProcess` class
* `ChildProcess` inherits from `EventEmitter` and is a private class
* to write to a spawned process, use its stdin's `write` function
* close the input stream to allow the spawned process to continue its
execution

---

## Streams

---

### Standard Streams

Standard streams are I/O channels between an application and its execution environment.

There are three standard streams:

* standard input - `stdin`
* standard output - `stdout`
* standard error - `stderr`

^Note that the execution environment is typically a shell terminal

---

### Input

To listen in on data from stdin, use the `data` and `end` events:

```js
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    
    // May fire multiple times!
    
    console.log('chunk: ', chunk);
});

process.stdin.on('end', function () {
    
    // Will only fire once!
    
    console.log('--- END ---');
});
```

---

### Output

`stdout`

The standard output streams contain data going out of an application.

Data written to standard output is visible on the command line.

```js
process.stdout.write('A simple message\n');
```

---

### Errors

`stderr`

The standard error stream is an output stream like `stdout`.

It is used primarily to log messages and errors for the purpose of debugging.

```js
process.stderr.write('An error message\n');
```

---

### Blocking

Note that `stdout` and `stderr` are special streams in Node as they are blocking!

---

## Buffers

Buffers are chunks of binary data in memory.

Typically used for larger data sets, or when you're not sure how much of something you'll get.

---

### Creating Buffers

* `new Buffer(size)`
* `new Buffer(array)`
* `new Buffer(buffer)`
* `new Buffer(str[, encoding])`

---

### Creating Buffers

```js
buf = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
  buf[i] = i + 97; // 97 is ASCII a
}
buf // <Buffer 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77 78 79 7a>
```

---

### Buffers

When would I ever use this?!

---

## File System IO

---

## File System IO

File handling can (and **should**) be non-blocking in Node.

---

## File System IO

File I/O is provided by simple wrappers around standard POSIX functions.

```js
var fs = require('fs');
fs.readFile(...);
```

All the methods have asynchronous and synchronous forms, however...

^When using the synchronous form any exceptions are immediately thrown. You can use try/catch to handle exceptions or allow them to bubble up.

---

<!-- .slide: data-background="white" -->

### Blocking vs Non-Blocking

![inline](images/event-loop.png)

---

## Basic File Operations

* Reading
* Writing
* Appending
* Existence checking
* Getting file info/stats
* Renaming
* Hard-linking
* Sym-linking
* Deleting
* Reading directory

---

## File Reading 101

```js
var fs = require('fs');
fs.readFile('path/to/file.json', function (err, data) {
    if (err) throw err;

    // `data` is a Buffer, so we need to convert to a string...

    console.log( data.toString() );
});
```

^No need to install, fs is a core module

---

### Reading a File

```js
fs.readFile(
    'path/to/file.json',
    { encoding: 'utf-8' },
    function (err, data) {
        if (err) throw err;
        
        // With encoding specified, data is now a String!
        
        console.log( data );
    }
);
```

---

### Evil twin of `readFile`

```js
var data = fs.readFileSync('/path/to/somefile', 'utf8');
```

^Discuss how each method covered has a `sync` version, but why you don't want to use them

---

<!-- .slide: data-background="white" -->

![fit](/images/event-loop.png)

---

### File Writing

```js
fs.writeFile('/path/to/somefile.txt', 'Hello World!', function (err) {
    if (err) {
        // handle it!
        return;
    }
    
    console.log('File written!');
});
```

---

## Asynchronicity

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

# Callback !== Asynchronous

---

## Callback !== Asynchronous

```js
function doStuff(id, cb) {
    if (!Number(id) || id < 0) {
        cb(new Error('The "id" must be a positive integer!'));
        return;
    }
    
    db.User.findById(id, function(err, user) {
        cb(null, user);
    });
}
```

---

## Making Things Asyncronous

```js
function doStuff(id, cb) {
    if (!Number(id) || id < 0) {
        
        process.nextTick(function() {
            cb(new Error('The "id" must be a positive integer!'));
        });
        return;
        
    }
    
    db.User.findById(id, function(err, user) {
        cb(null, user);
    });
}
```

---

# Async Management

---

## Callbacks

All asynchronous actions require a callback.

No library or framework can avoid that (yet*).
<!-- .element: class="fragment" -->

---

### Callback Hell

```js
function getUserDetails(id, cb) {
    db.User.findById(id, function(err, user) {
        if (err) { return cb(err); }
        
        db.Group.findById(user.group, function(err, group) {
            if (err) { return cb(err); }
            
            doGroupAuth(group, user, function(err, authorized) {
                if (err) { return cb(err); }
                
                cb(null, user);
            });
        });
    });
}
```

---

### Fighting Callback Hell

* Named, separate functions (versus anonymous, inline)
* Modularize
* Event Emitters
* Promises (native or with bluebird, q, etc)

---

### Event Emitters

Event emitter is something that triggers an event to which anyone can listen.

In node.js an event can be described simply as a string with a corresponding callback.

---

### Event Emitters

* Event handling in Node uses the observer pattern
* An event, or subject, keeps track of all functions that are associated with it
* These associated functions, known as observers, are executed when the given event is triggered

---

### Using Event Emitters

```js
var events  = require('events');
var emitter = new events.EventEmitter();

emitter.on('knock', function {
    console.log("Who's there?");
});

emitter.on('knock', function {
    console.log("Go away!");
});

emitter.emit('knock');
```

---

### Inheriting from EventEmitter

```js
// in Job.js
var util = require('util');

var Job = module.exports = function Job() {
    
    this.process = function() {
        var theJob = this;
        
        theJob.doSomeWork( function(data) {
            theJob.emit( 'done', {
                result: data
                completedOn: new Date()
            } );
        } );
    }
    
};

util.inherits(Job, require('events').EventEmitter);
```

---

### Inheriting from EventEmitter

```js
var Job = require('./Job');

var myJob = new Job();

myJob.on('done', function(details){
    console.log('My job was completed at', details.completedOn);
});

myJob.process();
```

```no-highlight
var Job = module.exports = function Job() {
    this.process = function() {
        var theJob = this;
        theJob.doSomeWork( function(data) {
            this.emit( 'done', { ... } );
        } );
    }
};
```

---

### Managing Your Listeners

```js
emitter.listeners(eventName);

emitter.on(eventName, listener);

emitter.once(eventName, listener);

emitter.removeListener(eventName, listener);

emitter.removeAllListeners();
```

---

## Promises

Vailable in 4.x or 0.12 (with --harmony)
<!-- .element: class="fragment" -->

---

### Native Node Promises

```js
var fs = require('fs');

function readFile(filename) {

    return new Promise(function(resolve, reject) {
        
        fs.readFile(filename, function(err, data){
          if (err) {
              return reject(err);
          }
          
          resolve(data.toString());
        });
    });
}
```

---

### Using a Promise

```js
function readFile(filename) {
    return new Promise(function(resolve, reject) {
        // inside... call resolve() or reject() as necessary
    });
}
```

```js
readFile('/path/to/file.txt').then(
    function(result) {
        console.log('file data:', result);
    },
    function(err) {
        console.error(err.message);
    }
);
```
<!-- .element: class="fragment" -->

---

### Chaining Promises

```js
readFile('data.json')
    .then( function(data) {
        
        // we return a Promise from a "resolve" handler
        return readFile(data.nextFile + '.json');
        
    } )
    .then( function(data) {
        // handle the data and...
        return readFile('more-data.json');
    } )
    .then( function(result) {
        // handle the next bit of data
        // no need to return a promise at the end.
    } )
    .catch(function(err) {
        console.error(err.message);
    });
```

---

## Promise Libraries

[bluebird](https://github.com/petkaantonov/bluebird)
[q](https://github.com/kriskowal/q)
[co](https://github.com/tj/co)
[suspend](https://github.com/jmar777/suspend)
[when](https://github.com/cujojs/when)
[galaxy](https://github.com/bjouhier/galaxy)
...

---

# Express.js

---

## Express.js

Fast, light, unopinionated framework for web applications.

---

## Express Hello World

```bash
~/my-app$ npm init
...
```

```bash
~/my-app$ npm install express --save
```
<!-- .element: class="fragment" -->

---

## Express Hello World

```js
// in app.js
var express = require('express');
var myApp = express();

myApp.get('/', function handleRoot(req, res, next) {
    res.send('Hello World!');
});

myApp.listen(3000);
```

```bash
~/my-app$ node app.js
```
<!-- .element: class="fragment" -->

---

## Configuring Express

---

## Configuring Express

```js
var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);
app.set('foo', 'bar');
```

```js
// ...

app.listen( app.get('port') );
```
<!-- .element: class="fragment" -->

---

## Middleware

---

![fit](/images/express-middleware.png)

---

### Middleware Examples

```js
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

// app config...

// app middleware...
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
```

```js
app.post('/user', function createUser(req, res) {
    var g = new Gamer({
        name: req.body.name,
        team: req.body.team
    });
    // ...
});
```
<!-- .element: class="fragment" -->

---

### Order Matters!

Middleware are executed in the order specified

```js
app.use( express.logger('dev') );

app.use( require('./myAuthModule') );

app.use( bodyParser.json() );

app.use( bodyParser.urlencoded({ extended: false }) );

app.use( express.static(path.join(__dirname, 'public')) );

// Routing...
```
<!-- .element: class="fragment" -->

---

### Middleware - When does it end?

Middleware processing ends when `next()` is not called  
(or an error is generated)

```js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/about', function aboutUs(req, res, next) {
    
    res.end('We are StrongLoop!');
    
    // no call to next() !
});

app.get('/about', ...);  // will never be hit!
```
<!-- .element: class="fragment" -->

---

### Modular Routing

---

### The 4.0 Router Interface

```js
// in routes/users.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Get a list of users...
  res.render('user/list', { results: users });
});

router.get('/:id', function(req, res, next) {
  // Get a single user...
  res.render('user/my-account', { user: user });
});

router.post('/', function(req, res, next) {
  // Create a user...
  res.redirect('user/my-account', { user: user });
});

module.exports = router;
```

---

### The 4.0 Router Interface

```js
// in app.js
var express = require('express'),
    ...;

var app = express();

// app config and middleware...

app.use('/users', require('./routes/users'));
```

---

### Custom Middleware

---

### Custom Middleware

```js
app.use(function (req, res, next) {
    // Do some work...
    
    // ...then call next() when done:
    next();
});
```

---

### Custom Middleware

```js
app.use(function (req, res, next) {
    
    findUser(req, function(err, data) {
        if (err) {
            return next( err );
        }

        req.user = data
        
        next();
    });
});
```

---

## Handling Middleware Errors

---

### Error Middleware

```js
app.use(function(err, req, res, next) {
    // Do whatever you need to...
    
    if (err.code === 404) {
        
        res.redirect('/error-404');
        
    } else {
        // Or you can keep processing this (or a new) Error
        next( err );
    }
});
```

---

![fit](/images/express-middleware-error.png)

---

### Handling Middleware Errors

Because we can keep passing errors on and on, you should **always** set up a "catchall" error handler!

```js
app.use(function notFoundHandler(...) { ... });
app.use(function badRequestHandler(...) { ... });

app.use(function catchallHandler(err, req, res, next) {
    // If we get here then the error has not been handled yet
    console.error(err.stack);
    res.redirect('/server-error');
});
```

Note that you need **all 4 arguments** even if you don't call `next()`

---

## Request Object

---

## Request Object

* `request.accepts(type)`: checks if the type is accepted
* `request.acceptsLanguage(language)`: checks language
* `request.acceptsCharset(charset)`: checks charset
* `request.ip`: IP address
* `request.path`: URL path
* `request.host`: host without port number
* `request.stale`: checks staleness
* `request.xhr`: true for AJAX-y requests
* `request.protocol`: returns HTTP protocol
* `request.secure`: checks if protocol is `https`
* `request.subdomains`: array of subdomains
* `request.originalUrl`: original URL

---

### Query Parameters

```js
app.get('/users', function (req, res, next) {
    
    var limit = req.query.limit || 10,
        users = [];

    // Retrieve all users...

    res.render('user/list', {
        results: users,
        nextIndex: 11
    });
});
```

---

### URL Parameters

```js
app.get('/users/:id', function (req, res, next) {
    
    var id = req.params.id,
        user = null;

    // Retrieve a single user...
    
    if (req.xhr) {
        res.json({ user: user });
    } else {
        res.render('user/single', {
            user: user
        });
    }
});
```

---

### URL Parameters

```js
app.get(/^\/users\/(\d+)$/, function (req, res, next) {
    
    var id = req.params[0],
        user = null;
        
    // Retrieve a single user...
    // ...
});
```

---

## Response Object

---

### Response Methods

* `response.send( [data] ) // (data is optional)`
* `response.end( [data] )  // (data is optional)`
* `response.set(headerName, headerValue)`
* `response.status(httpStatus)`
* `response.sendFile('file.json',`<br>&nbsp;&nbsp;&nbsp;`{ root: app.get('assetPath') })`
* `response.download('/report-12345.pdf')`

---

## Server-Side Templating

---

### Templates

Small blocks that we can plug data into at run-time

```jade
//- /views/gamers.jade
doctype html
html
    head
        title #{title}
    body
        h1 #{title}
        p.
            This is a list of gamers
        
        ul.main-body.user-list
            each gamer in gamers
                li= gamer.name + ' (' + gamer.team + ')'
```
<!-- .element: class="fragment" -->

---

### Templating Engine

```bash
~/my-app$ npm install --save jade
```

```js
var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');
```

---

### Using a template

```js
app.get('/gamers' function listGamers(req, res, next) {
    
    res.render('index', {
        title: 'Gamer List',
        gamers: [ ... ]
    });
    
});
```

^ Notice that there is no specification of what engine is being used here!!

---

## Debugging

---

## Debugging Step #1:

## Know the API docs!

[nodejs.org/api](https://nodejs.org/api)

---

## Debugging Step #2:

## Use Strict Mode!

```js
'use strict';

var http = require('http');

server = http.createServer( ... ); // not declared!
```

---

### Better Debug Logging

[github.com/visionmedia/debug](https://github.com/visionmedia/debug)

---

## `debug` logging

```js
var logger = require('debug')('my-app:dostuff')

logger('This is a namespaced message', someData);
```

```bash
~$ DEBUG=my-app:* node server.js
~$ DEBUG=my-app:auth* node server.js
~$ DEBUG=express:router,my-app:* node server.js
```
<!-- .element: class="fragment" -->

---

## `debug` logging

```js
var logger = require('debug')('my-app:dostuff')

logger('Starting my app...');
```

<pre><code class='no-highlight'>~/my-app$ DEBUG=express:router,my-app:* node server.js
  <span style='color:lightseagreen !important;'>my-app:dostuff Starting my app... +0ms</span>
  <span style='color:goldenrod !important;'>express:router:route new / +12ms</span>
  <span style='color:darkorchid !important;'>express:router:layer new / +3ms</span>
  <span style='color:lightseagreen !important;'>my-app:dostuff Did some stuff +12ms</span>
  ...</code></pre>

---

<!-- .slide: data-background="white" -->

## Production Logging

![](/images/rosetta.gif)

<cite style='bottom:1em;'>http://etc.usf.edu/clipart/</cite>

---

## Production Logging

* [Winston](https://github.com/winstonjs/winston)
* [Bunyan](https://github.com/trentm/node-bunyan)
* [Morgan](https://github.com/expressjs/morgan) (mostly for Express)

---

### Logging with Winston

```js
var winston = require('winston');

winston.log('info', 'Hello log files!');
winston.info('Hello again logs...');
```

---

### Setting a log level

```js
var winston = require('winston');

winston.level = 'warn';
winston.log('debug', 'This will not be logged!');
```

---

### Logging to a File

```js
var winston = require('winston');

winston.add(winston.transports.File, { filename: 'somefile.log' });

winston.info('Hello log file!');
```

<p class='fragment'>
Note that this is **adding** a transport,<br>not replacing the default (`console`)!
</p>

---

### Multiple Transports

```js
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ level: 'debug' }),
        new (winston.transports.File)({
            filename: 'somefile.log',
            level: 'warn'
        })
    ]
});

logger.debug('I will only print to the console!');
logger.warn('I will print everywhere!');
```

---

## Debug Console

---

### The Built-In Debugger

```bash
~$ node debug server.js
```

```no-highlight
< Debugger listening on port 5858
debug> . ok
break in server.js:1
> 1 'use strict';
  2
  3 var http = require('http'),
debug> 
```
<!-- .element: class="fragment" -->

---

### The Built-In Debugger

```no-highlight
break in server.js:1
> 1 'use strict';
  2
  3 var http = require('http'),
debug> n
```

```no-highlight
break in server.js:3
  2
> 3 var http = require('http'),
  4     fs = require('fs'),
debug> 
```
<!-- .element: class="fragment" -->

---

### The Built-In Debugger

Use commands to move forward:

* `c` => continue with code execution
* `n` => execute this line and go to next line
* `s` => step into this function
* `o` => finish function execution and step out

We can also:

* setBreakpoint( 'app.js', 13 )
* watch( req.user )

---

### Better Debugging with `node-inspector`!

---

## `node-inspector`

### Chrome dev tools for Node!

^ Node Inspector works in Chrome and Opera only. You have to re-open the inspector page in one of those browsers if another browser is your default web browser (e.g. Safari or Internet Explorer).

---

### Using node-inspector

```bash
~$ npm install -g node-inspector
```

```bash
~$ node-debug server.js
```
<!-- .element: class="fragment" -->

Now head over to Chrome, the page should already be up!
<!-- .element: class="fragment" -->

^ Really dive into node-inspector, show off everything, and have them debug their own apps

---

# `node-inspector` demo

---

# Node in Production

---

## Step 1: Use a Process Manager!

---

### Using a Process Manager

Clustering, scaling, auto-restart, metrics, etc

* [StrongLoop Process Manager (`strong-pm`)](https://github.com/strongloop/strong-pm)
* [PM2](https://github.com/Unitech/pm2)

[Comparison Chart](http://strong-pm.io/compare)
<!-- .element: class="fragment" -->

---

### Setting Up Strong-PM

First, run strong-pm on your **deployment** machine:

```no-highlight
~$ npm install -g strong-pm
~$ sl-pm-install
~$ /sbin/initctl start strong-pm
```

You should also set the `NODE_ENV` environment variable to "production"!

^ These commands are for Ubuntu, but similar commands work on other Linux ditros
This also sets up auto-restart (system service)

---

## Building Your App

Produce a distributable file...

```no-highlight
~$ npm install -g strongloop
```
<!-- .element: class="fragment" -->

---

## Building Your App

To an npm archive (tar gzip):

```no-highlight
~/my-app$ slc build --npm
...
~/my-app$ ls
  ...  my-app-0.1.0.tgz
```

(You can also build to a git branch.)

---

### Including Built Dependencies

You can speed up deployments by including OS-level building of dependencies:

```no-highlight
~/my-app$ slc build --npm --install --scripts
```

_Caution! You need to be on the same system architecture as the machine you deploy to._

---

### Locking Down Dependency Versions

Running `npm install` on a deployment machine can be dangerous as you may get newer (broken) versions of dependencies.

We can lock down dependency versions with:

```no-highlight
~/my-app$ npm shrinkwrap
```

_**However**, if npm is down at the time of deployment you're still in trouble!_

---

## Deploying Your App

By using the StrongLoop Process Manager you can achieve zero-downtime deploys.

This is done with rolling deployments (one pid at a time).

```no-highlight
~/my-app$ slc deploy http://myserver.com:8701
```
<!-- .element: class="fragment" -->

^ Note that `8701` is default port for strong-pm.

---

# Scaling Node

---

## The `cluster` Module

```js
var http = require('http'),
    cluster = require('cluster'),
    numCPUCores = require('os').cpus().length;

if (cluster.isMaster) {
  
    for (var i = 0; i < numCPUCores; i++) {
        cluster.fork();
    };
  
} else {
    
    http
        .createServer(function(req, res) {
            // ...
        })
        .listen(3000);
});
```

---

## Scaling Node

Do you _really_ want that clustering code in your application source?

Instead, use your process manager!
<!-- .element: class="fragment" -->

```no-highlight
~$ slc ctl -C http://myserver.com:8701 set-size my-app 8
```
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

## Building and Deploying From Arc

![](/images/arc-build-deploy.png)
<!-- .element: class="fragment" -->

---

## Metrics and Monitoring

---

### Available Metrics

* CPU Load (system)
* Heap Memory sage
* Event Loop Count
* Event Loop Tick Timing
* HTTP Connections
* Database Connections (Oracle, MySQL, Mongo, Postgres)
* Misc other modules (Redis, Memcache(d), Message queues)

---

<!-- .slide: data-background="white" -->

### What do I look for?

![](/images/arc-heap-normal.png)

---

<!-- .slide: data-background="white" -->

### What do I look for?

![](/images/heap-problem.png)

^ Note the consistent increase in memory usage without dropping (GC)
CPU and HTTP usage is obvious: higher == worse

---

### What do I look for?

The two **Event Loop** metrics are opposed. You want the loop count to remain high under normal load (more ticks per metrics cycle is good). Any dips may be bad.

The **Loop** timing, on the other hand, indicates how long event loop ticks are taking. Any spikes here are bad!

^ The Loop Count here is fine, a drop in loop count indicates less ticks (bad)
The Loop timing is bad if it goes up, that means something is blocking the loop

---

# Profiling

---

## Profiling

We can spot issues using the metrics being monitored, but now we need to find the cause of those issues.

Profiling CPU usage and memory is the way to do this.

---

<!-- .slide: data-background="white" -->

## Profiling in Arc

![](/images/arc-profiler-heap.png)

^ Demo interface, walk through creating each type, picking a process, etc
Be sure to mention being able to load profile files (using "Profile Target")

---

<!-- .slide: data-background="white" -->

## CPU Profiles

![](/images/cpu-profiles.png)

---

<!-- .slide: data-background="white" -->

## Memory Profiles

![](/images/heap-snapshot.png)

---

### Programmatic Memory Monitoring

If we have memory issues, it may be helpful to monitor memory usage dynamically.

```
~$ npm install heapdump --save
```

```js
var heapdump = require('heapdump');
var THRESHOLD = 300;

setInterval(function () {
    var memMB = process.memoryUsage().heapUsed / 1048576;
    if (memMB > THRESHOLD) {
        process.chdir('/path/to/writeable/dir');
        heapdump.writeSnapshot();
    }
}, 60000 * 5);
```
<!-- .element: class="fragment" -->

---

### Memory Monitoring

**Caution: Taking a heap snapshot is not trivial on resources.**

If you already have a memory problem, this could kill your process!

---

## What About CPU Issues?

---

## Smart Profiling

1. Monitors a specific worker process
1. If event loop blocked more than 20ms, start CPU profile
1. Stop profiling once event loop resumes

^ without last argument, `cpu-start` starts profiling immediately 'til you tell
it to stop

---

## Smart Profiling

![](/images/smart-profiler.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/arc-landing.png)

---

<!-- .slide: class="no-footer" -->

# Thank You!

![{{speaker}}]() ![{{contact}}]()

![{{url}}]()

![](/images/StrongLoop.png)
<!-- .element: style="width:70%" -->
