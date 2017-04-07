![](/images/StrongLoop.png)

## Node.js Architecture and
## Getting Started with Express.js

![{{speaker}}]()

---

# Node.js Architecture

---

## Modularity

---

### Module Patterns

There are various patterns...

* Simple Object API
<!-- .element: class="fragment" -->
* Revealing Module (Function Initialization)
<!-- .element: class="fragment" -->
* Object Constructor
<!-- .element: class="fragment" -->

---

### Simple Object API

```js
// lib/employee.js
module.exports = {
    salary: 50000,
    giveRaise: function( amount ) {
        salary += amount;
    }
};
```

Why not always use simple objects?
<!-- .element: class="fragment" -->

**Modules are cached!**
<!-- .element: class="fragment" -->

---

### Revealing Module Pattern

```js
module.exports = function createWorker( options ) {
    
    // Setup...
    
    return {
        salary: 50000,
        giveRaise: function( amount ) {
            this.salary += amount;
        }
    };
};
```
<!-- .element: class="fragment" -->

---

### Object Constructor Pattern

```js
var Worker = module.exports = function Worker( options ) {
    // ...
};

Worker.prototype.salary = 50000;
Worker.prototype.giveRaise = function( amount ) {
    this.salary += amount;
};
```
<!-- .element: class="fragment" -->

---

## Scaling

---

![fit](/images/event-loop.png)

---

### Vertical Scaling

![](images/vertial-scaling-strongloop.png)

---

### Node Clustering

---

```js
var http = require('http'),
    cluster = require('cluster');

if (cluster.isMaster) {
  
    for (var i = 0; i < numCPUCores; i++) {
        cluster.fork();
    };
  
} else {
    
    http
        .createServer(function(req, res) {
            // ...
        })
        .listen(8080, ...);
});
```

---

### Using a Process Manager

Easy clustering and scaling without altering application code

