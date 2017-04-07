![](/images/StrongLoop.png)

# Building REST APIs in LoopBack

![{{speaker}}]()

---

<!-- .slide: data-background="white" -->

![fit](images/StrongLoop_Hyperscale.png)

---

<!-- .slide: data-background="white" -->

![fit](images/StrongLoop_who.png)

---

## Patterns and Frameworks

---

### Pattern #1: Convention

Express, Restify, Kraken

* No questions about "how to do it"
* Advanced features fit in easier
* Weaknesses
  * Can be Opinionated
  * Manual CRUD

---

### Pattern #2: Configuration

Hapi, LoopBack, Sails

* Lower learning curve
* Better documentation
* Weaknesses
  * Opinionated
  * Some Manual CRUD
  * Advanced functions can require more effort

---

### Pattern #3: Isomorphic

Meteor, flatiron, LoopBack

* Sharing of Code (Client & Server)
* Automatic endpoint generation & routing
* Weaknesses
  * High learning curve
  * Custom front-end code sometimes still required

---

### Pattern #4: ORM & MBaaS

LoopBack, Sails

* Model Driven Development
  * Multiple data sources
* Possible to have Isomorphic JS
* Automatic REST endpoint generation
  * Includes routing & CRUD
* Weaknesses
  * Non-data-backed APIs require effort
  * Can be opinionated, but not always

---

<!-- .slide: data-background="white" -->

![](/images/loopback.png)

Open source REST API framework based on Express.js

---

<!-- .slide: data-background="white" -->

![fit](/images/loopback-high-level.png)

---

## LoopBack Features

* Model-driven API development
* Dynamic REST API endpoint generation
* Connect to any datasource (SQL, NoSQL, REST, SOAP)
* Rich model relations
* Access controls (built in token authentication)
* Geolocation, push notifications, offline sync
* Angular, Android, and iOS SDKs

---

## Step 1: Install StrongLoop Tools

```bash
~$ npm install -g strongloop
```

<div class='fragment' style='margin-top:1em;'>
    <p>And scaffold your application:</p>

    <pre><code>~$ slc loopback</code></pre>
</div>

---

### Application Scaffolding

1. Initialize project folder structure
1. Creating default JSON config files
1. Creating default JavaScript files
1. Install initial dependencies

---

### What do we have?

```no-highlight
my-app/
 |_ client         # used for client app (if any)
 |_ node_modules
 |_ server
   |_ boot                   # app startup scripts
   |_ component-config.json  # primary API config
   |_ config.json            # primary API config
   |_ datasources.json       # data source config
   |_ middleware.json        # middleware config
   |_ model-config.json      # LB model config
   |_ server.js              # Server start script
 |_ package.json
```

---

### Basic config

```js
{
  "restApiRoot": "/api",
  "host": "0.0.0.0",
  "port": 3000,
  "remoting": {
    "context": {
      "enableHttpContext": false
    },
    "rest": {
      "normalizeHttpPath": false,
      "xml": false
    },
    "json": { ... },
    "urlencoded": { ... },
    "cors": false,
    "errorHandler": {
      "disableStackTrace": false
    }
  }
}
```

^enableHttpContext — pass HTTP context to nested layers
normalizeHttpPath - "MyClass" or "My_class" becomes "my-class".
json strict - Parse only objects and arrays.
json limit - Maximum request body size.
urlencoded extended - qs module
urlencoded limit - Maximum request body size.
cors -  Access-Control-Allow-Credentials CORS (Cross-Origin Resource Sharing) header
errorHandler - Set to true to disable stack traces

---

### Environment-specific configuration

Simply rename your config file to:

`config.[ENV].json`

With `[ENV]` referring to the value of `process.env.NODE_ENV`!

Also works with datasources.json and middleware.json!
<!-- .element: class="fragment" -->

---

# Working with Data Models

---

## Creating Models

Different ways...

1. UI: `~/my-app$ slc arc` and Composer.
1. CLI: `~/my-app$ slc loopback:model`.
1. Config files in `/common/models`, etc
1. Programmatically in a boot script
1. Programmatically with model discovery from data source

---

## Composer

![fit](/images/composer.png)

---

## Creating a Model via CLI

```bash
$ slc loopback:model
[?] Enter the model name: CoffeeShop
[?] Select the data-source to attach CoffeeShop to: (Use arrow keys)
❯ db (memory)
[?] Select model's base class: (Use arrow keys)
  Model
❯ PersistedModel
  ACL
[?] Expose CoffeeShop via the REST API? (Y/n) Y
[?] Custom plural form (used to build REST URL):  
```

^At this point, only the default in-memory data source is available. PersistedModel is the base object for all models connected to a persistent data source such as a database.

---

## Creating a Model via CLI

```
[?] Property name: name
   invoke   loopback:property
[?] Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  (other)
[?] Required? (y/N)
```

