## Why Node.js?

* Node is fast.
<!-- .element: class="fragment" -->
  * Non-blocking I/O
<!-- .element: class="fragment" -->
  * JavaScript arms race (V8)
<!-- .element: class="fragment" -->
* One language to rule them all
<!-- .element: class="fragment" -->
* Solid Standard (ECMAScript)
<!-- .element: class="fragment" -->
* Vibrant Ecosystem (npm)
<!-- .element: class="fragment" -->

---

### Caveats

* Have to think in async
<!-- .element: class="fragment" -->
  * Callback Hell
<!-- .element: class="fragment" -->
* Frameworks and tools may not be as mature (yet)
<!-- .element: class="fragment" -->
* JavaScript "quirks"
<!-- .element: class="fragment" -->

---

### Node is Single-Threaded

_(But that's ok...)_

---

<!-- .slide: data-background="white" -->

![fit](/images/threaded.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/event-loop.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/Node_not_just_hipsters.png)

---

# What is Node?

### Node is not JavaScript exactly...
<!-- .element: class="fragment" -->

"JavaScript" is a trademarked term!
<!-- .element: class="fragment" -->

---

## Node is ECMAScript

### So what is ECMAScript?
<!-- .element: class="fragment" -->

---

### ECMAScript is a Language Specification...

...with various implementations:
* Chrome's **V8**
* Mozilla's **SpiderMonkey** (properly "JavaScript")
* Microsoft's **Chakra** (or **JScript** before IE10)
* Adobe's **Tamarin** (ActionScript)
* **Rhino** (an early server-side implenentation - in Java)

---

### The Node Core

* V8: The engine
* LibUv: Event loop and asynchronous I/O
<!-- .element: class="fragment" -->
* A standard library
<!-- .element: class="fragment" -->

^It's written originally for *nix systems. Libev provides a simple yet optimized event loop for the process to run on. You can read more about libev here.  
It handles file descriptors, data handlers, sockets etc. You can read more about it here here.  
LibUv performs, mantains and manages all the io and events in the event pool. ( in case of libeio threadpool ). You should check out Ryan Dahl's tutorial on libUv. That will start making more sense to you about how libUv works itself and then you will understand how node.js works on the top of libuv and v8.

---

![fit](/images/Node-Architecture.png)
