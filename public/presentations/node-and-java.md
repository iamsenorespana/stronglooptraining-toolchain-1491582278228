
![](/images/StrongLoop.png)

## Bridging the Java and Node.js Divide

![{{speaker}}]() | ![{{contact}}]()

---

<!-- .slide: data-background="white" -->

## The Many Faces of Node at IBM

![](/images/faces_of_node.png)

---

# What is Node.js?

### Node is not "JavaScript" exactly...
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

* Mozilla's SpiderMonkey
<!-- .element: class="fragment" -->
* Microsoft's Chakra
<!-- .element: class="fragment" -->
* Adobe's Tamarin (ActionScript)
<!-- .element: class="fragment" -->
* Rhino (early server-side implenentation; written in Java)
<!-- .element: class="fragment" -->
* Chrome's V8
<!-- .element: class="fragment" -->

---

### The Node Core

Node builds on V8 with C++ and JavaScript code.

![](/images/Node-Architecture.png)
<!-- .element: class="fragment" -->

---

# Why Node?

---

<!-- .slide: data-background="white" -->

![fit](/images/api-connector.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/micro-services.png)

---

## APIs are the vehicle for microservices...

### ...and Node excels when it comes to APIs.
<!-- .element: class="fragment" -->

---

## Why Node?

* Node is fast.
<!-- .element: class="fragment" -->
  * Non-blocking I/O
<!-- .element: class="fragment" -->
  * JavaScript arms race (V8)
<!-- .element: class="fragment" -->
* One language to rule them all
<!-- .element: class="fragment" -->
* Vibrant Ecosystem (npm)
<!-- .element: class="fragment" -->

---

## Caveats

* Have to think in async
<!-- .element: class="fragment" -->
  * Callback Hell
<!-- .element: class="fragment" -->
* Frameworks and tools are still growing
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

## Dependencies in Node versus Java

---

## Installing a Dependency

In Java...

<ol>
    <li class='fragment'>download jar (or install from Maven)</li>
    <li class='fragment'>configure dpenendencies (in Maven perhaps)</li>
    <li class='fragment'>pull in the class: `import com.ibm.FooBar`</li>
    <li class='fragment'>make sure to compile with the dependent jar file</li>
</ol>

^ Talk about Maven "dependencies" block

---

## Installing a Dependency

In Node.js...

<ol>
    <li class='fragment'>install the dependency: `npm install --save express`</li>
    <li class='fragment'>pull in the module: `require('express')`</li>
</ol>

^ Make sure to talk about what happens in each step

---

## Using `npm`

"Node Pakcage Manager" - more than just dependencies!

---

### Project Meta: `package.json`

```no-highlight
/my-project$ npm init

This utility will walk you through creating a package.json
file.  It only covers the most common items, and tries to
guess sane defaults.
...

Press ^C at any time to quit
name: (my-package-name)
```
<!-- .element: class="fragment" -->

---

### A Basic `package.json`

```js
{
  "name": "my-project",
  "version": "0.1.0",
  "description": "This is my project!",
  "main": "main.js",
  "scripts": {
    "test": "echo \"You have no tests!\""
  },
  "author": "John Doe <john@doe.com>",
  
  "license": "MIT",
  "private": true
}
```

^ Talk abotu adding those last two every time!

---

### Adding Node Dependencies

Be sure to **save** your dependencies!

```no-highlight
/my-project$ npm install express --save
/my-project$ npm install mocha --save-dev
```

```js
{
  ...,
  dependencies: {
    "express": "^4.12.4"
  },
  devDependencies: {
    "mocha": "^2.3.3"
  }
}
```
<!-- .element: class="fragment" -->

---

### Adding Node Dependencies

```no-highlight
/my-project$ npm install express --save
```

```no-highlight
my-project
 |_ node_modules
   |_ express
   |_ mocha
   |_ bluebird
      ...
 |_ server
    ...
```

---

### A word on versions...

Node encourages *Semantic Versioning* (semver)...

```no-highlight
  4   .   2   .   1  
major   minor   patch
```
<!-- .element: class="fragment" -->

---

### A word on versions...

When adding a dependency in Node:

```js
dependencies: {
  "express": "^4.12.4"
},
```

<p class='fragment'>**"^4.12.4"** >> 4.12.5, 4.12.6, 4.13.0, 4.14.1, ~~5.0.0~~</p>

