
![](/images/StrongLoop.png)

# Monitor and Profile Node.js

---

## Quick Start: Development

```no-highlight
~$ cd my-app
~/my-app$ slc arc
Loading workspace /full/path/to/my-app
StrongLoop Arc is running here: http://localhost:37786/#/
```

(A browser window should open automatically)

^ port is generated, yours may/will be different

---

<!-- .slide: data-background="white" -->

![](/images/arc-landing.png)

---

<!-- .slide: data-background="white" -->

### Start the App in Arc

![](/images/arc-app-controller.png)


^ 
**starting app on strong supervisor:**

tl;dr: only do one of these at a time. **don't start strong pm & deploy then
press the start button!!** 
1. "Just for dev" ways:
  1. `slc arc` + start button (shown here)
  2. `slc start`
2. "deploy to a proper strong-pm" ways
  1. deploy (starts on deploy)
  2. `arc/process-manager` (actions>start OR activate button)
  3. `slc ctl` `start`, `stop` etc.

---

### Generate Some Load

Without load on our system we won't see anything terribly exciting.

Here is a simple Node script to hit your API:

<http://bit.ly/node-load>

^ To use script as-is you need:
1. `CoffeeShops` Read endpoints
1. `Review` Read endpoints
1. App running on port `3000` on `localhost`

(all of this is changeable of course)

---

<!-- .slide: data-background="white" -->

### Viewing Metrics

![](/images/arc-metrics.png)

---

### Available Metrics

* CPU Load (system)
* Heap Memory Usage
* Event Loop Count
* Event Loop Tick Timing
* HTTP Connections
* Database Connections (Oracle, MySQL, Mongo, Postgres)
* Misc other modules (Redis, Memcache(d), Message queues)

---

<!-- .slide: data-background="white" -->

### What do I look for?

![](/images/heap-problem.png)

^ Note the consistent increase in memory usage without dropping (GC)

---

### What do I look for?

**CPU Usage** is pretty obvious, just watch your high points!

With **Heap Memory Usage** you want to see a "sawtooth" chart, each drop indicates garbage collection. No drop is bad!

![](/images/arc-heap-normal.png)

^ This is a **good** heap chart

**Other metrics:**
- Loop Count: a drop in loop count indicates less ticks (bad)
- Loop timing: bad if it goes up, that means something is blocking the loop
- CPU and HTTP usage is obvious: higher == worse

---

### What do I look for?

The two **Event Loop** metrics are opposed. You want the loop count to remain high under normal load (more ticks per metrics cycle is good). Any dips may be bad.

The **Loop** timing, on the other hand, indicates how long event loop ticks are taking. Any spikes here are bad!

^ metrics cycle = 15 seconds

"**Loop** timing" just called "Loop" in the UI

---

## Production Setup

If you're running your application under [`strong-pm`](https://strong-pm.io/)  
you can already see metrics!

However, these are runtime only (in Arc).

To collect and store metrics, we need to tell PM where to send them!

---

### Setup Metrics Collection

On our production machine, with `strong-pm` installed,  
simply set the collection location:

```no-highlight
~$ export STRONGLOOP_METRICS="log:/path/to/api-metrics.log"

~$ export STRONGLOOP_METRICS="syslog"

~$ export STRONGLOOP_METRICS="statsd://my-log-server.com:1234"

~$ export STRONGLOOP_METRICS="graphite://my-log-server.com:1234"

~$ export STRONGLOOP_METRICS="splunk://my-log-server.com:1234"
```

^ Note that "syslog" application defaults to statsd

---

### Setup Metrics Collection

Alternatively, on the production machine you can run:

```no-highlight
~$ sl-pm-install --metrics <url>
```

Or during runtime:

```no-highlight
~$ slc ctl env-set my-app STRONGLOOP_METRICS=<url>
```

---

### Metrics Collection

If you plan to analyze the metrics yourself, it is helpful to know the format of the data.

For a simple file, the format is:

```no-highlight
[date] [service].[host].[worker].[metric]=[value] ([type])
```

<div class="fragment">
    <p>For example:</p>

    <pre><code class='no-highlight'>2015-09-10T15:51:03.000Z my-app.foobar.3.heap.used=34992956 (gauge)
2015-09-10T15:51:03.000Z my-app.foobar.3.heap.total=60477434 (gauge)
2015-09-10T15:51:03.000Z my-app.foobar.3.loop.count=127 (count)</code></pre>
</div>

---

## Smart Profiling

How can we get CPU profile data *when an issue occurs*?

"Smart profiling" triggers CPU profiling when the event loop is blocked longer
than it should be.

```no-highlight
~$ slc ctl cpu-start 1.1.49408 20
```

1. Monitors a specific worker (`1.1.49408`)
1. Event loop blocked for more than 20ms, start CPU profile
1. Stop profiling once event loop resumes

^ without last argument, `cpu-start` starts profiling immediately 'til you tell
it to stop

---

### Finding the Worker ID

