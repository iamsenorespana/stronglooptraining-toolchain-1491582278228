
![](/images/StrongLoop.png)

# Sync vs Async

---

## Synchronous

Synchronous code executes in sequence

```js
function createObjects() {
    var o;
    for (var i=0; i<10000; ++i) { o = new Object(); }
    console.log('done creating objects');
}

createObjects();
console.log('this is the end');
```

```no-highlight
$ node main.js
done creating objects
this is the end
```
<!-- .element: class="fragment" -->

---

## Asynchronous

```js
function addRecords(cb) {
    db.insert([ ... ], function(err, records) {
        
        cb(records);
        
    });
}

addRecords(function(records) {
    console.log('done creating records', records);
});
console.log('this is the end');
```

```no-highlight
$ node main.js
this is the end
done creating records
```
<!-- .element: class="fragment" -->

---

![fit](/images/event-loop.png)

---

## Node-style Callbacks

Callbacks should be **the last argument** to an async function and use **error-first** convention:

```js
var fs = require('fs');

fs.readFile('foo/bar.json', function readCallback(err, results) {
    
    if (err) {
        // handle it
        return;
    }
    
    // handle results
});
```

---

## Maintaining Asynchronicity 

---

### Callback !== Asynchronous

```js
function doStuff(id, cb) {
    if (!Number(id) || id < 0) {
        cb(new Error('The "id" must be a positive integer!'));
        return;
    }
    
    db.User.findById(id, function(err, user) {
        cb(null, user);
    });
}
```

---

### Making Things Asyncronous

```js
function doStuff(id, cb) {
    if (!Number(id) || id < 0) {
        
        process.nextTick(function() {
            cb(new Error('The "id" must be a positive integer!'));
        });
        return;
        
    }
    
    db.User.findById(id, function(err, user) {
        cb(null, user);
    });
}
```

---

# Async Management

---

## Callbacks

All asynchronous actions require a callback.

No library or framework can avoid that (yet).
<!-- .element: class="fragment" -->

---

### Simple Callback

```js
function getUsers(cb) {
    db.User.find({ company: "StrongLoop" }, function(err, results) {
        var users = [];
        
        if (err) {
            return cb(err);
        }
        
        // process results...
        
        cb(null, users);
    });
}
```

---

### Error-first Pattern

Callbacks should always provide an error object as their first argument

```js
db.User.findById(42, function handleData(err, results) {
    if (err) {
        // handle it!
        return;
    }
    
    // continue processing...
}
```

^ this is more "law" than convention; violating it will cause flow-control libs
to not function properly with your code and will confuse developers

---

### Callback Hell

```js
function getUserDetails(id, cb) {
    db.User.findById(id, function(err, user) {
        if (err) { return cb(err); }
        
        db.Group.findById(user.group, function(err, group) {
            if (err) { return cb(err); }
            
            doGroupAuth(group, user, function(err, authorized) {
                if (err) { return cb(err); }
                
                cb(null, user);
            });
        });
    });
}
```

---

### Fighting Callback Hell

