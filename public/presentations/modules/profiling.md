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