```no-highlight
~$ slc ctl status
Service ID: 1
Service Name: my-app
Environment variables:
  No environment variables defined
Instances:
    Version  Agent version  Cluster size  Driver metadata
     5.0.0       2.0.1            4             N/A
Processes:
        ID      PID   WID  Listening Ports  Tracking objects?  CPU profiling?
    1.1.49401  49401   0
    1.1.49408  49408   1     0.0.0.0:3001
    1.1.49409  49409   2     0.0.0.0:3001
    1.1.49410  49410   3     0.0.0.0:3001
    1.1.49411  49411   4     0.0.0.0:3001
```

---

## Instrumenting Custom Metrics

You can define custom metrics and then "patch" them dynamically into a running Node application.

These metrics can then be collected and viewed using a third party tool (graphite, splunk, etc).

---

### Types of Custom Metrics

* **Counts**: Incremented and decremented, require no context
* **Timers**: Started and stopped, require a unique context

---

### Patching Custom Metrics

Inject custom metrics with the command:

```no-highlight
~$ slc ctl patch <worker> <file>
```

* `<worker>` identifies the worker
  * `<service_id>.1.<worker_id>` or
  * `<service_id>.1.<process_id>`
* `<file>` is the patch file defining the custom metrics

---

### Patch Files

A single application can use multiple patches, and patch as many files as you want.  You can patch the same file repeatedly.

```js
//pseudocode//
{
  FILESPEC: [            // regex to identify JS file in app
    {
      type: TYPE,        // increment, decrement, timer-start/stop
      line: LINE,        // of the filespec match
      metric: METRIC,    // dot-separated metric name
      [context: CONTEXT] // if required (timers)
    }
  ]
}
```

---

### Patch Example

Assume the following code in `server/app.js`:

```js
var http = require('http');

http.createServer(request).listen(process.env.PORT || 3000);

function request(req, res) {
    setTimeout(function() {     // line 6
        res.end('OK\n');        // line 7
    }, Math.random() > 0.1 ? 10 : 100);
}
```

---

### Patch Example

* Keep count of concurrent requests
* Time each request

The patch:

```js
{
  "server\\/app\\.js$": [
    { "type": "increment", "line": 6, "metric": "get.delay" },
    { "type": "decrement", "line": 7, "metric": "get.delay" },
    { "type": "timer-start", "line": 6, "metric": "get.delay", "context": "res" },
    { "type": "timer-stop", "line": 7, "metric": "get.delay", "context": "res" }
  ]
}
```

---

### Patch Example

The resulting patched code might look similar to this:

```js
var http = require('http');

http.createServer(request).listen(process.env.PORT || 3000);

function request(req, res) {
  res.___timer = start('get.delay');increment('get.delay'); setTimeout(function() {
  res.___timer.stop();decrement('get.delay'); res.end('OK\n');
  }, Math.random() > 0.1 ? 10 : 100);
}
```

---

### Patch Notes

* Patches must by valid when inserted at the beginning of the specified line.
* Patches can be cumulative, and previous patches don't change the line numbering of the file.
* The context is used to store a timer on start, that can be accessed on stop.
* Duplicate stops as well as non-existence of a timer are ignored.
* Metrics can have the same name, since the type is appended.

^
this would be bad:

`function()`<br>
`res.___timer = start('some.timer');{`

or

`var coords = {`<br>
`increment('my.inc')  x : 10,`

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

```no-highlight
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

---

### Heap Snapshots by CLI

With the `heapdump` package, the Node.js process listens for the `USR2` signal and will take a snapshot when it's received:

```no-highlight
~$ kill -USR2 <pid>
```

These are written to the current working directory (as with the previous example).

^ `kill` basically means 'send process the following signal' (usually kill
signals)

---

### Memory Monitoring

**Caution: Taking a heap snapshot is not trivial on resources.**

If you already have a memory problem, this could kill your process!

_Unfortunately, sometimes you have no alternative._
<!-- .element: class="fragment" -->

---

## Transaction Tracing

Analyze performance of your application from a high level down to the function level.

---

<!-- .slide: data-background="white" -->

### Resource Consumption Timeline

![](/images/tracing-initial.png)

---

### Anomaly Inspection

See something off?  
Click on that point in the resource usage chart.

(The orange triangles at the bottom identify anomalies beyond three-sigma deviations.)

---

<!-- .slide: data-background="white" -->

### View Trace Sequences

![](/images/tracing-sequences.png)

^ Discuss count of sequences on the left, sync vs async time on the right

---

<!-- .slide: data-background="white" -->

### Tracing Waterfall

![](/images/tracing-waterfall.png)

By clicking on the "sync" line we can inspect the costs of the synchronous code.

---

<!-- .slide: data-background="white" -->

### Flame Charts

![](/images/tracing-flame.png)

^ This is what a normal one looks like

---

### Flame Charts

The flame chart identifies each function in the call stack, organized in color by module.

The width of the bar represents the total resource consumption for that function _and all of its function calls_.

Clicking on a function shows that functions resource usage.

^ Don't read this to them! Show them the demo app.

**Uninstrumented JavaScript** : this just means "code/libs strongloop hasn't mapped out so
tracer can recognize & name them", not that your code is broken or slow.

---

### Looking for more?

Check out our blog post on Transaction Tracing and identifying a DoS attack!

<http://bit.ly/arc-tracing>

---

# fin
