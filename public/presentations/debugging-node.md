
![](/images/StrongLoop.png)

## Debugging Node

![{{speaker}}]()

![{{contact}}]()

---

![fit](/images/StrongLoop_who.png)

---

# Simple Tips to Start

---

@module/debug-tips

---

# Try things with REPL

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

@module/logging

---

@module/debugging-errors

---

## Okay, we have an error...

_How do we debug it?_
<!-- .element: class="fragment" -->

---

@module/debuggers

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

<!-- .slide: data-background="white" -->

### Step 2: View Your Metrics

![](/images/arc-metrics.png)

---

### What Metrics?

In Node core...

* CPU Load (system)
* Heap Memory usage

<div class='fragment'>
  <p>and through [paid tools](https://strongloop.com/node-js/performance-monitoring/)...</p>
  <ul>
    <li>Event Loop Count & Timing</li>
    <li>HTTP & Database Connections</li>
  </ul>
</div>

---

### What do I look for?

Anomolies, mostly...
<!-- .element: class="fragment" -->

---

### Memory Leaks

![](/images/arc-heap-normal.png)

![](/images/heap-problem.png)
<!-- .element: class="fragment" -->

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

## What about dynamic CPU profiles?

This one takes a lot more effort...

```js
var os = require('os');

console.log( os.cpus() );
```
<!-- .element: class="fragment" -->

```no-highlight
[ { model: 'Intel(R) Core(TM) i7 ...',
    speed: 2926,
    times: { user: 252020, nice: 0, sys: 30340, idle: 1070356870, irq: 0 }
  }, ...
]
```
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

### How about using StrongLoop Arc?

## Arc provides a "Smart CPU Profiler"

![](/images/smart-profiler.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/arc-landing.png)

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]()

![{{contact}}]()

![{{url}}]()
