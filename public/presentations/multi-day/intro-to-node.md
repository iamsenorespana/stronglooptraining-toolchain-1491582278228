
![](/images/StrongLoop.png)

# Introduction to Node.js

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
* Solid standard (ECMAScript)
<!-- .element: class="fragment" -->
* Vibrant ecosystem (npm)
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

## Node is JavaScript

### So what is ECMAScript?
<!-- .element: class="fragment" -->

---

## ECMAScript: A Language Specification

* Browser implementations (like Chrome's V8)
* Node builds on V8 with C++

^ European Computer Manufacturer's Association

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
//my-module.js
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
workerOne.giveRaise(10000);  // workerOne.salary === 50000

var workerTwo = getWorker({ salary: 60000 });
workerTwo.giveRaise(5000);   // workerTwo.salary === 65000
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
workerOne.giveRaise(1000);   // workerOne.salary === 51000

var workerTwo = new Worker();
workerTwo.giveRaise(8000);   // workerTwo.salary === 58000
```
<!-- .element: class="fragment" -->

---

## Introduction to NPM

![fit](/images/npm.png)

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

## Setting Up npm

Let's also set some basic config values...

```no-highlight
~$ npm set init.author.name "Your Name"
~$ npm set init.author.email "you@example.com"
~$ npm set init.author.url "http://yourblog.com"
```
<!-- .element: class="fragment" -->

Sign up on the npm website and then verify yourself:
<!-- .element: class="fragment" -->

```no-highlight
~$ npm adduser
```
<!-- .element: class="fragment" -->

---

### Installing Packages

**Locally in a Project**  
_(most of your projects' dependencies: express, lodash, mongodb, etc.)_

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

You should almost always be saving dependencies to your `package.json`:

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

Mostly for tools (scaffolding, testing, build, deploy, etc.)

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

## Private Registries

* Hosted by npmjs, or
* Hosted by you

^Discuss the differences between npmjs.org and enterprise private repositories. Elaborate on how internal can be used and mixed with the public repository.

---

## Private Registries

* Code is not exposed to outside world
* No external dependencies (if self-hosted)

---

## Listing Modules

In your project...

```bash
~/my-project$ npm ls
/home/johndoe/node-app
|__ q@1.0.1
```

Globally...

```bash
~$ npm ls -g
/usr/lib
|__ bower@1.3.11
  |__ abbrev@1.0.5
  |__ archy@0.0.2
|__ semver@4.0.0
```

^ here using `--depth=0`, `--depth=1`

---

## Searching for Modules

```no-highlight
$ npm search [keyword]
```

Or just use [npmjs.com](http://npmjs.com)!

^ or use google; npm's search doesn't work well at all c.2015

---

## Update Dependencies

To update an npm module, use the update command

```no-highlight
~/my-project$ npm update mysql
```

Or update all dependencies...

```no-highlight
~/my-project$ npm update
```

---

## Remove a module

To remove an npm module

```no-highlight
~/my-project$ npm rm mysql
```

_(Does **NOT** remove the dependency!)_

```no-highlight
~$ npm rm mysql -g
```
<!-- .element: class="fragment" -->

---

# Node Core

---

### The `global` object

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

### Command line Arguments

The command line accepts arguments:

```no-highlight
$ echo "Hello World!"  // "Hello World" is the argument here
```

Node makes these arguments accessible via `process.argv`

---

### Command line Arguments

The `argv` property is an array, but be careful, the first two elements are 'node' and the script filename!

```no-highlight
$ node app.js arg1 arg2 arg3=val3
```

```js
process.argv == [
    'node', 'app.js', 'arg1', 'arg2', 'arg3=val3'
]
```

^ "space delimited tokens" rather than "CL arguments" as we typically think of them

---

### Command line Arguments

A better option would be to use a library!

* [Commander](https://github.com/tj/commander.js)
* [Minimist](https://github.com/substack/minimist)
* [Yargs](https://github.com/bcoe/yargs)

---

### Killing the Process

To exit the Node process, use the `exit()` function:

```js
process.exit( 0 );    // successful exit

process.exit( 127 );  // error exit (command not found)

process.exit( 187 );  // error exit (custom)
```

_Note that "program" errors should be between 129 and 255._

([And Node uses some in the 0XX range.](https://nodejs.org/api/process.html#process_exit_codes))

---

### Process events

```js
process.on('uncaughtException', function(err) {
    
    // log the error...
    console.log('Caught exception: ' + err);
    
    // Then kill the process!!
    process.exit(187);
    
});

process.on('SIGINT', function gracefulShutdown() {
    // Do any shutdown requirements...
    
    // ...the process will ALWAYS die here!
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
// print to stdout
console.log('message', data);
console.log('message from user id: %d', id);

// print to stderr
console.error('this is an error');
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

```no-highlight
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

### `Server`, `Request`, and `Response`

```js
// server.js
var http = require('http');

var server = http.createServer(function handleRequest(req, res) {
    res.writeHead( 200, {
        'Content-Type': 'text/plain',
        'X-Foo': 'Bar'
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

# Other Core Modules

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
var ps = cp.exec('nonexistent-command', function (err, stdout, stderr) {
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

To access a child process' streams, use the `spawn` function

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
* to write to a spawned process, use its `stdin`'s `write` function
* close the input stream (`stdin`) to allow the spawned process to continue its
execution

---

## Streams and Buffers

---

### Standard Streams

Standard streams are I/O channels between an application and its
execution environment.

There are three standard streams:

* standard input - `stdin`
* standard output - `stdout`
* standard error - `stderr`

^Note that the execution environment is typically a shell terminal

---

`stdin`

The standard input stream provides access to data coming into an application.

This is achieved via a read operation.

Input typically comes from the keyboard used to started the process.

^ note that `process.stdin` is **readable**, `cp.stdin` is **writable**! (read `stdin` from inside, write to it from outside)

---

To listen in on data from `stdin`, use the `data` and `end` events:
<!-- todo: "To consume / To respond to / to receive ... listen to/attach listeners to the xyz events"; 'listen in on' is ambiguous/imprecise, ditto 'use' for events--> 

```js
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    console.log('chunk: ', chunk);
});

process.stdin.on('end', function () {
    console.log('--- END ---');
});
```

---

Notes:

* `data` event - input fed into the program. Depending on the size of
the input, this event can trigger multiple times

* `end` event - signals the conclusion of the input stream

* `stdin` is paused by default, and must be resumed before data can
be read from it

---

`stdout`

The standard output stream receives data going out of an application.

This is done via a write operation.

Data written to standard output is typically printed to the command line.

---

To write to `stdout`, use the `write` function:

```js
process.stdout.write('A simple message\n');
```

^ what `console.log does` internally

---

`stderr`

The standard error stream is an output stream like `stdout`.

It is used primarily to log messages and errors for the purpose of
debugging.

---

Writing to `stderr` is done similarly to `stdout`:

```js
process.stderr.write('An error message\n');
```

---

Note that `stdout` and `stderr` are special streams in Node as they are blocking!

---

## Teletype Context

To check if the application is being run in TTY context, use the `isTTY`
property of the standard streams:

```no-highlight
~/my-project$ node teletype.js
// process.stdin.isTTY === true
// process.stdout.isTTY === true

~/my-project$ echo "hello world" | node teletype.js
// process.stdin.isTTY === false

~/my-project$ node teletype.js | cat
// process.stdout.isTTY === false
```

---

## Buffers

Buffers are chunks of binary data in memory.

Typically used for larger data sets, or when you're not sure how much of something you'll get (like HTTP request bodies!).

---

### Buffers

Binary data type, to create:
<!-- todo: "*Binary data type*, to create"?? -->

* `new Buffer(size)`
* `new Buffer(array)`
* `new Buffer(buffer)`
* `new Buffer(str[, encoding])`

Docs: <http://bit.ly/1IeAcZ1>

---

```js
buf = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
  buf[i] = i + 97; // 97 is ASCII a
}
buf // <Buffer 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77 78 79 7a>
```

Buffer Conversion:

```js
buf.toString('ascii');        // abcdefghijklmnopqrstuvwxyz
buf.toString('ascii', 0, 5);  // abcde
buf.toString('utf8', 0, 5);   // abcde
buf.toString(undefined, 0, 5);// abcde (encoding defaults to 'utf8')
```

---

## File System I/O

---

## File System I/O

<https://nodejs.org/api/fs.html>

File handling can (and **should**) be non-blocking.

---

## File System I/O

File I/O is provided by simple wrappers around standard POSIX functions.

```js
var fs = require('fs');
fs.readFile(...);
```

All the methods have asynchronous and synchronous forms...

^When using the synchronous form any exceptions are immediately thrown. You can use try/catch to handle exceptions or allow them to bubble up.

---

### Blocking vs Non-Blocking

![inline](images/threaded.png)

---

### Blocking vs Non-Blocking

![inline](images/event-loop.png)

---

## Basic File Operations

* Reading
* Writing
* Appending
* Existence checking\*
* Getting file info/stats
* Renaming
* Hard-linking
* Sym-linking
* Deleting
* Reading directory

_\*deprecated_

---

## File Reading 101

When retrieving contents from a file:

1. check if the file exists
1. open the desired file
1. create a buffer to hold the contents of the file
1. read data into the buffer
1. output data to the user in some manner
1. close the file

---

### Reading a File

```js
var fs = require('fs');
fs.readFile('path/to/file.json', function (err, data) {
    if (err) {
        // Handle the error somehow...
        return;
    }
    
    console.log( data.toString() );  // note the toString() call!
});
```

`data` in this case will be a `Buffer`!

^No need to install, fs is a core module

---

### Reading a File

```js
fs.readFile('path/to/file.json', { encoding: 'utf-8' }, function (err, data) {
    if (err) {
        // Handle the error somehow...
        return;
    }
    
    console.log( typeof data );  // "string"!
});
```

---

### Evil Twin of `readFile`

```js
var data = fs.readFileSync('/path/to/somefile', 'utf8');
```

^Discuss how each method covered has a `sync` version, but why you don't want to use them

---

### File Writing

```js
fs.writeFile('/path/to/somefile', 'Hello World!', function (err) {
    if (err) {
        // Handle the error somehow...
        return;
    }
    
    console.log('File written!');
});
```

---

### Don't do this!

```js
fs.exists('/file/path', function (exists) {
    if (exists) {
        console.log('File exists!');
    }
});
```

**The `fs.exists()` method is deprecated in v4.x.**

_Checking for file existence before reading is an anti-pattern!_  
_(it can lead to race conditions)_

^Checking for existence before reading/writing can lead to race conditions

---

### Instead, `stat` the file!

```js
fs.stat('/file/path', function (err, stats) {
    if (err) { /* ... */ }

    console.log('File Stats:', stats);
});
```

---

### File Stats

The `stats` object returned by fs.stat provides metadata and methods

* Last modification time: `stats.mtime`
* File size: `stats.size`

* `stats.isFile()`
* `stats.isDirectory()`
* `stats.isSocket()`

---

### Reading a Directory

```js
fs.readdir('/path/to/dir', function (err, files) {
    if (err) { /* ... */ }
  
    console.log( files );
    // [ 'one.txt', 'somedir', 'two.txt', 'three.txt' ]
});
```

### Deleting a File or Directory

```js
fs.unlink('/path/to/somefile', function (err) {
    if (err) { /* ... */ }
    console.log('File deleted');
});
```

---

# Sync vs Async

^ Go to other presentation

---

# Scaling

---

![fit](/images/event-loop.png)

---

## Vertical Scaling

![](images/vertial-scaling-strongloop.png)

---

## Node Clustering

---

```js
var http = require('http'),
    cluster = require('cluster'),
    os = require('os'),
    numCPUCores = os.cpus().length;

if (cluster.isMaster) {
  
    for (var i = 0; i < numCPUCores; i++) {
        cluster.fork();
    };
  
} else {
    
    http
        .createServer(function(req, res) {
            // ...
        })
        .listen(8080);
});
```

---

## Using a Process Manager

Easy clustering and scaling without altering application code

* [StrongLoop Process Manager (`strong-pm`)](https://github.com/strongloop/strong-pm)
<!-- .element: class="fragment" -->

* [PM2](https://github.com/Unitech/pm2)
<!-- .element: class="fragment" -->

* [Comparison Chart](http://strong-pm.io/compare)
<!-- .element: class="fragment" -->

* <a href="https://github.com/foreverjs/forever">Forever</a>
<!-- .element: class="fragment" -->

^ More on this later in the course!
Including using a load balancer

---

## Load Balancing

`cluster` uses a simple round-robin approach...

...which isn't great.
<!-- .element: class="fragment" -->

---

## Load Balancing

Instead, try using a web server like [nginx](http://wiki.nginx.org/Main)!

(More on that later.)

---

# fin
