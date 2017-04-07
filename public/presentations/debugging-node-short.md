
![](/images/StrongLoop.png)

## Debugging and Profling Node.js

![{{speaker}}]() | ![{{contact}}]()

---

![fit](/images/faces_of_node.png)

---

# Simple Tips to Start

---

@module/debug-tips

---

@module/debugging-errors

---

## Okay, we have an error...

_How do we debug it?_
<!-- .element: class="fragment" -->

---

@module/debuggers

---

## Digging In with Profiles

<img src='/images/dig.gif' style='width:50%'>

---

### Finding Memory Leaks with Snapshots

```no-highlight
~/my-project$ npm install --save heapdump
```
<!-- .element: class="fragment" -->

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

<img src='/images/heapdump-example.png' style='width:100%'>

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

<p class='fragment'>
    But what we need is a profile _over time_!
</p>

---

<!-- .slide: data-background="white" -->

## StrongLoop Arc Smart CPU Profiler

![](/images/smart-profiler.png)

---

![fit](/images/arc-cpu-profile.png)

---

<!-- .slide: data-background="white" -->

[strongloop.com/get-started](https://strongloop.com/get-started)

![](/images/arc-landing.png)

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]() | ![{{contact}}]()

![{{url}}]()
