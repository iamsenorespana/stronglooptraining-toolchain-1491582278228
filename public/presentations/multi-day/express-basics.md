
![](/images/StrongLoop.png)

# Introduction to Express.js

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
    res.end('Hello World!');
});

myApp.listen( 3000 );
```

<div class='fragment'>
    <pre><code>~/my-app$ node app.js</code></pre>
    <p>Now open http://localhost:3000 in a browser</p>
</div>

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

## Useful Middleware Modules

* [body-parser](https://github.com/expressjs/body-parser) : request payload
* [serve-static](https://github.com/expressjs/serve-static) : static content
* [compression](https://github.com/expressjs/compression) : gzipping responses
* [cookie-parser](https://github.com/expressjs/cookie-parser) : Cookie parsing
* [cookie-session](https://github.com/expressjs/cookie-session) : Session via Cookies store
* [express-session](https://github.com/expressjs/session) : Session via in-memory or other store
* [errorhandler](https://github.com/expressjs/errorhandler) : Error handling

---

## Useful Middleware Modules

* [passport](https://github.com/jaredhanson/passport): Authentication library
* [morgan](https://github.com/expressjs/morgan) : logging
* [winston](https://github.com/bithavoc/express-winston) : more logging
* [csurf](https://github.com/expressjs/csurf) : CSRF prevention
* [serve-favicon](https://github.com/expressjs/serve-favicon) : favicon serving
* [method-override](https://github.com/expressjs/method-override) : HTTP method override
* [vhost](https://github.com/expressjs/vhost) : virtual hosts

---

## Request Routing

---

### Basic Routing

```js
var express = require('express');
var myApp = express();

myApp.get('/', function handleRoot(req, res, next) {
    res.end('Hello World!');
});

myApp.listen( 3000 );
```

---

### POST Routing

```js
myApp.post('/user', function createUser(req, res, next) {
    // Audit the data...
    // Create the user record...
    
    // Now send the new user to their account page
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

## Request Object

---

### Request Header Shortcuts

* `request.get(headerKey)`: value for the header key
* `request.accepts(type)`: checks if the type is accepted
* `request.acceptsLanguage(language)`: checks language
* `request.acceptsCharset(charset)`: checks charset
* `request.ip`: IP address
* `request.path`: URL path
* `request.host`: host without port number
* `request.stale`: checks staleness
* `request.xhr`: true for AJAX-y requests
* `request.protocol`: returns HTTP protocol
* `request.secure`: checks if protocol is `https`
* `request.subdomains`: array of subdomains
* `request.originalUrl`: original URL

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

## Don't Forget Your Modularity!

---

### Not Modular...

```js
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

// app config and other middleware...

app.get('/', function serveRoot() {
    // ...
});
app.get('/user/:id', function findUser() {
    // ...
});
app.post('/user', function createUser() {
    // ...
});
app.post('/group', function createGroup() {
    // ...
});
```

---

### Modular Routing

---

### The 4.0 Router Interface

```js
// routes/users.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // Get a list of users...
});

router.get('/:id', function(req, res, next) {
  // Get a single user...
});

router.post('/', function(req, res, next) {
  // Create a user...
});

module.exports = router;
```

---

### The 4.0 Router Interface

```js
// app.js
var express = require('express');

var app = express();

// app config and middleware...

app.use('/users', require('./routes/users'));

app.use('/groups', require('./routes/groups'));

app.use('/widgets/foo', require('./routes/foo'));
```

---

### Custom Middleware

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

### Handling Errors from Middleware

```js
app.use(function(err, req, res, next) {
    // Do whatever you need to...
    
    if (err.code === 404) {
        
        res.redirect('/error-404.html');
        
    } else {
        // Or you can keep processing this (or a new) Error
        next(err);
    }
});
```

---

![fit](/images/express-middleware-error.png)

---

### Setting up a 404 Handler

```js
app.get('/foo', ...);
app.get('/bar', ...);
app.post('/bar', ...);
// ...

app.use(function(req, res, next) {
    // If we hit this route then the URL was not matched!
    res.redirect('/error-404.html');
});
```

Make sure this is the **last** route!!

---

### Setting up a 404 Handler

```js
app.get('/foo', ...);
app.get('/bar', ...);
app.post('/bar', ...);
// ...

app.use(function(req, res, next) {
    // If we hit this route then the URL was not matched!
    var err = new Error('Not Found');
    err.code = 404;
    next(err);
});
```

---

### Handling Middleware Errors

Because we can keep passing errors on and on, you should 
**always** set up a "catchall" error handler!

```js
app.use(function notFoundHandler(...) { ... });
app.use(function someOtherHandker(...) { ... });

app.use(function catchallHandler(err, req, res, next) {
    // If we get here then the error has not been handled yet
    
    res.redirect('/server-error');
});
```

Note that you need **all 4 arguments** even if you don't call `next()`

---

# fin