^Right now, you're going to define one property, "name," for the CoffeeShop model.

---

### Model Config

```js
{
  "name": "CoffeeShop",
  "base": "PersistedModel",
  "idInjection": true,
  "properties": {
    "name": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": []
}
```

---

## Run the Application

```
~/my-app$ node server/server.js
Web server's listening at http://localhost:3000
Browse your REST API at http://localhost:3000/explorer
```

---

### What is this?

<http://localhost:3000>

```no-highlight
{ started: "2015-04-19T19:32:17.263Z", uptime: 5.001 }
```

This is the default "root page", which displays API status.

Remember, our API is server from the `/api` path!

---

### The CoffeeShop Route

<http://localhost:3000/api/CoffeeShops>

```no-highlight
[]
```

We don't have any coffee shops yet, but there we go!

---

<!-- .slide: data-background="white" -->

## Using the API Explorer:

![inline](/images/lb-explorer.png)

---

## Models REST API Endpoints

---

<!-- .slide: data-background="white" -->

![inline](/images/lb-coffeeshop-rest.png)

^ Show the swgger UI, walk through various endpoints and try them out!
Be sure to mention how we're using in-memory DB!

---

# Model Config Detail

```js
{
  "name": "Person",     // Name of the model
  "description": "A Person model representing our people.",
  "base": "User",       // Parent model
  "idInjection": false, // id property is added to the model automatically or not
  "strict": true,       // the model accepts only predefined properties or not
  "options": { ... },   // data source-specific options
  "properties": { ... },
  "hidden": [...],      // hide data from HTTP response
  "validations": [...],
  "relations": {...},
  "acls": [...],
  "scopes": {...},      // define named queries for models
  "indexes" : { ...},
  "http": { "path": "/foo/mypath" },
  "plural": "People"
}
```

---

## Querying Data Models

From a script:

```js
CoffeeShop.find(
    { where: { name: 'Brew' }, limit: 3 },
    function(err, shops) {
        // ...
    }
);
```

Or over HTTP:

```
/CoffeeShops?filter=[where][name]=Brew&filter[limit]=3
/CoffeeShops?filter={"where":{"name":"Brew"},"limit":3}
```

---

# Working with Data Sources

---

<!-- .slide: data-background="white" -->

![fit](/images/loopback-connector-list.png)

---

## Datasource Definition

1. Arc
1. CLI: `$ slc loopback:datasource`
1. Programmatically

---

### In Arc

![inline](/images/datasourcec-ui.png)

---

### Via CLI (and code)

1. `~/my-app$ slc loopback:datasource`
1. Edit `server/datasources.json` with connection info
1. Install the connector with npm
1. Update model-config as needed
1. Install connector module:

```
~/my-app$ npm install --save loopback-connector-mongodb
```

---

### StrongLoop Supported Connectors

* MongoDB
* MySQL
* Oracle
* Postgres
* MSSQL

---

### More LoopBack connectors (3rd patry)

Kafka, Elastic Search, CouchDB, Neo4j, RethinkDB, Riak, etc, etc, etc

<https://github.com/pasindud/awesome-loopback>

---

### Configuring the Datasource

```js
{
  "mdb": {
    "name": "mongodb_dev",
    "connector": "mongodb",
    "host": "127.0.0.1",
    "database": "devDB",
    "username": "devUser",
    "password": "devPassword",
    "port": 27017
  }
}
```

---

## Using the REST Connector

The LoopBack REST connector enables applications to interact with other REST APIs using a template-driven approach

---

### REST DataSource

```js
"geoRest": {
  "name": "geoRest",
  "connector": "rest",
  "operations": [{
    "template": {
      "method": "GET",
      "url": "http://maps.googleapis.com/maps/api/geocode/{format=json}",
      "headers": {
        "accepts": "application/json",
        "content-type": "application/json"
      },
      "query": {
        "address": "{street},{city},{zipcode}",
        "sensor": "{sensor=false}"
      },
      "responsePath": "$.results[0].geometry.location"
    },
    "functions": {
      "geocode": ["street", "city", "zipcode"]
    }
  }]
}
```

---

### Using a REST Datasource

Once you connect a model to a datasource (in `model-config.json`):

```js
"Widget": {
    "dataSource": "geoRest",
    "public": true
}
```

You can call the function:

```js
Widget.geocode('107 S B St', 'San Mateo', '94401', function(res) {
    // ... handle the response
});
```

---

## Relationship Modeling

---

### Various Relationship Types

* BelongsTo relations
* HasMany relations
* HasManyThrough relations
* HasAndBelongsToMany relations
* Polymorphic relations
* Embedded relations (embedsOne and embedsMany)

---

### Relationship Definition

