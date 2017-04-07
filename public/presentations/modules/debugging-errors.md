<!-- .slide: data-background="black" -->

## Cryptic System Errors
<!-- .element: style="color:#fff" -->

<img src='/images/starbucks.jpg' alt='Starbucks cup' style='width:35%;'>

<cite style='bottom:0em;'>http://reversecultureshock.com/2009/09/29/storm-in-a-coffee-cup/</cite>

---

### Common System Errors

<ul>
    <li class='fragment'>
        <p>
            `EADDRINUSE` <span class='fine'>(address in use)</span><br>
            That port is already being listended on.
        </p>
        <p class='fragment'><em>Tip: Use `netstat -ln` to see ports in use!</em></p>
    </li>
    <li class='fragment'>
        `ECONNRESET` <span class='fine'>(connection reset)</span><br>
        Did you try to make an HTTP call out? It may have failed.
    </li>
    <li class='fragment'>
        `EACCES` <span class='fine'>(no access)</span><br>
        Whatever user your app runs under is missing some privileges.
    </li>
    <li class='fragment'>
        `ENOENT` <span class='fine'>(no entry)</span><br>
        Did you try to read a non-existent file? Maybe a config file?
    </li>
</ul>

---

### Handling Signal Interrupts and Terminations

```js
process.on('SIGINT', handleSignals);
process.on('SIGTERM', handleSignals);
```
<!-- .element: class="fragment" -->

```js
function handleSignals(err) {
    // log it out...
    console.error('Received signal:', err);
    
    server.close(function () {
        process.exit(187);
    });
}
```
<!-- .element: class="fragment" -->

Note that you CANNOT handle SIGKILL.
<!-- .element: class="fragment" -->

---

## What about your own errors?

_"I just bubble up whatever the framework gives me."_
<!-- .element: class="fragment" -->

<p class='fragment' style='color: #000; font-size:4em;'>ಠ_ಠ</p>

---

### Better `Error` Handling

```js
db.getRecords(req.query.filter, function handleRecords(err, results) {
  if (err) {
    return next(err);
    // What does this error say exactly??
    // Will you user understand it?!?
  }

  // ...
});
```

---

### Better `Error` Handling

```js 
db.getRecords(req.query.filter, function handleRecords(err, results) {
  if (err) {
    var dbErr = new Error('There was problem retrieving records!');
    dbErr.code = 510;
    dbErr.originalError = err;
    
    return next(dbErr);
  }
    
  // ...
});
```

---

### Even Better `Error` Handling

How about extending that base `Error` consctructor?

```js
db.getRecords(req.query.filter, function handleRecords(err, results) {
  if (err) {
    var dbErr = new DatabaseError('There was problem retrieving records!');
    dbErr.code = 510;
    dbErr.originalError = err;
    
    return next(dbErr);
  }
    
  // ...
});
```
<!-- .element: class="fragment" -->

---

### Errors in Express

```js
app.use(function badRequestHandler(err, req, res, next) {
    if (err.code === 400) {
        // ...
    } else {
        next(err);
    }
});
```

Add a "catchall" error handler!
<!-- .element: class="fragment" -->

```js
app.use(function catchallHandler(err, req, res, next) {
    // If we get here, HANDLE THE ERROR.
    
    // do NOT call next() ... (but you do have to include it above)
});
```
<!-- .element: class="fragment" -->

---

### Uncaught Errors

```js
process.on('uncaughtException', function caughtErrors(err) {
    
    logger.error(err);
    dbCleanup(); // or whatever else you need to do...
    
    // by catching this, our application won't stop!
    process.exit(187);
});
```

_But if I let my app exit, then my server will be down!_
<!-- .element: class="fragment" -->

<p class='fragment'>
    That's why we use a 
    <strong><a href="http://strong-pm.io">process manager</a></strong>.
</p>

---

### Exit Codes

**Caution:** A zero (`0`) exit code indicates success!!

Your "program" exit codes should be between 129 and 255
