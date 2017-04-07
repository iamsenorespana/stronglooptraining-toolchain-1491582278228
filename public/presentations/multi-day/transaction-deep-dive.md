# Transaction Tracing Example:<br><br>Denial of Service

---

## Transaction Tracing

Tracks function entry, exit, and **CPU time**

^
- time each function takes
- records position of each function call in source
- Also record timing for HTTP(s) and DB operations

**How?**
- wraps all functions in app, deps, and all HTTP(S) & DB ops

---

## A DoS Example

^ We’ll use an example and demonstrate how to** analyze the tracing data** and **drill down to the specific source code line** of the vulnerability exploited by the simulated DoS attack.

---

### The Application

1. → numeric route parameter
2. query DB with that parameter
3. ← JSON

^ Express app with one route

---

### The Problem

"...service responds slowly..."

"...app servers' CPU usage spikes intermittently..."

---

### Cursory Investigation

* input paramater > 0 works
* input parameter ≤ 0 generates large CPU load

---

### The Code

```js
var app = express();

app.get("/:sqlparam", function(req, res){
  var sqlparam = decodeURIComponent(req.params.sqlparam);
  dbAccess(res, sqlparam);
});
//...
```

^ 1 route, 1 parameter

---

### The Code

```js
//...
function dbAccess(res, param) {
  var query = "SELECT "+param.toString()+" as PARAM, dummy from dual";
  oracle_DB.execute(query, [],
    function(err, result) {
      if (!err) {
        if ( result[0].PARAM <= 0 ) generateCpuLoad();
      }
      res.end((Date()).toString() + " " + JSON.stringify(result));
    });
}
```

^
- The cause of the issue is located here in the code...
- **...but we don't know this yet**

How do we find it?

---

## A typical sequence

^ To recognize anomalies, you must be familiar with normal/baseline
application behavior.

let's look at that now

---

### Timeline View
![timeline view](/images/tracing-timeline-annotated.png)  

  1. CPU & Memory
<!-- .element: class="fragment" data-fragment-index="1" -->
  2. Datapoints count
<!-- .element: class="fragment" data-fragment-index="2" -->
  3. Usage spikes
<!-- .element: class="fragment" data-fragment-index="3" -->

^ 

- Blue: CPU *cross-process average*
- Orange: Heap *per process*
- datapoints: Green bars count seconds 'til next snapshot
- Orange ▲ = 3 sigma spike in usage ** These are where you should start looking**
- *3 sigma = 3 standard deviations*

---

### Trace Sequences View

![tracing4](/images/tracing-sequences-annotated.png)

^ Click a point on the graph to see sequences for that "time slice"

img shows the cursor at Sun. June 21st 2015, 6:45:17 AM

---

### Trace Sequences View

Two kinds of trace sequences:

*   HTTP(S)
*   Database

^ 
HTTP transactions:
- `serve` is the **typical** HTTP action your server application will perform;
- `request` actions means the **server** is performing an HTTP request to a 3rd
party

---

### Trace Sequences View

![tracing4](/images/tracing-sequences-annotated.png)

^ green circles: # function call patterns associated with a
sequence.

Note async time (db,http, external threads/outside your app code) vs.
sync time (JS *in* your application). *Sync time should be low!*

**Let’s click ‘Oracle SELECT 1’ trace sequence...**

---

### Sequence Detail

![flame chart overview](/images/tracing-flame-graph-annotated.png)

^ 

