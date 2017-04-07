
![](/images/StrongLoop.png)

# Unit Testing

---

## Testing Patterns

* **Unit**: Small tests covering individual functions
* **Integration**: Integrated modules (combined functionality)
* **Functional**: Focused on end result of larger actions
* **Acceptance**: Typically client-side, end-to-end testing

---

## Mocha

[mochajs.org](https://mochajs.org/)

Simple testing framework (runner/reporter) for Node and the browser.

Allows for various assertion libraries to be used (bdd, tdd, etc)

---

## Mocha Setup

```bash
~/my-app$ npm install --save-dev mocha chai
~/my-app$ mocha path/to/tests/
```

Note that we're using the `chai` assertion library.

Now create test (JS) files in your `tests/` directory.
<!-- .element: class="fragment" -->

---

## Basic Tests

Here is a basic test using the `assert` style of `chai`:

```js
// my-app/test/math.js
var assert = require('chai').assert;

describe('math module', function() {
    it('should add numbers', function() {
        
        assert.equal( (1 + 1), '2');
        assert.strictEqual(127 + 319, 446);
        
    });
});
```

---

## Running the Tests

Now we run the tests and look for green check marks!

```bash
~/my-app$ mocha tests/math.js

  math module
    ✓ should add numbers (1ms)
  
  1 passing (1ms)
```

---

## Running the Tests

And here is what a failure looks like:

```bash
~/my-app$ mocha tests/math.js

  math module
    1) should add numbers
  
  0 passing (1ms)
  1 failing
  
  1) math module should add numbers
     AssertionError: 3 == 2
       at test/math.js:7:9
```

---

## Assertions

---

### Assertion Types

We have many assertion types,  
most are common to all libraries.

* `equal`: simple equality
* `strictEqual`: strict equality
* `ok` (or sometimes called `true`): ensure a value is "truthy"
* `deepEqual`: Check all property values in an object
* `isNull`: specifically check for a `null` value
* `match`: Match value against a regular expression
* `throws`: Check the the given function throws an `Error`
* ...and many more!

---

### Negation Assertions

There are many more assertion types depending on the library, 
including negation of the previous assertions:

* `notEqual`
* `notOk`
* `notDeepEqual`
* `isNotNull`
* `notMatch`
* etc, etc...

---

## Asynchronous Testing

---

### Asynchronous Testing

```js
function getRecords(cb) {
    User.find({}, function(err, records) {
        if (err) { /* ... */ }
        
        cb( records );
    });
}
```

```js
describe('async methods', function() {
    it('should assert after completing', function( done ) {
        
        getRecords(function( records ) {
            assert.equal( recrods.length, 10 );
            done();
        });
        
    });
});
```
<!-- .element: class="fragment" -->

---

## Real World Testing

---

## Real World Testing

* Keep your modules small
<!-- .element: class="fragment" -->
* Write tests for each module, separately if possible
<!-- .element: class="fragment" -->
* Be sure to test success AND error cases!
<!-- .element: class="fragment" -->

---

### Real World Example - LoopBack Model

This is a **LoopBack** model for a CoffeeShop.

It has a remote method for getting the **status** of the shop:

```js
module.exports = function(CoffeeShop) {
    
    CoffeeShop.status = function(id, cb) {
        CoffeeShop.findById(id, function(err, shop) {
            if (err) { return cb(err); }
            
            // determine if the shop is open...
            var isOpen = true;
            
            cb(null, isOpen);
        });
    };
    
    CoffeeShop.remoteMethod('status', { /* ... */ });
    
    // ...
}
```

---

### Real World Example - Mocking

We need to mock out **`findById()`** and **`remoteMetehod()`**

_(We are not attempting to test LoopBack itself.)_

```js
var CoffeeShop = {};
    modelInit = require('../common/models/coffee-shop.js');

CoffeeShop.findById = function(id, cb) {
    // Our mock can simply execute the callback, asynchronously...
    process.nextTick(function() {
        cb(null, {
            id: id,
            name: 'Foobar',
            openingHour: 8, // you could alter these based on the id
            closingHour: 23
        });
    });
};
CoffeeShop.remoteMethod = function() { /* noop */ }

modelInit(CoffeeShop);
```

---

### Real World Example - Test It!

Now we can write our test!

```js
describe('CoffeeShop', function() {
    it('should return true when open', function( done ) {
        
        CoffeeShop.status(13, function( err, isOpen ) {
            assert.isNull( err );
            assert.ok( isOpen );
            done();
        });
        
    });
});
```

---

## LoopBack Testing

If you are building a LoopBack application there are some testing tools to help you!

[github.com/strongloop/loopback-testing](https://github.com/strongloop/loopback-testing)

* Ensuring remote calls will work
* Ensuring restrictions, status codes, etc
* Test data generation

These tools are more for **integration** testing.

---

# fin