* [StrongLoop Process Manager (`strong-pm`)](https://github.com/strongloop/strong-pm)
<!-- .element: class="fragment" -->
* [PM2](https://github.com/Unitech/pm2)
<!-- .element: class="fragment" -->

[Comparison Chart](http://strong-pm.io/compare)
<!-- .element: class="fragment" -->

<del class="fragment">
    <a href="https://github.com/foreverjs/forever">Forever</a>
</del>

---

### Load Balancing

`cluster` uses a simple round-robin approach...

...but there are better ways!
<!-- .element: class="fragment" -->

---

### Horizontal Scaling

![](images/horizontal-scaling.png)

---

### Horizontal Scaling

![](images/horizontal-scaling-nginx.png)

[Nginx](http://wiki.nginx.org/Main)

---

### Basic Nginx Config

```Nginx
server {
    listen 80
    location / {
        proxy_pass http://localhost:3000;
    }
 
    location /static/ {
        root /var/www/my-app/public;
    }
}
```

```
$ sudo service nginx start
```
<!-- .element: class="fragment" -->

---

### Nginx Load Balancer

```Nginx
http {
    upstream myapp {
        least_conn; # round-robin is the default...
                    # Or use ip_hash; for "sticky" sessions...
        server www1.my-app.com;
        server www2.my-app.com;
        server www3.my-app.com;
    }

    server {
        listen 80
        location / {
            proxy_pass http://myapp;
        }
    }
}
```

---

### StrongLoop and nginx

If you're using `strong-pm` you can use the [StrongLoop nginx controller](http://docs.strongloop.com/display/SLC/Configuring+Nginx+load+balancer)!

```bash
~$ npm install -g strong-nginx-controller

~$ sl-nginx-ctl-install
```

Install the Controller on the load balancing host...

---

...then manage the load balancing infrastructure from [StrongLoop Arc](http://docs.strongloop.com/display/SLC/Managing+multi-server+apps#Managingmulti-serverapps-Addingaloadbalancer):

![Arc Process Manager Config](/images/arc-pm.png)

---

![Arc Load Balancer Config](/images/arc-load-balancer.png)

---

### Scaling with StrongLoop Arc

![](images/horizontal-scaling-nginx.png)

[Nginx](http://wiki.nginx.org/Main)

---

# Express.js

---

## Express.js

Fast, light, unopinionated framework for web applications.

---

## Express Hello World

```bash
~/my-app$ npm init
...
```

```bash
~/my-app$ npm install express --save
```
<!-- .element: class="fragment" -->

---

## Express Hello World

```js
// in app.js
var express = require('express');
var myApp = express();

myApp.get('/', function handleRoot(req, res, next) {
    res.send('Hello World!');
});

myApp.listen(8080);
```

```bash
~/my-app$ node app.js
```
<!-- .element: class="fragment" -->

---

### Scaffolding an Express App

---

### Scaffolding Express

Install the CLI generator first...

```bash
~$ npm install -g express-generator
```

```
~$ express my-app
...
~$ cd my-app
~/my-app$ npm install
```
<!-- .element: class="fragment" -->

---

### A Scaffolded App

```no-highlight
my-app/
 |_ bin            # execution file (shell script)
 |_ node_modules
 |_ public         # images, css, fonts, etc
 |_ routes         # Node.js routing code
 |_ views          # server-side templates
 |_ app.js
 |_ package.json
```

---

### Running a Scaffolded App

```bash
~/my-app$ npm start
```

```js
{
  ...,
  "scripts": {
    "start": "node ./bin/www"
  },
  ...
```
<!-- .element: class="fragment" -->

---

## Configuring Express

---

## Configuring Express

```js
var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);
app.set('foo', 'bar');
```

```js
server.listen( app.get('port') );
```
<!-- .element: class="fragment" -->

---

## Request Routing

---

### Basic Routing

```js
var express = require('express');
var myApp = express();

myApp.get('/', function handleRoot(req, res, next) {
    res.send('Hello World!');
});

myApp.listen( 3000 );
```

---

### POST Routing

```js
myApp.post('/user', function createUser(req, res, next) {
    // Create the user record...
    
    res.redirect('/my-account');
});
```

---

### POST Routing

```js
myApp.post('/user', function createUser(req, res, next) {
    // Create the user record...
    
    // Where do we get the data from?
    
    res.redirect('/my-account');
});
```

---

## Middleware

---

![fit](/images/express-middleware.png)

---

### Middleware Examples

```js
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

// app config...

// Parse POST form data...
app.use( bodyParser.urlencoded({ extended: false }) );

app.post('/user', function createUser() {
    var user = {
        username: req.body.username,
        ...
    };
    ...
});
```

---

### Order Matters!

Middleware are executed in the order specified

```js
app.use( express.logger('dev') );

app.use( myAuthModule() );

app.use( bodyParser.json() );

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Routing middleware...
```
<!-- .element: class="fragment" -->

---

### Middleware - When does it end?

Middleware processing ends when `next()` is not called  
(or an error is generated)

```js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/about', function aboutUs(req, res, next) {
    
    res.send('We are StrongLoop!');
    
    // no call to next()
});

app.get('/user', ...);
```
<!-- .element: class="fragment" -->

---

### Custom Middleware

```js
app.use(function (req, res, next) {
    // Do some work...
    
    // Modify the req or res...

    // execute the callback when done
    next();
});
```

---

### Custom Middleware - Errors

```js
app.use(function (req, res, next) {
    // do something...

    if (thereWasAnError) {
        var err = new Error(' ... ');
        next( err );
        return;
    }

    // No error, so we proceed...
    
    next();
});
```

---

### Handling Middleware Errors

```js
app.use(function(err, req, res, next) {
    // Do whatever you need to...
    
    if (err.code === 404) {
        
        res.redirect('/error-404');
        
    } else {
        // Or you can keep processing this (or a new) Error
        next(err);
    }
});
```

---

![fit](/images/express-middleware-error.png)

---

### Handling Middleware Errors

**Always** set up a "catchall" error handler!

---

## Server-Side Templating

---

### Templates

Small blocks that we can plug data into at run-time

```jade
//- /views/index.jade
doctype html
html
    head
        title #{title}
    body
        section.main-body.clear
            #{homepageText}
```
<!-- .element: class="fragment" -->

---

### Templating Engine

```bash
~/my-app$ npm install --save jade
```

```js
var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');
```

---

### Using a template

```js
app.get('/' function handleRoot(req, res, next) {
    
    res.render('index', {
        title: 'StrongLoop - Home',
        homepageText: 'We all love StrongLoop!'
    });
    
});
```

---

## Don't Forget Your Modularity!

---

### Not Modular...

```js
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

// app config and other middleware...

app.post('/user', function createUser() {
    var user = {
        username: req.body.username,
        ...
    };
    
    db.create(user, function() {
        res.render('user/my-account', { ... });
    });
});
```

---

### The 4.0 Router Interface

```js
// in routes/users.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Get a list of users...
  res.render('user/list', { results: users });
});

router.get('/:id', function(req, res, next) {
  // Get a single user...
  res.render('user/my-account', { user: user });
});

router.post('/', function(req, res, next) {
  // Create a user...
  res.redirect('user/my-account', { user: user });
});

module.exports = router;
```

---

### The 4.0 Router Interface

```js
// in app.js
var express = require('express'),
    ...;

var app = express();

// app config and middleware...

app.use('/users', require('./routes/users'));
```

---

## Request Object

---

### Query Parameters

```js
app.get('/users', function (req, res, next) {
    
    var limit = req.query.limit || 10,
        users = [];

    // Retrieve all users...

    res.render('user/list', {
        results: users,
        nextIndex: 11
    });
});
```

---

### URL Parameters

```js
app.get('/users/:id', function (req, res, next) {
    
    var id = req.params.id,
        user = null;

    // Retrieve a single user...
    
    if (req.xhr) {
        res.json({ user: user });
    } else {
        res.render('user/single', {
            user: user
        });
    }
});
```

---

### URL Parameters

```js
app.get(/^\/users\/(\d+)$/, function (req, res, next) {
    
    var id = req.params[0],
        user = null;
        
    // Retrieve a single user...
    // ...
});
```

---

## Response Object

---

### Response Methods

* `response.send(data)` or `response.end(data)`

* `response.status(httpStatus)`

* `response.send(201, someData)`

* `response.sendfile('path/to/someFile.json')`

* `response.download('/report-12345.pdf')`

---

### HTTP Status Codes

* 2XX: for successfully processed requests
* 3XX: for redirections or cache information
* 4XX: for client-side errors
* 5XX: for server-side errors

---

# Questions?

### Node.js Architecture and
### Getting Started with Express.js

<br style='margin-top:2em'>

![{{speaker}}]()

Join us for more events!  
[strongloop.com/developers/events](https://strongloop.com/developers/events/)