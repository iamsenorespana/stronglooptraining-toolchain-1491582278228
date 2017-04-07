
![](/images/StrongLoop.png)

# Building Node Applications with Express.js

---

# Framework Patterns

---

## Patterns evolve to serve market needs

![](images/market-evolution.png)

^ nutshell: Java: good for desktop; PHP etc.: good for few requests, big pages; Node:
good for **many requests, small payloads**

---

## Framework Patterns

* KISS Servers: small core, small modules
<!-- .element: class="fragment" -->
* Convention: follow the leader, steep learning curve
<!-- .element: class="fragment" -->
* Configuration: open path, manual effort for advanced
<!-- .element: class="fragment" -->
* ORM & Isomorphic: model-driven, shared code, steep learning curve
<!-- .element: class="fragment" -->

---

## Framework Patterns

* KISS Servers: Node core
<!-- .element: class="fragment" -->
* Convention: Express, Restify, Total.js
<!-- .element: class="fragment" -->
* Configuration: Hapi, Kraken*
<!-- .element: class="fragment" -->
* ORM & Isomorphic: LoopBack, Sails, Meteor*
<!-- .element: class="fragment" -->

^Kraken actually builds an Express app using config files  
Meteor is the only framework here that actually uses the same JS files on both sides

---

## Express.js

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

^ 1. setup package.json; 2. add express dep...

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


^ Create server with one route ('/'), listen on port 8080; Start server...

---

### Scaffolding an Express App

---

### Scaffolding Express

Install the CLI generator

```no-highlight
~$ npm install -g express-generator
```

Run the generator
<!-- .element: class="fragment" data-fragment-index="1" -->
```no-highlight
~$ express my-app
```
<!-- .element: class="fragment" data-fragment-index="1" -->

Install from new (generated) package.json
<!-- .element: class="fragment" data-fragment-index="2" -->
```no-highlight
~$ cd my-app
~/my-app$ npm install
```
<!-- .element: class="fragment" data-fragment-index="2" -->

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

```no-highlight
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

^ `www` script sets port, error listener, debugger, & start server.

`app.js` **does not call app.listen** , it's *just* the server, not the
execution script as well (like in our helloworld example)

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

^ these are arbitrary keys\* used
to *safely* store data on `app` object & don't affect the app directly: ** `app.set('port',3000)` does not "do" anything on its own!!**

also note overloading of `app.get`

\\* some exceptions: `views` & `view engine`

---

## Middleware

---

![fit](/images/express-middleware.png)

^ `req` & `res` are passed from one middleware to the next, each of which
can augment or alter either, or perform side-effects

---

### Middleware Examples

```js
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

// app config...

// Parse POST form data...
app.use( bodyParser.urlencoded({ extended: false }) );

app.post('/user', function createUser(req, res, next) {
    var user = {
        username: req.body.username,
        // ...
    };
    // ...
});
```

^ note: `extended: false` tells bodyparser to use nodecore `querystring` & is
recommended (defaults to `true` for legacy reasons)

---

### Order Matters!

Middleware are executed in the order they are `use`d

```js
app.use( express.logger('dev') );

app.use( myAuthModule() );

app.use( bodyParser.json() );

app.use( bodyParser.urlencoded( { extended: false } ) );

app.use( express.static( path.join( __dirname, 'public' ) ) );