* Named, separate functions (versus anonymous, inline)
* Modularize
* Use Events Emitters
* Use a flow-control library ([async](https://github.com/caolan/async), [bluebird](https://github.com/petkaantonov/bluebird), [q](https://github.com/kriskowal/q))
* Promises

---

## Event Emitters

An `EventEmitter` is an object that triggers events to which anyone can listen.

<https://nodejs.org/api/events.html>

In Node an event can be described simply as a string with a corresponding callback.

---

### Event Emitters

* Event handling in Node uses the observer pattern
* An event, or subject, keeps track of all functions that are associated with it
* These associated functions, known as observers, are executed when the given event is triggered

_Note: Observer functions are frequently referred to as "listeners" or "handlers."_

---

### Using Event Emitters

```js
var events  = require('events');
var emitter = new events.EventEmitter();

emitter.on('knock', function() {
    console.log("Who's there?");
});

emitter.on('knock', function() {
    console.log("Go away!");
});

emitter.emit('knock');
```

^ v4 exposes `EventEmitter` directly on `events.module.exports` as well as
`exports.EventEmitter`

---

### Inheriting from EventEmitter

```js
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Job = function Job() {
    this.process = function() {
        // ...
        this.emit('done', { completedOn: new Date() });
    }
    EventEmitter.call(this);
};

util.inherits(Job, EventEmitter);
module.exports = Job;
```

```js
var job = new Job();

job.on('done', function(details){
  console.log('Job was completed at', details.completedOn);
  job.removeAllListeners();
});

job.process();
```

---

### Listeners

```js
emitter.listeners(eventName);

emitter.on(eventName, listener);

emitter.once(eventName, listener);

emitter.removeListener(eventName, listener);
```

---

## Promises

Native vs library ([q](https://github.com/kriskowal/q), [bluebird](https://github.com/petkaantonov/bluebird))

---

### Native Promises

```js
var p = new Promise(function(resolve, reject) {
    someAsyncOperation(function(err, result){
      
      if (err) {
          return reject(new Error('foobar'));
      }
      
      resolve(result);

    })
});

p.then(
    function(result) {
        console.log(result);
    },
    function(err) {
        console.error(err.message);
    }
);
```

^ **"wrapping"** async operation in a promise

---

### Promises with Q

```js
var Q = require('q'),
    fs = require('fs');

function doRead() {
    var deferred = Q.defer();
    
    fs.readFile('data.json', function (err, data) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(data);
        }
    });
    
    return deferred.promise;
}

doRead.then( ... );
```

^ `doRead` *immediately* returns a promise

---

#### De-Nodeifying

```js
var readFile = Q.denodeify(fs.readFile);

readFile('some-data.json')
    .then(
        function(result) {
            console.log(result);
        },
        function(err) {
            console.error(err.message);
        }
    );
```

---

#### Chaining Promises

```js
readFile('data.json')
    .then(
        function(result) {
            return readFile('other-data.json');
        },
        function(err) {
            console.error(err.message);
        }
    )
    .then(
        function(result) {
            console.log('results of read #2:', result);
        },
        function(err) { /* ... */ }
    );
```

---

#### Chaining Promises

```js
readFile('data.json')
    .then( function(result) {
        return readFile('other-data.json');
    } )
    .then( function(result) {
        // return some promise...
        return readFile('more-data.json');
    } )
    .then( function(result) {
        // handle the data
        // no need to return a promise at the end.
    } )
    .catch(function(err) {
        console.error(err.message);
    });
```

^ return non-promise from then(fn{}) & lib will wrap it as a promise automatically

---

#### Promising All

```js
Q.all([
    
    readFile('data.json'),
    readFile('other-data.json')
    
]).then(
    function(results) {
        // ...
    },
    function(err) {
        // ...
    }
);
```

---

## Async Library

```bash
~/my-project$ npm install async --save
```

```js
var async = require('async');
```

---

### Flow Control

Use flow control to prevent descent into a pyramid of callbacks that will make your code unreadable!

```js
async.series(
  [
    function foo(nextCb) {
      // do stuff...
      
      nextCb(null, 'foo');
    },

    function bar(nextCb) { nextCb(null, 'bar'); },

    function bat(nextCb) { nextCb( new Error('dang') ); },

    function baz(nextCb) { /* will not run */ }
  ],
  function allDone(err, results) { /* ... */ }
);
```

^Each one runs AFTER the previous completes.

---

#### Running in parallel

```js
async.parallel(
  [
    function foo(doneCb) { doneCb(null, 'foo'); },

    function bar(doneCb) { doneCb(null, 'bar'); },

    function bat(doneCb) { doneCb( new Error('dang') ); },

    function baz(doneCb) { /* will still run */ }
  ],
  function allDone(err, results) { /* ... */ }
);
```

^Each one runs immediately, but the final callback waits for all to finish

---

#### Waterfall

```js
async.waterfall(
[
  function(next){
    // do some processing...
    
    next(null, 'one', 'two');
  },
  function(arg1, arg2, next){
    // arg1 == 'one'; arg2 == 'two'
    
    next(null, 'three');
  },
  function(arg1, next){
    // arg1 == 'three'
    
    next(null, 'done');
  }
], function (err, result) {
  // result now equals 'done'
});
```

^Like `series` but passes return val of one fn as args to next fn. Promises also
do this implicitly.

---

# fin
