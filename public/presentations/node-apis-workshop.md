
<!-- .slide: class="no-footer" -->

![](/images/StrongLoop.png)

# `{ "Node.js": "APIs" }`

![{{speaker}}]() | ![{{contact}}]()

---

<!-- .slide: data-background="white" -->

![fit](/images/StrongLoop_who.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/api-connector.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/micro-services.png)

---

## What is a REST API?

REpresentational State Transfer (REST) is an architectural pattern for developing network applications.
<!-- .element: class="fragment" -->

REST APIs build off this concept, organizing data into resources accessed via common HTTP verbs.
<!-- .element: class="fragment" -->

---

### HTTP Verbs

```no-highlight
GET
PUT
POST
DELETE
```

```no-highlight
PATCH
HEAD
OPTIONS
```
<!-- .element: class="fragment" -->

---

### HTTP Verbs and endpoints

```no-highlight
POST   /Resource    -- Create a "Resource"
GET    /Resource    -- list this type of record
GET    /Resource/13 -- retrieve record with id 13
PUT    /Resource/13 -- update record with id 13
DELETE /Resource/13 -- delete record with id 13
```

```no-highlight
GET    /Resource/13/groups -- retrieve groups attached to Resource 13
DELETE /Resource/13/groups -- delete groups associated w/ Resource 13
```
<!-- .element: class="fragment" -->

---

### HTTP Status Codes

* 2XX: for successfully processed requests
* 3XX: for redirections or cache information
<!-- .element: class="fragment" -->
* 4XX: for client-side errors
<!-- .element: class="fragment" -->
* 5XX: for server-side errors
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

![fit](/images/rest-roundup.png)

---

## Choosing a Framework

---

## Pattern #1: Convention

Express, Restify, Kraken

* No questions about "how to do it"
* Advanced features fit in easier
* Weaknesses
  * Can be Opinionated
  * Manual CRUD

---

## Pattern #2: Configuration

Hapi, LoopBack, Sails

* Lower learning curve
* Better documentation
* Weaknesses
  * Opinionated
  * Some Manual CRUD
  * Advanced functions can require more effort

---

## Pattern #3: Isomorphic

Meteor, flatiron, LoopBack

* Sharing of Code (Client & Server)
* Automatic endpoint generation & routing
* Weaknesses
  * High learning curve
  * Custom front-end code sometimes still required

---

## Pattern #4: ORM & MBaaS

LoopBack, Sails

* Model Driven Development
  * Multiple data sources
* Possible to have Isomorphic JS
* Automatic REST endpoint generation
  * Includes routing & CRUD
* Weaknesses
  * Non-data-backed APIs require effort
  * Can be opinionated, but not always

---

<p style="text-align:center;">
![](/images/loopback.png)
</p>

---

<!-- .slide: data-background="white" -->

![fit](/images/loopback-high-level.png)

---

<!-- .slide: data-background="white" -->

## Multiple Backend Connectors

![](/images/loopback-connector-list.png)

---

<!-- .slide: data-background="white" -->

# Let's build something!

---

## Scaffold a project

```no-highlight
~/my-project$ slc loopback

...
```

---

## Add a Datasource

```no-highlight
~/my-project$ slc loopback:datasource
```

Step 2: Add connection info in datasources.json
<!-- .element: class="fragment" -->

Step 3: Install the connector
<!-- .element: class="fragment" -->

---

## Build Models

```no-highlight
~/my-project$ slc loopback:model

...
```

---

## Create Relations

```no-highlight
~/my-project$ slc loopback:relation

...
```

---

## Add Access Control

```no-highlight
~/my-project$ slc loopback:acl
```

---

## Start Your API

```no-highlight
~/my-project$ node .
```

Now navigate to http://localhost:3000/api/MyModels
<!-- .element: class="fragment" -->

---

# Node DevOps

---

## Debugging

---

# node-inspector

### Chrome dev tools for Node!
<!-- .element: style="margin-top:2em" -->

---

## Using node-inspector

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

## Scaling

---

![fit](/images/event-loop.png)

---

### Vertical Scaling

<img src="images/vertial-scaling-strongloop.png" style="width:100%">

---

### The `cluster` module

```js
var http = require('http'),
    cluster = require('cluster');

if (cluster.isMaster) {
  
    for (var i = 0; i < numCPUCores; i++) {
        cluster.fork();
    };
  
} else {
    
    http
        .createServer(function(req, res) {
            // ...
        })
        .listen(8080, ...);
});
```

---

### Using a Process Manager

Easy clustering and scaling without altering application code

* [StrongLoop Process Manager (`strong-pm`)](https://github.com/strongloop/strong-pm)
* [PM2](https://github.com/Unitech/pm2)

[Comparison Chart](http://strong-pm.io/compare)
<!-- .element: class="fragment" -->

---

## Build and Deploy

---

### Build Your App with `slc`

```no-highlight
~/my-app$ slc build
...
~/my-app$ ls ../
... ...  my-app-0.1.0.tgz
```

---

### Deploy to Strong PM

From our development machine (or staging, etc)...

```no-highlight
~/my-app$ slc deploy http+ssh://myserver.com:8701
```

Don't forget to install strong-pm on that machine and start it!
<!-- .element: class="fragment" -->

---

### Horizontal Scaling

![fit](images/horizontal-scaling.png)

---

# Monitoring and Profling

---

## Available Metrics

* CPU Load (system)
* Heap Memory sage
* Event Loop Count
* Event Loop Tick Timing
* HTTP Connections
* Database Connections (Oracle, MySQL, Mongo, Postgres)
* Misc other modules (Redis, Memcache(d), Message queues)

---

### What do I look for?

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

## Profiling

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

## Arc provides a "Smart CPU Profiler"

![](/images/smart-profiler.png)

---

## Deep Transactin Tracing

Analyze performance of your application from a high level down to the function level.

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

<!-- .slide: data-background="white" -->

![fit](/images/node-hyperscale.png)

---

<!-- .slide: class="no-footer" -->

# Thank You!

## `{ "Node.js": "APIs" }`

![{{speaker}}]() | ![{{contact}}]()

![{{url}}]()
