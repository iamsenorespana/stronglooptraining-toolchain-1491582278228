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
