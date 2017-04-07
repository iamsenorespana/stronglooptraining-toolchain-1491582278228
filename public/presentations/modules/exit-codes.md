### Operating System Termination

What if the operating system kills your process?  

```js
function gracefulShutdown(err) {
    
    logger.error(err);
    dbCleanup();  // or whatever else you need to do...
    
    // by catching this, our application won't stop!
    process.exit(187);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

---

### Exit Codes

**Caution:** A zero (`0`) exit code indicates success!!

Your "program" exit codes should be between 129 and 255

---

## Okay, we have an error...

_How do we debug it?_
<!-- .element: class="fragment" -->