```js
// common/models/author.json
{
  "name": "Author",
  // ...,
  "relations": {
    "books": {
      "type": "hasMany",
      "model": "Book"
    }
  }
}
```

---

### BelongsTo Relationships (Ownership)

```js
// common/models/book.json
{
  "name": "Book",
  // ...,
  "relations": {
    "author": {
      "type": "belongsTo",
      "model": "Author",
      "foreignKey": "writerId"
    }
  }
}
```

---

## Many to Many

<img src='/images/has-many-through.png' style='width:85%'>

---

### Many to Many

```js
{  
  "name": "Physician",
  // ...,
  "relations": {
    "patients": {
      "type": "hasMany",
      "model": "Patient",
      "through": "Appointment"
    }
  }
}
```

```js
{  
  "name": "Patient",
  // ...,
  "relations": {
    "physicians": {
      "type": "hasMany",
      "model": "Physician",
      "through": "Appointment"
    }
  }
}
```

---

### Many to Many

```js
{  
  "name": "Appointment",
  // ...,
  "properties": {
    "appointmentDate": {
      "type": "date"
    }
  },
  "relations": {
    "physician": {
      "type": "belongsTo",
      "model": "Physician",
      "foreignKey": "physicianId"
    },
    "patient": {
      "type": "belongsTo",
      "model": "Patient",
      "foreignKey": "patientId"
    }
  }
}
```

---

# Data Validation

---

## Using Built-in Methods

```js
CoffeeShop.validates[Method](
    'property',
    {
        option: value,
        message: 'What to tell the user...'
    }
);
```

---

## Using Built-in Methods

```js
// common/models/coffee-shop.js

CoffeeShop.validatesPresenceOf('name', 'address');

CoffeeShop.validatesLengthOf('name',{
    min: 5,
    max: 100,
    message: {
        min: 'Name is too short',
        max: 'Name is too long'
    }
});

CoffeeShop.validatesInclusionOf('beverages', {
    in: [ 'coffee', 'tea', 'juice', 'soda' ]
});
```

---

## Custom Validation

```js
CoffeeShop.validate('openingHour', hourCheck, {
    message: 'Opening hour must be before closing hour'
});

function hourCheck(errCallback) {
    if (this.openingHour > this.closingHour) {
        errCallback();
    }
});
```

---

## Data Validation

Validation will automatically occur on "upsert"!

But you can also call it directly:

```js
if (!CoffeeShop.isValid()) {
    // do something?
}
```

---

# Authentication and Authorization

---

## LoopBack Authentication & Authorization

* Principal
* Role
* RoleMapping
* ACL

---

### Principals

An entity that can be identified or authenticated

* A user
* An application
* A role

^ Represents identities of a request to protected resources.

---

### Role

A group of principals with the same permissions

Some dynamic roles are included:

* $everyone
* $unauthenticated
* $authenticated
* $owner

^ Organizes principals into groups so they can be used.

---

### Access Control Layers

Define access a principal has to a certain operation against a model.

* Deny everyone to access the model
* Allow '$authenticated' role to create model instances
* Allow '$owner' to update an existing model instance

This is an example of "whitelisting", and is safer than excluding operations.

---

### Defining an ACL

Use `slc loopback`, but this time you'll use the `acl` sub-command:

```
$ slc loopback:acl
```

---

### Defining an ACL

Deny everyone all endpoints:

```bash
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: All users
? Select the permission to apply: Explicitly deny access
```

---

### Defining an ACL

Now allow everyone to find CoffeeShops:

```bash
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: Read
? Select the role: All users
? Select the permission to apply: Explicitly grant access
```

---

### Defining an ACL

Allow authenticated users to create CoffeeShops

```bash
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: A single method
? Enter the method name: create
? Select the role: Any authenticated user
? Select the permission to apply: Explicitly grant access
```

---

### Defining an ACL

Enable the creator ("$owner") to make changes:

```bash
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: Write
? Select the role: The user owning the object
? Select the permission to apply: Explicitly grant access
```

---

## Creating New Roles

```javascript
module.exports = function(app) {

    app.models.Role.create({
        
        name: 'admin'
        
    }, function(err, theAdminRole) {
        if (err) { cb(err); }
        
        // Maybe add some users to it?
    });
    
};
```

Typically this is done in a boot script.

---

### Adding Users to a custom role

```js
theAdminRole.principals.create({
    
    principalType: app.models.RoleMapping.USER,
    principalId: someUser.id
    
}, function(err, principal) {
    // handle the error!
    cb(err);
});
```

---

### Using the New Role in ACL

```javascript
// in common/models/coffee-shop.json
"acls": [
  {
    "accessType": "EXECUTE",
    "principalType": "ROLE",
    "principalId": "admin",
    "permission": "ALLOW",
    "property": "create"
  }
]
```

^ Now you can use the role defined above in the access controls. For example, add the following to common/models/project.json to enable users in the "admin" role to call all REST APIs.

