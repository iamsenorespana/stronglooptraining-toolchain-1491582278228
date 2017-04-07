
## Debug Console

---

### The Built-In Debugger

```bash
~$ node debug server.js
```

```no-highlight
< Debugger listening on port 5858
debug> . ok
break in server.js:1
> 1 'use strict';
  2
  3 var http = require('http'),
debug> 
```
<!-- .element: class="fragment" -->

---

### The Built-In Debugger

```no-highlight
break in server.js:1
> 1 'use strict';
  2
  3 var http = require('http'),
debug> n
```

```no-highlight
break in server.js:3
  2
> 3 var http = require('http'),
  4     fs = require('fs'),
debug> 
```
<!-- .element: class="fragment" -->

---

### The Built-In Debugger

Use commands to move forward:

* `c` => continue with code execution
* `n` => execute this line and go to next line
* `s` => step into this function
* `o` => finish function execution and step out

---

### Debug REPL

While stepping through code, type `repl`:

```no-highlight
  1 var x = 10;
> 2 x = 5;
debug> repl
Press Ctrl + C to leave debug repl
> x
x = 10
>
```

---

## node-inspector

_Chrome dev tools for Node!_
<!-- .element: class="fragment" style="display:block; margin-top:2em;" -->

---

### Using node-inspector

```bash
~$ npm install -g node-inspector
```

```bash
~$ node-debug server.js
```
<!-- .element: class="fragment" -->

Now head over to Chrome, the page should already be up!
<!-- .element: class="fragment" -->