// Routing middleware...
```
<!-- .element: class="fragment" -->

^ `__dirname` = directory **this** file is in 

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

^ ("generated" = error thrown **or** passed to `next`)

---

## Useful Middleware Modules

* [body-parser](https://github.com/expressjs/body-parser) : request payload
* [serve-static](https://github.com/expressjs/serve-static)\* : static content
* [compression](https://github.com/expressjs/compression) : gzipping responses
* [cookie-parser](https://github.com/expressjs/cookie-parser) : Cookie parsing
* [cookie-session](https://github.com/expressjs/cookie-session) : Session via Cookies store
* [express-session](https://github.com/expressjs/session) : Session via in-memory or other store
* [errorhandler](https://github.com/expressjs/errorhandler) : Error handling

\* *bundled with core*

^ express scaffold/generator installed `body-parser` & `cookie-parser`

---

## Useful Middleware Modules

* [passport](https://github.com/jaredhanson/passport): Authentication library
* [morgan](https://github.com/expressjs/morgan) : logging
* [winston](https://github.com/bithavoc/express-winston) : more logging
* [csurf](https://github.com/expressjs/csurf) : CSRF prevention
* [serve-favicon](https://github.com/expressjs/serve-favicon) : favicon serving
* [method-override](https://github.com/expressjs/method-override) : HTTP method override
* [vhost](https://github.com/expressjs/vhost) : virtual hosts

^ express scaffold/generator installed `morgan`

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
* `request.hostname`: host without port number
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

^ "Why might we use this regexp instead of just `:id`?"

Note: you can also do `'/users/:id(\\d+$)/'` for named + regex

---

## Response Object

---

### Response Methods

* `response.send(data)`
* `response.set(headerName, headerValue)`
* `response.status(httpStatus)`
* `response.end()`
* `response.sendFile('file.json',`<br>&nbsp;&nbsp;&nbsp;`{ root: app.get('assetPath') })`
* `response.download('/report-12345.pdf')`

^ **Notice:** Some changes in 4.x! (combined--,
explicit++ e.g. `send(x).end()` vs. `end(x)`)

rel path: `sendFile('path/file.json', {root: assetsRoot })`

---

### HTTP Status Codes

* 2XX: for successfully processed requests
* 3XX: for redirections or cache information
* 4XX: for client-side errors
* 5XX: for server-side errors

^ client error: your request was bad

server error: something's wrong on our end

---

## Don't Forget Your Modularity!

---

### Not Modular...

```js
var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
// app config...
// add middleware...

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
//...
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

    // when done, execute the callback to run 'next middleware'
    next();
});
```

^ for any async operation, `next` would be called from the callback to that
operation

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
app.use(function handle404(err, req, res, next) {
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
    // --> handle immediately
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
    // --> create error & pass along to error handlers
    var err = new Error('Not Found');
    err.code = 404;
    next(err);
});
```

^ Alternative "pass error" approach; allows error handling logic to run (write
to log, send email, whatever the error behavior is) & removes responsibility of
"handling" 404 from app route

---

### Handling Middleware Errors

Because we can keep passing errors on and on, you should 
**always** set up a "catchall" error handler!

```js
app.use(function notFoundHandler(...) { ...  });
app.use(function someOtherHandler(...){ ... });

app.use(function catchallHandler(err, req, res, next) {
    // If we get here then the error has not been handled yet
    
    res.redirect('/server-error');
});
```

Note that you need **all 4 arguments** even if you don't call `next()`

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

^ express recognizes `'view engine'` `jade` & `require`s it automatically when
you call `res.render`

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

### Sessions

HTTP is a stateless protocol - information about a client is not retained over subsequent requests

Use sessions to overcome this problem

The `cookie-parser` `express-session` middlewares make it easy to work with cookies and
sessions, respectively

^ `cookie-parser` stores data (can be obfuscated/"signed") on browser

`express-session` only places one cookie to ID user, stores data on server

---

### Sessions

```js
var session = require('express-session');

app.use(session({ secret: 'notastrongsecret' }));
```

The session is now accessible via `request.session`

```js
app.get('/home', function (req, res) {
    req.session.someValue = 'abc123';
    //...
});
```

```js
app.get('/some/other/route', function (req, res) {
    console.log(req.session.someValue) // 'abc123'
    //...
});
```

^ sessions are store **in memory** by default. not meant for production

---

### What about a load-balance system?

---

### Redis Store with Express

```bash
~/my-app$ npm install --save connect-redis express-session
```

```js
var session = require('express-session'),
    RedisStore = require('connect-redis')(session);

app.use(session({
    store: new RedisStore(options),
    secret: 'keyboard cat'
}));
```

---

# fin
