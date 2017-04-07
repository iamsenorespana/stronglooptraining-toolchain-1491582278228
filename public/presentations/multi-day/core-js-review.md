
![](/images/StrongLoop.png)

# Core JavaScript Review

---

# Variables

Two categories:

*Primitives* and *Objects*

---

## Primitives

A primitive value is data alone, no properties and no methods.

Generally, anything that isn't an object is a primitive.

---

## Primitives

In JavaScript, there are 6 primitive data types:

* string
* number
* boolean
* null
* undefined
* symbol (new in ES6)

---

## Primitives

All primitive values are immutable!


```js
var name = "Strong";
name = name + "Loop";  // creates a NEW string primitive value
```

^Discuss how all methods on primitive wrappers actually return NEW primitive values

---

## Dynamic typing

JavaScript is a loosely typed or "dynamic" language.

```js
var strongLoop = 42;
console.log( typeof strongLoop ); // "number"
var strongLoop = "bar";
var strongLoop = true;
```

Variables are _references_ to values and can change!

---

### JavaScript Has Quirks!

```js
NaN === NaN  // false
```

Instead, use `isNaN( someValue )`

---

### Falsy Values

* `false`
* `null`
* `undefined`
* `0`
* `NaN`
* `''` (empty string)

---

### Truthy Values

All values that are not falsy!

---

### Remember those quirks?

```js
' ' == 0     // true
'' == 0      // true
' ' == false // true

' ' === 0  // false
```

```js
if (' ') { console.log('oops'); }
```

^ `==` and `if` process differently!

---

### Null vs Undefined

`null` is an empty value

`undefined` is the lack of value at all

---

### Undefined

Undefined does not mean undeclared!

```js
var loopback;

console.log( typeof loopback ); // "undefined"
console.log( typeof express );  // "undefined"
console.log( loopback ); // "undefined"
console.log( express );  // ReferenceError: express is not defined
```

^An "undefined" variable is one that has been declared in the accessible scope, but at the moment has no other value in it.

---

## Object Literals

```js
var obj = {
  a: 4,
  b: 9,
  x: 'node.js'
};

obj.a  // 4

obj['a'] === obj.a
```

---

### Object Literals !== JSON

JSON is a data transfer format that is strictly enforced!

This is fine as an object literal, but NOT JSON:

```js
{
    // You can't have comments in JSON!!
    
    "foo": 'bar',             // No single quotes
    bat: "baz",               // No unquoted property names
    "name": "Strong" + "Loop",// No expressions!
    "x": 42,                  // No trailing commas!
}
```

---

## Object Constructors

```js
var d = new Date("11/12/1955");

d.getMonth();  // 10  ;)
```

^ Months use a zero-based index, days do not.

---

### Creating New Objects

```js
function Employee(name, age) {
    this.name = name;
    this.age = age;
}

var john = new Employee( "John", 30 );
```

^ Discuss that while every function has the ability to be a constructor, we capitalize them by convention (not a requirement)

---

### Object `prototype`s

Every object has a prototype that it was created from.

```js
var john = new Employee( "John", 30 );

john.__proto__ === Employee.prototype;
```

---

### Object `prototype`s

The `prototype` property of a constructor is where we place data and methods shared by all objects created by that constructor.

```js
function Employee(name, age) {
    this.name = name;
    this.age = age;
}

Employee.prototype.name = "StrongLoop";
Employee.prototype.birthday = function() {
    this.age++;
}

var john = new Employee( "John", 30 );
var mary = new Employee( "Mary", 36 );

john.birthday();  // john.age === 31
mary.birthday();  // mary.age === 37
```

---

### The `prototype` Chain

The "prototype chain" refers to the sequence of objects that create an object's inheritance.

```js
var john = new Employee( "John", 30 );

john.__proto__ === Employee.prototype;
Employee.prototype.__proto__ === Object.prototype;
```

---

### The `prototype` Chain

```js
console.log(john);

{
    name: "John",
    age: 30,
    __proto__: Employee {
        constructor: function Employee(name, age) { /* ... */ },
        name: "StrongLoop",
        birthday: function () { /* ... */ },
        __proto__: Object { /* ... */ }
    }
}
```

^ Discuss how the prototype chain is a fallback mechanism, if the property or method isn't on the instance, JS falls back to the nearest prototype until it hits the end.

---

## Functions

```js
function foo() {
  // ...
}

var bar = function baz() {
  // ...
};
```

```js
foo.name === "foo"
bar.name === "baz"
```

---

### Functions as Values

Functions are objects. They can have properties and methods!

```js
function foo() {
  // ...
};
foo.name  // foo
foo.x = 10;
```

```js
foo.doStuff = function() { ... };
```

