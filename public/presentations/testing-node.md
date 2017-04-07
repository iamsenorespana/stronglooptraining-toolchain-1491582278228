
![](/images/StrongLoop.png)

## Unit Testing Node.js

![{{speaker}}]()

---

![fit](/images/StrongLoop_who.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/arc-products.png)

---

## Testing Patterns

<ul>
    <li class='fragment'>**Unit**: Small tests covering individual functions</li>
    <li class='fragment'>**Integration**: Integrated modules (combined functionality)</li>
    <li class='fragment'>**Functional**: Focused on end result of larger actions</li>
    <li class='fragment'>**Acceptance**: Typically client-side, end-to-end testing</li>
</ul>

---

# What should I use?

* jasmine
<!-- .element: class="fragment" -->
* karma
<!-- .element: class="fragment" -->
* expresso
<!-- .element: class="fragment" -->
* mocha
<!-- .element: class="fragment" -->
* node-tap
<!-- .element: class="fragment" -->
* intern
<!-- .element: class="fragment" -->
* node-unit
<!-- .element: class="fragment" -->
* vows
<!-- .element: class="fragment" -->
* node-qunit
<!-- .element: class="fragment" -->
* ಠ_ಠ
<!-- .element: class="fragment" -->

---

## Mocha

[mochajs.org](https://mochajs.org/)

---

## Mocha Setup

```no-highlight
~/my-app$ npm install --save-dev mocha chai
```

---

## Mocha Setup

Update `package.json`:

```js
"scripts": {
    "test": "./node_modules/mocha/bin/mocha path/to/tests/"
}
```

---

## Basic Tests and Assertions

```js
var assert = require('chai').assert;

describe('math module', function() {
    it('should add numbers', function() {
        
        assert.equal( (1 + 1), '2' );
        assert.strictEqual( 127 + 319, 446 );
        
    });
});
```

---

## Asynchronous Testing

```js
var assert = require('chai').assert;
var twitter = require('./lib/twitter');

describe('async module', function() {
    it('should be successful', function( done ) {
        
        twitter.getFeed('jakerella', function(err, tweets) {
            
            if (err) { return done( err ); }
            
            assert.equal(tweets.length, 10);
            
            done();
            
        });
        
    });
});
```

---

## Running the Tests - Success

Now we run the tests and look for green check marks!

<pre><code class='lang-no-highlight'>~/my-app$ npm test

  math module
    <span style='color:green'>✓</span> <span style='color:gray'>should add numbers</span>
  async module
    <span style='color:green'>✓</span> <span style='color:gray'>should be successful</span>
  
  <span style='color:green'>2 passing</span> <span style='color:gray'>(235ms)</span></code></pre>

---

## Running the Tests - Failure

<pre><code class='lang-no-highlight'>~/my-app$ npm test

  math module
    <span style='color:green'>1) should add numbers</span>
  async module
    <span style='color:green'>✓</span> <span style='color:gray'>should be successful</span>
  
  <span style='color:green'>1 passing</span> <span style='color:gray'>(230ms)</span>
  <span style='color:red'>1 failing</span>
  
  1) math module should add numbers
     <span style='color:red'>AssertionError: 3 == 2</span>
       <span style='color:gray'>at test/math.js:7:9</span></code></pre>

---

## Assertion Methods

---

### Assertion Methods

* `equal`
* `strictEqual`
* `deepEqual`

---

### Assertion Methods

* `ok`
* `isNull`
* `true`
* `fail`

---

### Assertion Methods

* `match`
* `throws`

---

### Negation Assertions

* `notEqual`
* `notOk`
* `notDeepEqual`
* `isNotNull`
* `notMatch`
* etc, etc...

---

# Let's Look at Some Code

[github.com/ jakerella / node-unit-tests](https://github.com/jakerella/node-unit-tests)

---

# Testing with Mocks

* [rewire](https://github.com/jhnns/rewire)
* [sinon](http://sinonjs.org/)
* [require-inject](https://github.com/iarna/require-inject)

---

# Idempotency

* `before()` and `after()`
* `beforeEach()` and `afterEcah()`

---

## Testing Web Applications

* Check `require.main`!
* Use `superagent` ([visionmedia/superagent](https://github.com/visionmedia/superagent))


---

## Other Testing Tips

* Keep your modules small
<!-- .element: class="fragment" -->
* Be sure to test success AND error cases
<!-- .element: class="fragment" -->
* Test expected AND unexpected data
<!-- .element: class="fragment" -->
* Don't forget that modules are cached!
<!-- .element: class="fragment" -->

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]() | ![{{contact}}]()

![{{url}}]()  
[github.com/jakerella/node-unit-tests](https://github.com/jakerella/node-unit-tests)
