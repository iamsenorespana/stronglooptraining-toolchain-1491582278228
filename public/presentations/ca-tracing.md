
![](/images/StrongLoop.png)

# Transaction Tracing & Root Cause Analysis with StrongLoop Arc

![{{speaker}}]()

---

## Step One

The first step in monitoring, profiling, and tracing your Node 
application is to run it in a process manager!

---

### Build Your App with `slc`

```
~$ npm install -g strongloop
```

```
~/my-app$ slc build
...
~/my-app$ ls
... ...  my-app-0.1.0.tgz
```

---

### Install and run Strong PM

On your deployment machine...

```
~$ npm install -g strong-pm
~$ sl-pm-install
```

---

### Deploy to Strong PM

From our development machine (or staging, etc)...

```
~/my-app$ slc deploy http+ssh://myserver.com:8701
```

---

### Running Locally

If you need to profile things locally (your machine or a staging/testing server), run `slc start` from your app directory:

```
~/my-app$ slc start
Process Manager is attempting to run app `.`.

  To confirm it is started: slc ctl status tracing-example-app
  To view the last logs: slc ctl log-dump tracing-example-app
  ...
```

Then start the Arc UI:

```
~/my-app$ slc arc
```

---

<!-- .slide: data-background="white" -->

![](/images/arc-landing.png)

---

# Metrics and Monitoring

---

<!-- .slide: data-background="white" -->

## Viewing Metrics

![](/images/arc-metrics.png)

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

### What do I look for?

**CPU Usage** is pretty obvious, just watach your high points!

With **Heap Memory Usage** you want to see a "sawtooth" chart, each drop indicates garbage collection. No drop is bad!

![](/images/arc-heap-normal.png)

^ This is a **good** heap chart

---

<!-- .slide: data-background="white" -->

### What do I look for?

![](/images/heap-problem.png)

^ Note the consistent increase in memory usage without dropping (GC)
The Loop Count here is fine, a drop in loop count indicates less ticks (bad)
The Loop timing is bad if it goes up, that means something is blocking the loop
CPU and HTTP usage is obvious: higher == worse

---

### What do I look for?

The two **Event Loop** metrics are opposed. You want the loop count to remain high under normal load (more ticks per metrics cycle is good). Any dips may be bad.

The **Loop** timing, on the other hand, indicates how long event loop ticks are taking. Any spikes here are bad!

---

## Setup Metrics Collection

On our **production** machine, with `strong-pm` installed,  
simply set the collection location:

```
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

```
~$ sl-pm-install --metrics <url>
```

Or during runtime:

```
~$ slc ctl env-set my-app STRONGLOOP_METRICS=<url>
```

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
var THRESHOLD = 500;

setInterval(function () {
    var memMB = process.memoryUsage().rss / 1048576;
    if (memMB > THRESHOLD) {
        process.chdir('/path/to/writeable/dir');
        heapdump.writeSnapshot();
    }
}, 60000 * 5);
```

---

### Memory Monitoring

**Caution: Taking a heap snapshot is not trivial on resources.**

If you already have a memory problem, this could kill your process!

_Unfortunately sometimes you have no alternative._
<!-- .element: class="fragment" -->

---

## Smart Profiling

How can we using the monitoring to profile?

"smart profiling" based on event loop blockage

```
~$ slc ctl cpu-start 1.1.49408 20
```

1. Monitors a specific worker (`1.1.49408`)
1. Event loop blocked for more than 20ms, start CPU profile
1. Stop profiling once event loop resumes

---

### Finding the Worker ID

```
~$ slc ctl status
Service ID: 1
Service Name: my-app
Environment variables:
  No environment variables defined
Instances:
    Version  Agent version  Cluster size
     4.1.0       1.5.1            4
Processes:
        ID      PID   WID  Listening Ports  Tracking objects?  CPU profiling?
    1.1.49401  49401   0
    1.1.49408  49408   1     0.0.0.0:3001
    1.1.49409  49409   2     0.0.0.0:3001
    1.1.49410  49410   3     0.0.0.0:3001
    1.1.49411  49411   4     0.0.0.0:3001
```

---

# Transaction Tracing

---

## Deep Transactin Tracing

Analyze performance of your application from a high level down to the function level.

^ Use the demo app: http://baron.strongloop.com:49503

---

<!-- .slide: data-background="white" -->

### Resource Consumption Timeline

![](/images/tracing-initial.png)

---

### Anomoly Inspection

See something off?  
Click on that point in the resource usage chart.

(The orange triangles at the bottom identify anomolies betond three-sigma deviations.)

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

---

### Flame Charts

The flame chart identifies each function in the call stack, organized in color by module.

The size of the bar represents the total resource consumption for that function _and all of its function calls_.

Clicking on a function shows that functions resource usage.

^ Don't read this to them! Show them the demo app.

---

### Looking for more?

Check out our blog post on Transaction Tracing and identifying a DoS attack!

<http://bit.ly/arc-tracing>

---

# Thank You!

### Questions?

<br style='margin-top:1.5em'>

![{{speaker}}]()

Join us for more events!  
[strongloop.com/developers/events](https://strongloop.com/developers/events/)