---

### Functions as Values

A function itself is a value that can be assigned to variables or passed to or returned from other functions.

Functions are first-class citizens.

---

### Function Arguments

```js
var f = function(option1, option2, option3) {
  console.log( arguments[0] === options1 ); // true
}
```

^The arguments object is a local variable available within all functions;

---

### Functions Create Scope

```js
function outer() {
  var a = 1;

  function inner() {
      var b = 2;

      console.log( a + b ); // 3
  }

  inner();

  console.log( a );         // 1
  console.log( typeof b );  // undefined
}

outer();
```

---

### Closures

The ability of a function to access its parent scope even when executed after the original context is inaccessible.

Functions "close" variables outside their scope.

---

### Closures

```js
var inner;

function outer(x) {
  var y = 2;
  
  inner = function (z) {
      return x + y + z;
  };
  
}

outer( 1 );
inner( 3 ); // 6
```

---

### The Scope Chain

A closure has access to:

* its own scope (variables defined between its curly brackets)
* any outer function's scope (at time of definition)
* the global scope (`window` in the browser, `global` in Node)

---

### Scope and Context

```js
var user = {
    name: "StrongLoop",
    getName: function() {
        return this.name;
    }
};

user.getName(); // "StrongLoop"
```

---

### Scope and Context

```js
var user = {
    name: "StrongLoop",
    getNamePrinter: function() {
        
        return function printName() {
            console.log( this.name );
        };
        
    }
};

var nameFn = user.getNamePrinter();
nameFn(); // "" (empty string)
```

^ When we execute the returned function "this" is no longer pointing to the same thing as when the printName function was created!

---

### Scope and Context

```js
var user = {
    name: "StrongLoop",
    getNamePrinter: function() {
        var self = this;
        
        return function printName() {
            console.log( self.name );
        };
        
    }
};

var nameFn = user.getNamePrinter();
nameFn(); // "StrongLoop"
```

^
- A common practice is to utilize the closure nature of functions in JS to retain object state.
- ` return (function printName(){ ... }).bind(this)` is another "more modern"
approach

---

### Variable Hosting

```js
function foobar() {
  
  console.log( x );   // 42? ReferenceError?
  
  var x = 42;
}
```

^ This will actually print out "undefined" due to `x` being "hoisted" to the top of the scope

---

### Variable Hoisting

This is how the variable declaration and instantiation is actually interpreted:

```js
function foobar() {
    var x;
    console.log( x );   // undefined!
    
    x = 42;
}
```

^ discuss let and const for ES6!

---

### Variable Hoisting with Functions

```js
function foobar() {
    
    console.log( getAnswer() );   // ???
    
    function getAnswer() {
        return 42;
    }
}
```

^ Note how this works because the entire declaration and instantiation is hoisted

---

### Variable Hoisting with Functions

_Note that function hoisting does not occur with expressions!_

```js
function foobar() {
    
    console.log( getAnswer() );   // ReferenceError!
    
    getAnswer = function () {
        return 42;
    }
}
```

---

### Changing context

`call()` and `apply()` each allow function execution with a given context:

```js
function foo(last) {
    return this.first + last;
}

foo();  // "" (empty string)

foo.call({ first: "Strong" }, "Loop");     // "StrongLoop"

foo.apply({ first: "Strong" }, ["Loop"]);  // "StrongLoop"
```

---

### Function Binding

```js
function foo(last) {
    return this.first + last;
}

foo();   // "" (empty string)

var boundFoo = foo.bind({ first: "Strong" });
boundFoo("Loop");   // "StrongLoop"
```

^ Note that it creates a *new* function with a bound, default scope (but it can still be changed with call() or apply()) (_revisit getNamePrinter for add'l example_)

---

### Immediately-Invoked Function Expressions (IIFE)

```js
( function(){
   
   // do some stuff
   
} )();
```

^IIFE are widely use in browser JS, but have no use in node.js! (module system
creates per-module scope automatically)

---

### Immediately-Invoked Function Expressions (IIFE)

```js
( function(){
   
   // do some stuff
   
}() );
```

_Note that the executing parenthesis can be inside or outside the containing parenthesis!_

^ users may also encounter `!function{}()()`

---

### Callback Functions

Any time we have an asynchronous action we're going to need a **callback function** to execute when the action completes.

```js
fs.readFile('foo/bar.json', function handleFileData(err, data) {
    // process the data...
});
```

_Note that the callback function should *always be the last argument!*_

---

### Callback Functions

We could also separate this callback which can help immensely in testing and modularity:

```js
function handleFileData(err, data) {
    // process the data...
}

fs.readFile('foo/bar.json', handleFileData);
```

---

# fin