<p class='fragment'>**"~4.12.4"** >> 4.12.5, 4.12.6, ~~4.13.0~~, ~~4.14.1~~, ~~5.0.0~~</p>

<p class='fragment'>**"4.12.*"** >> 4.12.5, 4.12.6, ~~4.13.0~~, ~~4.14.1~~, ~~5.0.0~~</p>

<p class='fragment'>**"*"** >> ಠ_ಠ</p>

---

### Global Packages

Used for various tooling  
(scaffolding, testing, build, deploy, etc)

```no-highlight
~$ npm install -g strongloop
```

```no-highlight
~$ slc loopback
```
<!-- .element: class="fragment" -->

---

### How do I use module X?

READ THE DOCS.
<!-- .element: class="fragment" -->

Doesn't have docs? Use a different module.
<!-- .element: class="fragment" -->

---

### Choosing a Module

1. Documentation
<!-- .element: class="fragment" -->
1. Tests
<!-- .element: class="fragment" -->
1. Project Velcity
<!-- .element: class="fragment" -->
1. Community Involvement
<!-- .element: class="fragment" -->

---

## Basic Module Usage

---

## Basic Module Usage

```js
var express = require('express');

var app = express();

app.set('foo', 'bar');
```

---

### Requiring Modules

Modules can live different places:

```js
var filesystem = require('fs'),       // core Node module
    express = require('express'),     // from /node_modules/
    router = require('./app/router.js'), // app file
    config = require('../config/config.json');
```

---

## Node Modules vs. Java Classes

---

### Hello World

```java
public class HelloWorld {
    public static void sayHello( String recipient ) {
        System.out.println( "Hello " + recipient );
    }
}
```

```js
module.exports = function sayHello( recipient ) {
    console.log( "Hello " + recipient );
};
```
<!-- .element: class="fragment" -->

---

### Using Hello World

```js
// hello-world.js
module.exports = function sayHello( recipient ) {
    console.log( "Hello " + recipient );
};
```

```js
// main.js
var foobar = require('./hello-world');

foobar( 'StrongLoop!' );
```
<!-- .element: class="fragment" -->

```no-highlight
$ node main.js
Hello StrongLoop!
```
<!-- .element: class="fragment" -->

---

### Module Exports

Whatever is on the `module.exports` property becomes  
the return value of `require('...')`!

---

### Module Exports

```js
//answer.js
module.exports = 42;
```

```js
// main.js
var theAnswer = require('./answer.js');

theAnswer === 42; // true!
```

---

### Module Patterns

* Simple Object API
<!-- .element: class="fragment" -->
* Revealing Module
<!-- .element: class="fragment" -->
* Object Constructors
<!-- .element: class="fragment" -->

---

### Simple Object API

```js
// company.js
module.exports = {
    name: "StrongLoop",
    sayHello: function() {
        return "Hello " + this.name;
    }
};
```

```js
var api = require('./company');
console.log( api.sayHello() );  // "Hello StrongLoop"
```
<!-- .element: class="fragment" -->

---

### Why not use a simple Object?

**Modules are cached by Node!**
<!-- .element: class="fragment" -->

Requiring a module twice could yield unexpected results!
<!-- .element: class="fragment" -->

---

### Module Caching

```js
module.exports = {
    salary: 50000,
    giveRaise: function(amount) {
        this.salary += amount;
    }
};
```
<!-- .element: class="fragment" -->

```js
var workerOne = require('./worker');
workerOne.giveRaise(10000);
console.log( workerOne.salary );  // 60000

var workerTwo = require('./worker');
workerTwo.giveRaise(10000);
console.log( workerTwo.salary );  // 70000!
```
<!-- .element: class="fragment" -->

---

## Revealing Module Pattern

---

### Revealing Module Pattern

```js
module.exports = function createWorker(options) {
    options = options || {};
    return {
        salary: options.salary || 50000,
        giveRaise: function(amount) {
            this.salary += amount;
        }
    };
};
```

```js
var getWorker = require('./worker');

var workerOne = getWorker({ salary: 30000 });
workerOne.giveRaise(7000);  // workerOne.salary === 37000

var workerTwo = getWorker();
workerTwo.giveRaise(5000);  // workerTwo.salary === 55000
```
<!-- .element: class="fragment" -->

---

## Object Constructor Pattern

---

### Object Constructor Pattern

```js
var Worker = module.exports = function Worker(options) {
    options = options || {};
    this.salary = options.salary || 50000;
    // ... worker initialization stuff
};

Worker.prototype.giveRaise = function(amount) {
    this.salary += amount;
};
```