---

## Advancing Your API

---

### Remote Methods

A way to create new, non-CRUD methods on your model.

---

### Remote Methods

```js
// common/models/person.js

module.exports = function(Person){
    Person.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Person.remoteMethod(
        'greet',
        {
          accepts: { arg: 'msg', type: 'string', http: { source: 'query' } },
          returns: { arg: 'greeting', type: 'string' }
          http: [
            { verb: 'get', path: '/greet' }
          ]
        }
    );
};
```

---

### Remote Methods

Now, for example, a request to `GET /api/persons/greet?msg=John` will return:

```
{ greeting: "Greetings... John!" }
```

---

## Remote and Operation Hooks

---

## Hooks

LoopBack provides two kinds of hooks:

1. **Remote Hooks**: execute before or after a remote method is called.
1. **Operation Hooks**: execute when models perform CRUD operations.

_NOTE: Operation hooks replace model hooks, which are now deprecated._

---

### Remote Hooks

A remote hook enables you to execute a function before or after a remote method is called by a client:

* `beforeRemote()` runs before the remote method.
* `afterRemote()` runs after the remote method has finished successfully.
* `afterRemoteError()` runs after the remote method has finished with an error.

---

### Remote Hooks

Both `beforeRemote()` and `afterRemote()` have the same signature; below syntax uses beforeRemote but afterRemote is the same:

```js
Person.afterRemote( 'create', function( ctx, modelInstance, next) {
  // do some stuff... maybe send them a nice email?
  
  next();
}
```

---

### Context AccessToken

The `accessToken` of the user calling the remote method.

`ctx.req.accessToken` is undefined if the remote method is not invoked by a logged in user (or other principal).

You can use `ctx.req.accessToken.userId` to find the currently logged in user (if there is one).

---

## Middleware

---

### Introduction to Middleware

LoopBack is built on Express, which uses "Connect" style middleware.

![](/images/express-middleware.png)

---

### LoopBack Phases

LoopBack defines a number of phases, corresponding to different aspects of
application execution.

Use these phases to define where your middleware should be inserted!

This is necessary since middleware fires in the order it is added.

---

### LoopBack Phases

1. `initial`
1. `session`
1. `auth`
1. `parse`
1. `routes`
1. `files`
1. `final`

---

### LoopBack Phases

Each phase has "before" and "after" subphases in addition to the main phase, encoded following the phase name, separated by a colon. For example, for the "initial" phase, middleware executes in this order:

* `initial:before`
* `initial`
* `initial:after`

^Middleware within a single subphase executes in the order in which it is registered. However, you should not rely on such order. Always explicitly order the middleware using appropriate phases when order matters.

---

### Defining Middleware

function which accepts 3 arguments (4 if error-handling):

```js
function myMiddlewareFunc([err,] req, res, next) {
    // do some stuff
    
    next();
    // next(new Error());  // if there is an error during processing
};
```

---

### Defining Middleware

You might want to use a factory for this function to encapsulate any options:

```js
module.exports = function(options) {

  return function myMiddleware(req, res, next) {
    // ...
    next();
  }
  
}
```

---

### Registering Middleware

```js
// server/middleware.json
{
  // ...,
  "auth": {
    "../server/middleware/logger": {
      "enabled": true
    }
  },
  // ...
}
```

---

### Registering Middleware

Additionally, you can use the shorthand format `{module}#{fragment}` where fragment is:

* A function exported by `{module}`
* A JS file in `{module}/server/middleware/` directory
* A JS file in `{module}/middleware/`

---

### Middleware configuration properties

You can specify the following properties in each middleware section:

```js
"../server/middleware/logger": {
    "enabled": true,
    "params": { "some": "option" },
    "paths": "/foo/bar"
}
```

^ enabled: Whether to register or enable the middleware. You can override this property in environment-specific files, for example to disable certain middleware when running in production.
params: Parameters to pass to the middleware handler (constructor) function. Most middleware constructors take a single "options" object parameter; in that case the params value is that object.
To specify a project-relative path (for example, to a directory containing static assets), start the string with the prefix $!. Such values are interpreted as paths relative to the file middleware.json.
paths:Specifies the REST endpoint that triggers the middleware. In addition to a literal string, route can be a path matching pattern, a regular expression, or an array including all these types.

---

### Registering Middleware

We can also register middleware in JavaScript code (a boot script perhaps):

```js
app.middleware('routes:before', require('morgan')('dev'));
app.middleware('routes:after', '/foo', require('./foo/routes'));
app.middleware('final', errorhandler());
```

---

# Thank You!

### Questions?

### Introduction to LoopBack

<br style='margin-top:1.5em'>

![{{speaker}}]()

Join us for more events!  
[strongloop.com/developers/events](https://strongloop.com/developers/events/)