1. "http#OutgoingMessage.prototype.end and 59 functions" # of fns called
2. next/prev call pattern
3. total time in each (a)sync block (flame graph is sync with async collapsed).
4. Details from hovering waterfall block (see underlined bits: **#dbAccess**).

---

### Flame Charts
CPU profile visualization
* shows function call stack
<!-- .element: class="fragment" -->
* bottom up
<!-- .element: class="fragment" -->
* execution time expressed as width
<!-- .element: class="fragment" -->

---

### Flame charts
Call stack

```no-highlight
root
|
├─a
| └─b
|   ├─c
|   | └─d
|   |   └─e
|   |     └─f
|   └─...
└─g
  ├─b
  | └─...
  └─...
```

^ 
- `a` calls `b`, (b executes in the scope of a)
- `b` calls `c` plus one other function
- down to `f`
- `g` is part of a separate call tree
- it also calls `b` but **that's a different call**

---

### Flame charts

<div data-svg-fragment="/images/flamechart_with_labels.svg#[*|label=bars]">
  <a class="fragment" title="[*|label=y_label]"></a>
  <a class="fragment" title="[*|label=x_label]"></a>
  <a class="fragment" title="[*|label=exec_time]"></a>
</div>

^ 
- Y = stack depth
- X = CPU time
- the top of the bars represent time actually on CPU

Color is used in Arc (and elsewhere) to delineate *platform/native* code, *framework* code, and *your* code

---

### Flame charts
Execution time

```no-highlight
root 376ms
|
├─a 280ms
| └─b 228ms
|   ├─c 209ms
|   | └─d 208ms 
|   |   └─e 208ms
|   |     └─f 208ms
|   └─... 27ms
└─g 96ms
  ├─b 49ms
  | └─... 32ms
  └─... 27ms
```

---

### Flame charts
Execution time

<div data-svg-fragment="/images/flamechart_cpu_times.svg#[*|label=bars]">
  <a class="fragment" title="[*|label=ms_280]"></a>
  <a class="fragment" title="[*|label=ms_96]"></a>
  <a class="fragment" title="[*|label=ms_208]"></a>
</div>

^ *→Now let's look at a real flame chart...*

---

### Synchronous Flame Graph

![flame chart bottom detail](/images/tracing-flame-graph-lower-annotated.png)

^ 
- one block per fn call
- async bit (between flames) **collapsed**, **sync only**
- Locate the **specific line** in source
- usually 2 sync blocks for req → db → res:
  1. get request, pass to db
  2. get db reply, send to client
- this chart: **normal behavior**

---

## Analyzing anomalies

Back to our DoS example...

^ To review our application behavior...

Our **internal** database API:
- Take user id **→** return record
- If id is 0 **→** return all records<br>(**undocumented** REST endpoint)

Let's take a look at the tracing views

---

### Start with an anomalous time slice

![tracing7](/images/tracing-anomoly-overview-annotated.png)

^ Click orange arrow (3-sigma). Crude metric but good starting point.

**3 sequences with 92% Sync**.

normally **async (http/db)** CPU time >>> **sync (app)** CPU time

**Why is that much time spent in those 3 sequences?**

Let's select `Oracle SELECT` sequence...

---

### Function call pattern of anomalous behavior

![flame chart with 99% of time spent in callback](/images/tracing-anomolous-flamechart-annotated.png)

^ Flame iv very different from baseline:
- click waterfall: 99% of time spent in **sync** code, specifically the **generateCpuLoad**
- flame chart has two portions, most is in callback portion. Alarms should
  be going off!

---

### Pinpointing the source

![tracing9](/images/tracing-anomoly-finding-source.png)

^ hover over top fn in flame:
- fn name, filename, line number of offending call identified
- line 18: `generateCpuLoad()` ← the culprit
- *note also the **wide** purple bar in waterfall: not normal*

---

### Back to the source

```js
function dbAccess(res, param) {
  var query = "SELECT "+param.toString()+" as PARAM, dummy from dual";
  oracle_DB.execute(query, [],
    function(err, result) {
      if (!err) {
        if ( result[0].PARAM <= 0 ) generateCpuLoad(); /// line 18
      }
      res.end((Date()).toString() + " " + JSON.stringify(result));
    });
}
```
^
- Q: What's wrong?
  - A: Input not sanitized!
- `param=0`: process **all** records
- Enough such requests prevent timely response
- Someone found this & exploited it
- *We're lucky DoS is the only thing someone did: SQLI would be easy :)*

---

### Function call pattern visualization raw data

<div style="height:18em; width:100%; background-position:50%; background-image: url(/images/tracing-anomoly-raw-data-annotated.png); background-repeat: no-repeat; background-size: contain;"></div>
<!-- there may be a better way to do this... -->

^
- flame graph and the raw data form show the same information.
- deep stack for dbAccess, shallow for callback

**Compare to flame graph (next slide)**

---

### Flame chart visualizes time used

![flame chart with dbAccess and Callback portions noted](/images/tracing-anomoly-flame-chart-comparison-annotated.png)

^ 
- flame looks very different:
- each brick width is **proportional to the time spent in that function.**

*flip back to prev. slide for comparison*

---

## Performance Impact

10~15%.

^
Generally speaking, the overhead incurred by tracing for a computation-intensive application is 10-15%

"The average and standard-deviation of `dbAccess()` function execution time over 100 measurements were 75.97 msec/0.88 msec with tracing enabled. With tracing disabled, they were 74.90 msec/1.10 msec."

---

## Conclusion

Tracing allows you to...

* detect anomalous behaviors
<!-- .element: class="fragment" data-fragment-index="1" -->
* analyze the root cause
<!-- .element: class="fragment" data-fragment-index="2" -->
* locate the cause in your code
<!-- .element: class="fragment" data-fragment-index="3" -->

---

# fin

Blog post: <http://bit.ly/arc-tracing>