```js
var Worker = require('./worker');

var workerOne = new Worker({ salary: 30000 }));
workerOne.giveRaise(1000);   // workerOne.salary === 31000

var workerTwo = new Worker();
workerTwo.giveRaise(8000);   // workerTwo.salary === 58000
```
<!-- .element: class="fragment" -->

---

## So `Worker` is a `class`?

# No.
<!-- .element: class="fragment" -->

---

## JavaScript does not have classes,  
## it has prototypes.

---

### So what is a `prototype`?

Think of a prototype as a fallback mechanism...
<!-- .element: class="fragment" -->

```js
function Animal() { /* ... */ }

function Dog() {
    Animal.apply(this);
    // ...
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```
<!-- .element: class="fragment" -->

---

### Fallback Mechanism

```js
var v = new Dog('Vincent');

v.name;       // directly on the Dog instance object
v.speak();    // on the Dog prototype
v.isAlive();  // on the Animal prototype
v.toString(); // on the Object prototype
```

```js
v.__proto__ === Dog.prototype;
v.__proto__.speak = function() { return 'foobar'; }
```
<!-- .element: class="fragment" -->

---

# What else can Node do?

---

## The Node `process`

An interface to the current Node system process:

* Environment variables (`process.env`)
* CLI args (`process.argv`)
* System Process ID (`process.pid`)
* etc, etc...

---

## HTTP (in 10 lines)

```js
var http = require( 'http' );

var server = http.createServer( function handleRequests( req, res ) {
    res.writeHead( 200, {
        'Content-Type': 'text/html'
    } );
    res.end( '<h1>Hello World!</h1>' );
} );

server.listen( 3000, '127.0.0.1', function() {
    console.log( 'The server is up!' );
} );
```
<!-- .element: class="fragment" -->

---

## FileSystem

```js
var fs = require( 'fs' );

fs.readFile( 'config.json', function( err, data ) {
    if ( err ) {
        // handle it!
        console.error( err.stack );
        return;
    }
    
    // `data` is a Buffer, so decode it first...
    console.log( data.toString('utf-8') );
});
```

---

## More Core

* Child Processes (`spawn` & `exec`)
* Streams
* Crypto
* Cluster
* Events
* ...

---

# Data Sources

Easy to connect to most database management systems

Native drivers for:

* Oracle
* MySQL
* MSSQL
* MongoDB
* DB2
* Cloudant

---

## MySQL

```
~/my-app$ npm install mysql --save
```

---

### MySQL Module Usage

```js
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // ...
});
connection.connect();

connection.query(
    "SELECT * FROM `books` WHERE author='Tolstoy'",
    function(err, rows, fields) {
        if (err) { /* ... */ return; }

        rows.forEach(function(row) { /* ... */ });
        
        connection.end();
    }
);
```

---

### ORMs and ODMs

#### [sequelize](http://docs.sequelizejs.com/en/latest/)
<!-- .element: class="fragment" -->

#### [Mongoose (MongoDB)](http://mongoosejs.com/)
<!-- .element: class="fragment" -->

#### [Waterline](https://github.com/balderdashy/waterline)
<!-- .element: class="fragment" -->

---

## So it's just... &nbsp;&nbsp;JavaScript?

<br><br>

# YES!
<!-- .element: class="fragment" -->

---

# Cool.

Iknowright?
<!-- .element: class="fragment" -->

---

# Integration

---

### Via HTTP

```js
var http = require('http');

var req = http.request({
    hostname: '10.1.1.138',
    path: '/foo/bar',
    method: 'POST',
    // ...
}, function setupResponse(res) {
    var data = '';
    res.on('data', function handleData(chunk) {
        data += chunk;
    });
    res.on('end', function handleResponse() { /* ... */ });
});

req.on('error', function handleErr(err) { /* ... */ });
req.write(postData);
req.end();
```

---

### Via Child Processes

```js
var cp = require('child_process');

var ps = cp.exec('java ...', function (err, stdout, stderr) {
    if (err) {
        // Handle error in initial execution...
        
    } else if (stderr && stderr.toString().length) {
        // Handle error in program output
    }
    
    // Handle standard output...
    console.log('STDOUT: ', stdout);
});
```

---

## I'm ready, what's next?

# Scale
<!-- .element: class="fragment" -->

---

# APIs at IBM

