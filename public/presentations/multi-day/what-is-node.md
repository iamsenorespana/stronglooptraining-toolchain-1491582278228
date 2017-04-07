
![](/images/StrongLoop.png)

# What is Node.js?

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
* Callback Hell
<!-- .element: class="fragment" -->
* Frameworks and tools are still growing
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

Don't use Node.js for CPU-intensive tasks on the web.

^Node.js certainly has some disadvantages, but it is currently one of the best tools out there in order to create asynchronous, non-blocking apps.

---

# What is Node?

---

## Node is not "JavaScript"

## Node is ECMAScript
<!-- .element: class="fragment" -->

### So what is ECMAScript?
<!-- .element: class="fragment" -->

^ Node is not "JavaScript" because JavaScript is trademarked

---

## ECMAScript: A Language Specification

* Browser implementations (like Chrome's V8)
* Node builds on V8 with C++

^ European Computer Manufacturer's Association

---

### The Node Core

* V8: The engine
* LibUv: Event loop and async management
<!-- .element: class="fragment" -->
* A standard library
<!-- .element: class="fragment" -->

^It's written originally for *nix systems. Libev provides a simple yet optimized event loop for the process to run on. You can read more about libev here.  
It handles file descriptors, data handlers, sockets etc. You can read more about it here here.  
LibUv performs, mantains and manages all the io and events in the event pool. ( in case of libeio threadpool ). You should check out Ryan Dahl's tutorial on libUv. That will start making more sense to you about how libUv works itself and then you will understand how node.js works on the top of libuv and v8.

---

![fit](/images/Node-Architecture.png)

---

## Node Applications

### A Collection of Modules
<!-- .element: class="fragment" -->

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

^ Make sure to discuss in detail what 'exports' does and how `require()` works.

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

# Node Core

---

## The Node `process`

An interface to the current Node system process:

* Environment variables (`process.env`)
* CLI args (`process.argv`)
* System Process ID (`process.pid`)
* etc, etc...

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

## Other Node Core Libraries

---

## HTTP (in 10 lines)

```js
var http = require( 'http' );

var server = http.createServer( function handleRequests( req, res ) {
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

## More Core

* Streams
* Crypto
* Cluster
* Events
* ...

---

# Data Sources

Easy to connect to most database management systems

Native drivers for:

* Oracle
* MySQL
* MSSQL
* MongoDB
* DB2
* Cloudant

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
  // ...
});
connection.connect();

connection.query(
    "SELECT * FROM `books` WHERE author='Tolstoy'",
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

# fin
