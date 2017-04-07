<!-- .slide: class="no-footer" -->

![](/images/StrongLoop.png)

# Triage, Diagnose, and Scale Node.js

![{{speaker}}]()

![{{contact}}]()

---

<!-- .slide: data-background="white" -->

![fit](/images/StrongLoop_who.png)

---

<!-- .slide: class="no-footer" data-background="#0001ab" -->

<img src='/images/blue_screen.jpg' alt='Windows Error' style='width:80%;'>

---

## Triage

### What's the problem?
<!-- .element: class="fragment" -->

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

### Better `Error` Handling

Using Express? Add a "catchall" error handler!

```js
app.use(function badRequestHandler(err, req, res, next) {
    if (err.code === 400) {
        // ...
    } else {
        next(err);
    }
});
```

```js
app.use(function catchallHandler(err, req, res, next) {
    // If we get here, HANDLE THE ERROR.
    
    // do NOT call next() ... (but you do have to include it above)
});
```

---

### Better 'Error' Handling

You also probably want an `uncaughtException` event handler:

```js
process.on('uncaughtException', function(err) {
    
    logger.error(err);
    dbCleanup(); // or whatever else you need to do...
    
    // by catching this, our application won't stop!
    process.exit(13);
});
```

_But if I let my app exit, then my server will be down!_
<!-- .element: class="fragment" -->

That's why we use a process manager.
<!-- .element: class="fragment" -->

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

```bash
~$ node-debug --debug-port=5656 --web-port=1337 server.js
```
<!-- .element: class="fragment" -->

Now head over to Chrome, the page should already be up!
<!-- .element: class="fragment" -->

---

## `node-inspector` demo

---

## What if the problem is intermittent?

---

### Step 1: Run Node in a Process Manager

<p class='fragment'>
    Clustering, auto-restart, metrics, remote deploy;<br>
    all without altering application code.
</p>

<div class='fragment'>
    <p>
        [StrongPM](https://github.com/strongloop/strong-pm)<br>
        [PM2](https://github.com/Unitech/pm2)
    </p>
    
    <p>[Comparison Chart](http://strong-pm.io/compare)</p>
</div>

---

### Step 2: Look at your metrics.

<div class='fragment'>
    <p>First, let's run our app under strong-pm:</p>
    
    <pre><code>~$ npm install -g strongloop</code></pre>
    
    <pre><code>~/my-app$ slc start
...
~/my-app$ slc arc</code></pre>
</div>

---

<!-- .slide: data-background="white" -->

### Viewing Metrics

![](/images/arc-metrics.png)

---

### Available Metrics

* CPU Load (system)
* Heap Memory usage
* Event Loop Count
* Event Loop Tick Timing
* HTTP Connections
* Database Connections (Oracle, MySQL, Mongo, Postgres)

_PM2 monitors CPU & memory, plus other metrics through keymetrics.io_
<!-- .element: class="fragment" -->

---

## What do I look for?

---

<!-- .slide: data-background="white" -->

### What do I look for?

**CPU Usage** is pretty obvious, just watach your high points!

With **Heap Memory Usage** you want to see a "sawtooth" chart, drops indicate garbage collection.

![](/images/arc-heap-normal.png)

---

<!-- .slide: data-background="white" -->

### What do I look for?

A problematic heap memory chart might look like this:

![](/images/heap-problem.png)

---

### What do I look for?

The two Event Loop metrics are opposed.

**Watch for drops in Loop Count**  
(Event loop ticks per time slice)

**Watch for spikes in Loop Timing**  
(Average time between ticks)

---

<!-- .slide: data-background="white" -->

![fit](/images/event-loop.png)

---

<!-- .slide: data-background="white" -->

## You can't watch metrics all day...

![](/images/millhouse.gif)

---

### Dynamic heap memory dumps

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

### Heap Memory Dumps

Pro Tip: Have a good baseline to compare!

---

## Scaling

---

<!-- .slide: data-background="white" -->

<img src='/images/vertial-scaling-strongloop.png' alt='Scale vertically' style='width:100%;'>

---

### The `cluster` Module

```js
var http = require('http'),
    cluster = require('cluster');

if (cluster.isMaster) {
  
    for (var i = 0; i < numCPUCores; i++) {
        cluster.fork();
    };
  
} else {
    http.createServer(function(req, res) { ... })
        .listen(8080, ...);
});
```

---

### The `cluster` Module

**_Do you really want this in your source code?_**

---

### Using a Process Manager

<div class='fragment'>
    <p>
        Clustering, auto-restart, metrics, remote deploy;<br>
        all without altering application code.
    </p>

    <p>
        [StrongPM](https://github.com/strongloop/strong-pm)<br>
        [PM2](https://github.com/Unitech/pm2)
    </p>
    
    <p>[Comparison Chart](http://strong-pm.io/compare)</p>
</div>

---

### Setting Up Strong-PM

On your **production** machine...

```no-highlight
~$ npm install -g strong-pm
~$ sl-pm-install
~$ /sbin/initctl start strong-pm
```

Set the `NODE_ENV` environment variable to "production"!

---

### Build & Deploy

On your development (or staging) machine...

```no-highlight
~/my-app$ slc build --npm
...
~/my-app$ ls -l ../
...
-rw-rw-r--  1 looper looper 11663607 Aug 13 08:31 my-app-0.1.0.tgz
...
```

---

### Build & Deploy

Now we can deploy to our remote machine:

```bash
~/my-app$ slc deploy http+ssh://myserver.com:8701
```

(Note that in this case you need [ssh auth set up](http://docs.strongloop.com/display/SLC/Securing+Process+Manager).)

---

### Scaling Your Server

From any machine we can control the remote deployment...

```
~$ slc ctl -C http+ssh://myserver.com:8701 set-size my-app 8
```

And dynamically set the cluster size!

---

<!-- .slide: data-background="white" -->

![fit](/images/horizontal-scaling.png)

---

## Horizontal Scaling

1. Install a load balancer
<!-- .element: class="fragment" -->
1. Install `strong-pm` on each machine
<!-- .element: class="fragment" -->
1. Deploy to each host
<!-- .element: class="fragment" -->
1. Use Arc to manage all instances together!
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

### Managing Hosts from Arc

![](/images/arc-pm.png)

---

<!-- .slide: data-background="white" -->

![](/images/arc-landing.png)

---

<!-- .slide: class="no-footer" -->

# Thank You!

![{{speaker}}]()

![{{contact}}]()

![{{url}}]()

![StrongLoop](/images/strongloop_logo_horiz.png)
<!-- .element: style="width:60%" -->