## Create > Run > Manage > Enforce

---

<!-- .slide: data-background="white" -->

![fit](/images/arc-products.png)

## [strongloop.com/get-started](https://strongloop.com/get-started/)

---

Notices and Disclaimers

<div style='font-size:0.55em'>
    <p>Copyright © 2016 by International Business Machines Corporation (IBM).  No part of this document may be reproduced or transmitted in any form without written permission from IBM.</p>
    <p><strong>U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM.</strong></p>
    <p>Information in these presentations (including information relating to products that have not yet been announced by IBM) has been reviewed for accuracy as of the date of initial publication and could include unintentional technical or typographical errors. IBM shall have no responsibility to update this information. THIS DOCUMENT IS DISTRIBUTED "AS IS" WITHOUT ANY WARRANTY, EITHER EXPRESS OR IMPLIED.  IN NO EVENT SHALL IBM BE LIABLE FOR ANY DAMAGE ARISING FROM THE USE OF THIS INFORMATION, INCLUDING BUT NOT LIMITED TO, LOSS OF DATA, BUSINESS INTERRUPTION, LOSS OF PROFIT OR LOSS OF OPPORTUNITY.  IBM products and services are warranted according to the terms and conditions of the agreements under which they are provided.</p>
    <p><strong>Any statements regarding IBM's future direction, intent or product plans are subject to change or withdrawal without notice.</strong></p>
    <p>Performance data contained herein was generally obtained in a controlled, isolated environments.  Customer examples are presented as illustrations of how those customers have used IBM products and the results they may have achieved.  Actual performance, cost, savings or other results in other operating environments may vary.</p>
    <p>References in this document to IBM products, programs, or services does not imply that IBM intends to make such products, programs or services available in all countries in which IBM operates or does business.</p>
    <p>Workshops, sessions and associated materials may have been prepared by independent session speakers, and do not necessarily reflect the views of IBM.  All materials and discussions are provided for informational purposes only, and are neither intended to, nor shall constitute legal or other guidance or advice to any individual participant or their specific situation.</p>
    <p>It is the customer's  responsibility to insure its own compliance with legal requirements and to obtain advice of competent legal counsel as to the identification and interpretation of any relevant laws and regulatory requirements that may affect the customer's business and any actions the customer may need to take to comply with such laws.  IBM does not provide legal advice or represent or warrant that its services or products will ensure that the customer is in compliance with any law.</p>
</div>

---

Notices and Disclaimers (cont'd)

<div style='font-size:0.55em'>
    <p>Information concerning non-IBM products was obtained from the suppliers of those products, their published announcements or other publicly available sources.  IBM has not tested those products in connection with this publication and cannot confirm the accuracy of performance, compatibility or any other claims related to non-IBM products.  Questions on the capabilities of non-IBM products should be addressed to the suppliers of those products. IBM does not warrant the quality of any third-party products, or the ability of any such third-party products to interoperate with IBM’s products.  IBM EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</p>
    <p>The provision of the information contained h erein is not intended to, and does not, grant any right or license under any IBM patents, copyrights, trademarks or other intellectual property right.</p>
    <p>IBM, the IBM logo, ibm.com, Aspera®, Bluemix, Blueworks Live, CICS, Clearcase, Cognos®, DOORS®, Emptoris®, Enterprise Document Management System™, FASP®, FileNet®, Global Business Services ®, Global Technology Services ®, IBM ExperienceOne™, IBM SmartCloud®, IBM Social Business®, Information on Demand, ILOG, Maximo®, MQIntegrator®, MQSeries®, Netcool®, OMEGAMON, OpenPower, PureAnalytics™, PureApplication®, pureCluster™, PureCoverage®, PureData®, PureExperience®, PureFlex®, pureQuery®, pureScale®, PureSystems®, QRadar®, Rational®, Rhapsody®, Smarter Commerce®, SoDA, SPSS, Sterling Commerce®, StoredIQ, Tealeaf®, Tivoli®, Trusteer®, Unica®, urban{code}®, Watson, WebSphere®, Worklight®, X-Force® and System z® Z/OS, are trademarks of International Business Machines Corporation, registered in many jurisdictions worldwide. Other product and service names might be trademarks of IBM or other companies. A current list of IBM trademarks is available on the Web at "Copyright and trademark information" at:  <www.ibm.com/legal/copytrade.shtml>.</p>
</div>

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]() | ![{{contact}}]()
