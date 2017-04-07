
![](/images/StrongLoop.png)

# Debugging Node.js

---

# Simple Tips to Start

---

## Simple Tip #1:

## Know the API docs!

[nodejs.org/api](https://nodejs.org/api)

---

## Simple Tip #2:

## Use Strict Mode!

```js
'use strict';

var http = require('http');

server = http.createServer(...)  // << no var declaration!

// ...
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

---

# REPL

---

## Read, Evaluate, Print Loop (REPL)

```bash
~$ node
> 
```
<!-- .element: class="fragment" -->

```bash
~$ node
> function foo() { return "bar"; }
undefined
> foo()
'bar'
> 
```
<!-- .element: class="fragment" -->

^ Make sure to tell them how to quit! (ctrl+C)

---

## REPL Example

```bash
~$ node
> var fs = require('fs')
undefined
> fs.readFile('some-file.json', function(err, data) { ... })
...
```

---

# REPL Demo

---

<!-- .slide: data-background="white" -->

![](/images/log.png)

<cite style='bottom:-8em;'>http://thedailyomnivore.net/2012/02/20/ren-stimpy/</cite>

---

## Using the `console`

Works mostly like it does in the browser (limited)
<!-- .element: class="fragment" -->

```js
console.log('some message');
console.info('a message and', data);
console.warn('Hmm, this may be a problem');
console.error(err);
```
<!-- .element: class="fragment" -->

---

## Using the `console`

`console.error()` does **not** automatically print a stack trace!

```js
var err = new Error('Oops...');
...
console.error(err);
```

In our terminal we see:

```no-highlight
[Error: Oops...]
```

---

## Using the `console`

Try using the `stack` property of the error object!

```js
var err = new Error('Oops...');
...
console.error(err.stack);
```

```no-highlight
Error: Oops
    at doStuff (/path/to/some-module.js:25:19)
    at Server.handleRequests (/path/to/server.js:7:5)
    at Server.emit (events.js:110:17)
    ...
```
<!-- .element: class="fragment" -->

---

## Using the `console`

Output is sent to `stdout` and `stderr`

```js
console.log('message', data);  // stdout
console.info(...);             // stdout

console.warn(...);             // stderr
console.error(...);            // stderr
```

---

### Debug Logging

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

<!-- .slide: data-background="black" -->

## Cryptic System Errors
<!-- .element: style="color:#fff" -->

<img src='/images/starbucks.jpg' alt='Starbucks cup' style='width:35%;'>

<cite style='bottom:0em;'>http://reversecultureshock.com/2009/09/29/storm-in-a-coffee-cup/</cite>

---

### Common System Errors

<ul>
    <li class='fragment'>
        `EADDRINUSE` <span class='fine'>(address in use)</span><br>
        That port is already being listended on.
    </li>
    <li class='fragment'>
        `ECONNRESET` <span class='fine'>(connection reset)</span><br>
        Did you try to make an HTTP call out? It may have failed.
    </li>
    <li class='fragment'>
        `EACCES` <span class='fine'>(no access)</span><br>
        Whatever user your app runs under is missing some privileges.
    </li>
    <li class='fragment'>
        `ENOENT` <span class='fine'>(no entry)</span><br>
        Did you try to read a non-existent file? Maybe a config file?
    </li>
</ul>

---

## What about your own errors?

<p class='fragment' style='color: #000; font-size:4em;'>ಠ_ಠ</p>

---

### Better `Error` Handling

```js 
db.getRecords(req.query.filter, function handleRecords(err, results) {
    if (err) {
        return next(err);
        // What does this error say exactly??
        // Will you user understand it?!?
    }
    
    // ...
});
```

---

### Better `Error` Handling

```js 
db.getRecords(req.query.filter, function handleRecords(err, results) {
    if (err) {
        var dbErr = new Error('There was problem retrieving records!');
        dbErr.code = 510;
        
        logger.error(err);
        return next(dbErr);
    }
    
    // ...
});
```

---

### Errors in Express

```js
app.use(function badRequestHandler(err, req, res, next) {
    if (err.code === 400) {
        // ...
    } else {
        next(err);
    }
});
```

Add a "catchall" error handler!

```js
app.use(function catchallHandler(err, req, res, next) {
    // If we get here, HANDLE THE ERROR.
    
    // do NOT call next() ... (but you do have to include it above)
});
```

---

### Uncaught Errors

```js
process.on('uncaughtException', functionun caughtErrors(err) {
    
    logger.error(err);
    dbCleanup(); // or whatever else you need to do...
    
    // by catching this, our application won't stop!
    process.exit(187);
});
```

_But if I let my app exit, then my server will be down!_
<!-- .element: class="fragment" -->

That's why we use a process manager.
<!-- .element: class="fragment" -->

---

### Operating System Termination

What if the operating system kills your process?  

```js
function gracefulShutdown(err) {
    
    logger.error(err);
    dbCleanup();  // or whatever else you need to do...
    
    // by catching this, our application won't stop!
    process.exit(187);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

---

### Exit Codes

**Caution:** A zero (`0`) exit code indicates success!!

Your "program" exit codes should be between 129 and 255

---

## Okay, we have an error...

_How do we debug it?_
<!-- .element: class="fragment" -->

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

---

### Debug REPL

While stepping through code, type `repl`:

```no-highlight
  1 var x = 10;
> 2 x = 5;
debug> repl
Press Ctrl + C to leave debug repl
> x
x = 10
>
```

---

## Breakpoints

---

### Adding Breakpoints (in code)

```js
var msg = 'Hello World';
debugger;  // <-- code execution will pause here
console.log(msg);
```

---

### Adding Breakpoints (using debug console)

```no-highlight
< Debugger listening on port 5858
debug> . ok
break in script.js:1
> 1 var x = 10;
  2 x = 5;
debug> setBreakpoint('script.js', 2)
Warning: script 'script.js' was not loaded yet.
> 1 var x = 10;
* 2 x = 5;
debug> c
break in test.js:2
  1 var x = 10;
> 2 x = 5
```

---

## node-inspector

_Chrome dev tools for Node!_
<!-- .element: class="fragment" style="display:block; margin-top:2em;" -->

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

---

## `node-inspector` demo

---

# fin
