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

