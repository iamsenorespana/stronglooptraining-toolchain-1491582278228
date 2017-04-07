
![](/images/StrongLoop.png)

# Building REST APIs with LoopBack.io

---

## What is a REST API?

REpresentational State Transfer (REST) is an architectural pattern for developing network applications.
<!-- .element: class="fragment" -->

REST APIs build off this concept, organizing data into resources accessed via common HTTP verbs.
<!-- .element: class="fragment" -->

---

### HTTP Verbs

```no-highlight
GET
PUT
POST
DELETE
```

```no-highlight
PATCH
HEAD
OPTIONS
```
<!-- .element: class="fragment" -->

^
- PATCH: like put
- HEAD: headers only
- OPTIONS: "Return available HTTP methods and other options"

---

### HTTP Verbs and endpoints

```no-highlight
POST   /Resource    -- create a "Resource"
GET    /Resource    -- list this type of record
GET    /Resource/13 -- retrieve record with id 13
PUT    /Resource/13 -- update record with id 13
DELETE /Resource/13 -- delete record with id 13
```

```no-highlight
GET    /Resource/13/groups -- retrieve groups attached to Resource 13
DELETE /Resource/13/groups -- delete groups associated w/ Resource 13
```
<!-- .element: class="fragment" -->

---

### HTTP Status Codes

* 2XX: for successfully processed requests
* 3XX: for redirections or cache information
* 4XX: for client-side errors
* 5XX: for server-side errors

---

<!-- .slide: data-background="white" -->

![fit](/images/rest-roundup.png)

---

## Choosing a Framework

---

## Pattern #1: Convention

Express, Restify, Kraken

* No questions about "how to do it"
* Advanced features fit in easier
* Weaknesses
  * Can be Opinionated
  * Manual CRUD

---

## Pattern #2: Configuration

Hapi, LoopBack, Sails

* Lower learning curve
* Better documentation
* Weaknesses
  * Opinionated
  * Some Manual CRUD
  * Advanced functions can require more effort

---

## Pattern #3: Isomorphic

Meteor, flatiron, LoopBack

* Sharing of Code (Client & Server)
* Automatic endpoint generation & routing
* Weaknesses
  * High learning curve
  * Custom front-end code sometimes still required

---

## Pattern #4: ORM & MBaaS

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

## LoopBack

Open source REST API framework based on Express.js

^Express.js doesn't have models / database layer

---

<!-- .slide: data-background="white" -->

![fit](/images/loopback-high-level.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/micro-services.png)

---

## LoopBack Features

* Model-driven API development
* Dynamic REST API endpoint generation
* Connect to any data source (SQL, NoSQL, REST, SOAP)
* Rich model relations
* Access controls (built in token authentication)
* Geolocation, push notifications, offline sync
* Angular, Android, and iOS SDKs

^ model-driven = models represent not just the data/entity but the *actions* that entity can
perform (allows code generation)

"connect to any": models abstract away datasource; app can **transparently**
build relationships bt models backed by MySQL, Mongo, and a REST
service <-- normally pretty complicated

---

<img src='/images/lb-modules.png' alt='LoopBack Architecture' style='width: 76%; margin-top: -5%;'>

---

## Your first LoopBack API

Coffee shop review application!

---

## Install StrongLoop Tools

```bash
~$ npm install -g strongloop
```

<div class='fragment' style='margin-top:1em;'>
    <p>And create your application:</p>

    <pre><code class="lang-bash">~$ slc loopback my-app</code></pre>
</div>

---

### Application Scaffolding

1. Initializes project folder structure
1. Creates default JSON config files
1. Creates default JavaScript files
1. Installs initial dependencies

^ tool is "LoopBack Generator"

---

### What do we have?

```no-highlight
my-app/
 |_ client                  # used for client app (if any)
 |_ node_modules
 |_ package.json
 |_ server
   |_ boot                  # app startup scripts
   |_ component-config.json # loopback component (plugin) config
   |_ config.json           # primary API config
   |_ datasources.json      # data source config
   |_ middleware.json       # middleware config
   |_ middleware.production.json # ENV specific middleware config
   |_ model-config.json     # LB model config
   |_ server.js             # Server start script
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
  },
  "legacyExplorer": false
}
```

^
- enableHttpContext — pass HTTP context to nested layers
- normalizeHttpPath - "MyClass" or "My_class" becomes "my-class".
- json strict - Parse only objects and arrays.
- json limit - Maximum request body size.
- urlencoded extended - qs module
- urlencoded limit - Maximum request body size.
- cors -  Access-Control-Allow-Credentials CORS (Cross-Origin Resource Sharing) header
- errorHandler - Set to true to disable stack traces
- legacyExplorer - /models and /routes that are exposed, but no longer used by API
Explorer; `true` enables them

---

### Environment-specific configuration

Simply rename your config file to:

`config.[ENV].json`

With `[ENV]` referring to the value of `process.env.NODE_ENV`!

Also works with datasources.json and middleware.json!
<!-- .element: class="fragment" -->

^ see `middleware.production.json` in scaffolded app

---

### Dynamic Config

You can use `.js` files instead of JSON for config:

```js
// config.js

var common = require('./common-config.json');

module.exports = {
  "restApiRoot": common.root,
  "host": "127.0.0.1",
  "port": common.port,
};
```

---

# Working with Data Models

---

## Creating Models

Different ways...

1. UI: `~/my-app$ slc arc` and Composer.
1. CLI: `~/my-app$ slc loopback:model`.
1. Manually: create config files in `/common/models`, etc.
1. Programmatically: in a boot script
1. Programmatically: with model discovery from data source

---

## Composer

![fit](/images/composer.png)

---

## Creating a Model via CLI

```no-highlight
$ slc loopback:model
? Enter the model name: CoffeeShop
? Select the data-source to attach CoffeeShop to: (Use arrow keys)
  (no data-source)
❯ db (memory)
? Select model's base class: (Use arrow keys)
  Model
❯ PersistedModel
  ACL
  [...]
? Expose CoffeeShop via the REST API? (Y/n) Y
? Custom plural form (used to build REST URL):  
```

^At this point, only the default in-memory data source is available. PersistedModel is the base object for all models connected to a persistent data source such as a database.

Note **"Move up and down to reveal more choices"**!

---

## Creating a Model via CLI

```no-highlight
? Property name: name
  invoke   loopback:property
? Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  (other)
? Required? Yes
```

^Right now, you're going to define one property, "name," for the CoffeeShop model.

---

### Model Config

```js
{
  "name": "CoffeeShop",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpset": true
  },
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

```no-highlight
~/my-app$ node server/server.js
Web server listening at http://0.0.0.0:3000
Browse your REST API at http://0.0.0.0:3000/explorer
```

^ Note: `0.0.0.0` is ~basically~ the same as `localhost`.

Following slides use `localhost`

---

### What is this?

<http://localhost:3000>

```no-highlight
{ started: "2015-04-19T19:32:17.263Z", uptime: 5.001 }
```

This is the default "root page", which displays API status.

Remember, our API is served from the `/api` path!

^ useful for tools that monitor uptime/outages (hit all API instances
every 5 min & check uptime, alert if down etc.)

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

## Models' REST API Endpoints

---

<!-- .slide: data-background="white" -->

![fit](/images/lb-coffeeshop-rest.png)

^
- Show the Swagger UI, walk through various endpoints and try them out!
- Be sure to mention how we're using in-memory DB!
- Optionally: show swagger json: http://localhost:3000/explorer/swagger.json

---

# Model Config Detail

```no-highlight
{
  "name": "Person",     // Name of the model
  "description": "A Person model representing our people.",
  "base": "User",       // Parent model
  "idInjection": false, // automatically add id property?
  "strict": true,       // restrict input to predefined properties?
  "options": { ... },   // data source-specific options
  "properties": { ... },
  "hidden": [...],      // properties to omit from HTTP response
  "validations": [...], // [[future feature]]
  "relations": {...},   // define relationships with other models
  "acls": [...],        
  "scopes": {...},      // define named queries for models
  "indexes" : {...},    // declare indexes for database
  "http": { "path": "/foo/mypath" }, //custom API endpoint
  "plural": "People"
}
```

^
- Scopes: `"teachers": {"where": {"job_title": "teacher"}},
Note (later) that this is 100% diff. from Oauth scopes or ACL "scope" (from
`loopback:acl`
- Validations: not currently implemented, validate in code

---

## Built-in Models

* Application
* User
* Role
* RoleMapping
* AccessToken
* Email
* (and more!)

^
- **Application model** - contains metadata for a client application that has its own identity and associated configuration with the LoopBack server.
- **User model** - register and auth users locally or against third-party services.
(extend this for *your* user model)

---

## Querying Data Models

From a script:

```
CoffeeShop.find(
    { where: { name: 'Brew' }, limit: 3 },
    function(err, shops) {
        // ...
    }
);
```

Or over HTTP:

```
/CoffeeShops?filter[where][name]=Brew&filter[limit]=3
/CoffeeShops?filter={"where":{"name":"Brew"},"limit":3}
```

^ Note in `[bracket]` version, each filter is **a differently named URL query
param**

`filter[where][name]` vs.

`filter[limit]`

---

# Working with Data Sources

---

<!-- .slide: data-background="white" -->

![fit](/images/loopback-connector-list.png)

---

## Data source Definition

1. Arc
1. CLI: `$ slc loopback:datasource`
1. Programmatically (e.g. in a boot script)

---

### In Arc

![inline](/images/datasourcec-ui.png)

---

### Via CLI (and code)

1. `~/my-app$ slc loopback:datasource`
1. Edit `server/datasources.json` with connection info
1. Install the connector with npm
1. Update model-config as needed

```no-highlight
~/my-app$ npm install --save loopback-connector-mongodb
```

---

### StrongLoop Supported Connectors

* MongoDB
* MySQL
* Oracle
* PostgreSQL
* Redis
* MSSQL

^ Redis connector is "experimental" but it's 'officially supported' for paying
customers - *fall 2015*

---

### More LoopBack connectors (3rd patry)

Kafka, Elastic Search, Couchbase, Neo4j, RethinkDB, Riak, etc, etc, etc

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

^ `mongodb_dev` name is arbitrary. name enables multiple named `mongodb`
connections in 1 app (different models using different connections)

---

### MongoDB Tips

Customize collection in a model<br>
(`/common/models/model-name.json`):

```js
{
  "name": "Post",
  "mongodb": {
    "collection": "PostCollection"
  },
  "properties": {
    ...
  }
}
```

^ defaults to model name, camel, singular (`CoffeeShop`)

---

### MongoDB Tips

Replica set:

```js
{
    "connector": "mongodb",
    "url": "mongodb://example1.com,example2.com,example3.com/?readPreference=secondary"
}
```

<http://docs.strongloop.com/display/public/LB/MongoDB+connector>

---

## Using the MySQL Connector

---

### Discovery

1. Discovery methods (API)
1. Or via StongLoop Arc

^The same discovery API is available when using connectors for Oracle, MySQL, PostgreSQL, and SQL Server.

Discovery = "generate loopback model based on DB table/schema"

---

Discovery method example:

```js
var loopback = require('loopback');
var datasource = loopback.createDataSource(...)
dataSource.discoverSchema('INVENTORY', {owner: 'STRONGLOOP'}, function (err, schema) {
  // ...
}
```

^ Oracle-y language used here. to clarify:
- 'STRONGLOOP' = `owner` = database name
- 'INVENTORY' = model name = table name (assuming default table names);

This would typically be done in a boot script

---

### Data Mapping

LoopBack to MySQL:

* String, JSON: VARCHAR
* Boolean: TINYINT(1)
* Date: DATETIME
* Text:  TEXT
* Number:  INT
* GeoPoint: object POINT
* Enum: ENUM

---

### Data Mapping

MySQL to LoopBack:

* CHAR:  String
* CHAR(1): Boolean
* VARCHAR, MEDIUMTEXT, LONGTEXT, ENUM, SET: String
* TINYBLOB, LONGBLOB, BLOB, BINARY, VARBINARY, etc: Buffer
* SMALLINT, INT, YEAR, FLOAT, DOUBLE, DECIMAL, etc: Number
* DATE, TIMESTAMP, DATETIME:  Date

---

## Using the Oracle Connector

Install:

`$ npm install loopback-connector-oracle --save`

---

`/server/datasources.json` example:

```js
{
  "demoDB": {
    "connector": "oracle",
    "minConn":1,
    "maxConn":5,
    "incrConn":1,
    "timeout": 10,
    ...
  }
}
```

---

`/common/models/inventory.json` example:

```js
{
  "name":"Inventory",
  "options":{
    "idInjection":false,
    "oracle":{
      "schema":"STRONGLOOP",
      "table":"INVENTORY"
    }
  },
  "properties":{
    "productId":{
      "type":"String",
      "required":true,
      "length":20,
      "id":1,
      "oracle":{
        "columnName":"PRODUCT_ID",
        "dataType":"VARCHAR2",
        "dataLength":20,
        "nullable":"N"
      }
    },
  ...
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

^ `format` defaults to `json` & is not used by this function (ditto `sensor`),
but another function could specific 'format' or 'sensor' arguments to alter the
template

---

### REST DataSource

Options can be at the datasource level...

```js
{
  "connector": "rest",
  "debug": false,
  // ...
  "options": {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json"
    },
    "strictSSL": false,
  }
}
```

---

### REST DataSource

...Or options can be at the operation level:

```js
{
  // ...
  "operations": [
    {
      "template": {
        "method": "GET",
        "url": "http://maps.googleapis.com/maps/api/geocode/{format=json}",
        "query": {
          "address": "{street},{city},{zipcode}",
          "sensor": "{sensor=false}"
        },
        "options": {
          "strictSSL": true,
          "useQuerystring": true
        },
        "responsePath": "$.results[0].geometry.location"
      },
      // ...
  ],
  // ...
}
```

---

### Using a REST Datasource

Once you connect a model to a datasource<br>
(in `model-config.json`):

```js
"Widget": {
    "dataSource": "geoRest",
    "public": true
}
```

You can call the function:

```js
Widget.geocode('107 S B St', 'San Mateo', '94401', function(err, res) {
    // ... handle the response
});
```

---

## Using the SOAP Connector

The SOAP connector enables LoopBack applications to interact with SOAP-based web services described using WSDL.

Install:

```no-highlight
$ npm install loopback-connector-soap --save
```

---

### SOAP Connector Data Source

```js
  "soap-test": {
    "name": "soap-test",
    "connector": "soap",
    "wsdl": "http://www.webservicex.net/stockquote.asmx?WSDL",
    "url": "http://www.webservicex.net/stockquote.asmx",
    //...
```

^The url to WSDL. The service endpoint

---

### SOAP Connector Data Source

```js
    //...
    "operations": {
      "stockQuote": {
        "service": "StockQuote",
        "port": "StockQuoteSoap",
        "operation": "GetQuote"
      },
      "stockQuote12": {
        "service": "StockQuote",
        "port": "StockQuoteSoap12",
        "operation": "GetQuote"
      }
    }
    //...
```

^Map SOAP service/port/operation to Node.js methods. The key is the method name. The key is the method name

---

## Using the Storage Service

LoopBack storage component provides Node.js and REST APIs to manage binary contents using pluggable storage providers, such as local file systems, Amazon S3, or Rackspace cloud files.

^ "binary content" ~= "files" (we're talking about file storage)

---

Install:

```no-highlight
$ npm install loopback-component-storage --save
```

^ Note: **Storage Service** has been renamed **Storage Component** at top
(package) level, but `..Service` name still pervades API. They are the same

---

### Storage Service Data Source

```js
//...
"myStorageDataSource": {
   "name": "myStorageDataSource",
   "connector": "loopback-component-storage",
   "provider": "amazon",
   "key": "your amazon key",
   "keyId": "your amazon key id"
 }
//...
```

---

### Storage Service Operations

* `storageService.upload(req, res, cb)`  
Upload one or more files into the specified container.  
The request body must use multipart/form-data which the file input type for HTML uses.

* `storageService.download(container, file, res, cb)`  
Download a file within specified container.

<http://apidocs.strongloop.com/loopback-component-storage/>

^Once you create a model, it will provide both a REST and Node API, as described in the following table

---

# Relationship Modeling

---

## Various Relationship Types

1. `belongsTo` relations
1. `hasMany` relations
1. `hasManyThrough` relations
1. `hasAndBelongsToMany` relations
1. Polymorphic relations
1. Embedded relations (`embedsOne` and `embedsMany`)

---

## Relationship definition

You can define models relations in the Model definition JSON file or in JavaScript code.

```js
{
  "name": "Author",
  // ...
  "relations": {
    "books": {
      "type": "hasMany",
      "model": "Book"
    }
  }
}
```

^ relationships get called "relations" in `slc loopback:` & in `Model.json`

---

### belongsTo Relationships (ownership)

```js
{
  "name": "Book",
  // ...
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

## Relationship Scope

A way to restrict the related models when being queried

^ just as a model can have its own "scopes" (query fn's with predefined filters) it can have
'scoped' relationships (relationships with predefined filters)

---

## Relationship Scope

Define relationship to `Product` named `'shoes'`: only return `Product`s of type `shoe`

```js
Category.hasMany(Product, {
    as: 'shoes',
    scope: { where: { type: 'shoe' } }
});
```

```no-highlight
/api/Categories?filter={"include":"shoes"}
```
<!-- .element: class="fragment" -->

---

## Many to Many

![](/images/has-many-through.png)

---

### Many to Many

```js
{  
  "name": "Physician",
  "relations": {
    "patients": {
      "type": "hasMany",
      "model": "Patient",
      "through": "Appointment"
    }
  }
//...
```

```js
{  
  "name": "Patient",
  "relations": {
    "physicians": {
      "type": "hasMany",
      "model": "Physician",
      "through": "Appointment"
    }
  }
//...
```

---

### Many to Many

```js
{  
  "name": "Appointment",
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
// ...
```

^ this is more than just a join table, as the join itself (the "Appointment")
has *its own* properties. Many to many isn't always like this.

---

### Many to Many

```no-highlight
GET /api/Appointments?filter={"include":["patient","physician"]}
```

```js
[
  {
    "appointmentDate": "2014-06-01",
    "id": 1,
    "patientId": 5803,
    "physicianId": 51,
    "patient": {
      //...
    },
    "physician": {
      //...
    }
  }
]
```

---

## Polymorphic Relations

A polymorphic relation is when a model can belong to more than one other model, on a single association.

```js
Book.hasMany( Picture, {
    as: 'photos',
    polymorphic: 'Imageable'
});
Magazine.hasMany( Picture, {      // as 'pictures' (implicit)
    polymorphic: 'Imageable'
});

Picture.belongsTo( 'Imageable', {
    polymorphic: true
});
```
<!-- .element: class="fragment" -->

---

## Embedded Relationships

LoopBack also supports the following embedded relations:

* EmbedsOne - a model that embeds another model; for example, a Customer embeds one billingAddress.
* EmbedsMany - a model that embeds many instances of another model; for example, a Customer can have multiple email addresses and each email address is a complex object that contains label and address.
* EmbedsMany with belongsTo - a model that embeds many links to related people, such as an author or a reader.

^ `EmbedsOne` allows you to post the parent **and child model** in one POST
request.

Embedded relationships also create convenience methods on the parent model
instances, e.g. `customer.email()`, `customer.address.update()` etc.

---

## Embedded Relationships

```js
{
  "name": "Customer",
  // ...,
  "relations": {
    "address": {
      "type": "embedsOne",
      "model": "Address",
      "property": "billingAddress",
      "options": {
        "validate": true,
        "forceId": false
      }
    }
  }
}
```

---

## Embedded Relationships


```js
{
  id: 1,
  name: 'John Smith',
  billingAddress: {
    street: '123 Main St',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95124'
  }
}
```

---

# Data Validation

---

## Using Built-in Methods

```js
CoffeeShop.validatesXXX( //validatesPresenceOf, validatesLengthOf etc
    'propertyName',
    {
        option: value,
        message: 'What to tell the user...'
    }
);
```

^ options object is optional

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

CoffeeShop.validatesInclusionOf('wifi', {
    in: [ 'none', 'open', 'passcode', 'paid' ]
});
```

^ note that `message` is not a string & that `validatesLengthOf` is actually multiple
checks ( `> min` and `< max` )

`validatesInclusionOf` ~= enum

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

^ note: validate function `apply()`ed to object instance (hence `this.x` `this.y`)

---

## Asynchronous Validation

```js
CoffeeShop.validateAsync('someField', remoteCheck, {
    message: 'This field value is not valid'
});

function remoteCheck(errCallback, doneCallback) {
    
    doRemoteCall(function(err, isValid) {
        if (err || !isValid) {
            return errCallback();
        }
        
        doneCallback();
    });
    
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

And if it has async validators...
<!-- .element: class="fragment" data-fragment-index="2" -->
```js
CoffeeShop.isValid(function(valid){
  if(!valid){
    //do something?
  }
);
```
<!-- .element: class="fragment" data-fragment-index="2" -->

---

# Authentication and Authorization

---

## LoopBack Authentication & Authorization

* Principal
* Role
* RoleMapping
* ACL

---

### Principal

An entity that can be identified or authenticated

* A user
* An application
* A role

^ Represents identities of a request to protected resources.

"An application" = a **client** application; i.e. an application consuming your
API

---

### Role

A group of principals with the same permissions

Some dynamic roles are included:

* `$everyone`
* `$unauthenticated`
* `$authenticated`
* `$owner`

^ Organizes principals into groups so they can carry permissions in common (role IS_A group of users)

Dynamic roles: principal is added to or removed dynamically, based on
app/operation context. (editing post: is post owned by currentUser? if so, user
**is** in `$owner` role)

---

### RoleMapping

Assigning principals to roles

Examples:

* Assign user with id 1 to role 1
* Assign role 'admin' to role 1

^A `RoleMapping` is an **association/link between a principal and a role**
(role 1 here is **not** a RoleMapping, the whole association is)

Statically assigns principals to roles.

---

### Access Control Layers

Define access a principal has to a certain operation against a model.

1. Deny everyone to access the model
1. Allow `$authenticated` role to create model instances
1. Allow `$owner` to update an existing model instance

This is an example of "whitelisting", and is safer than excluding operations.

^ whitelisting aka "DENY, ALLOW". (contrast with blacklist/"ALLOW, DENY")

---

### Defining an ACL

Use `slc loopback`, but this time you'll use the `acl` sub-command:

```no-highlight
$ slc loopback:acl
```

---

### Defining an ACL

Deny everyone all endpoints:

```no-highlight
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: All users
? Select the permission to apply: Explicitly deny access
```

---

### Defining an ACL

Now allow everyone to find CoffeeShops:

```no-highlight
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: Read
? Select the role: All users
? Select the permission to apply: Explicitly grant access
```

---

### Defining an ACL

Allow authenticated users to create CoffeeShops

```no-highlight
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: A single method
? Enter the method name: create
? Select the role: Any authenticated user
? Select the permission to apply: Explicitly grant access
```

---

### Defining an ACL

Enable the creator (`$owner`) to make changes:

```no-highlight
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: Write
? Select the role: The user owning the object
? Select the permission to apply: Explicitly grant access
```

---

### Disabling Methods

We can also disable a specific method in code:

```javascript
// common/models/post.js

module.exports = function(Post) {

    Post.disableRemoteMethod('deleteById', true);
    Post.disableRemoteMethod('__create__tags', false);
    
};
```

The second argument indicates whether the method is static.

^If there are post and tag models, where a post hasMany tags, add the following code to /common/models/post.js to disable the remote methods for the related model and the corresponding REST endpoints

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

_Typically this is done in a boot script._

---

### Adding Users to a custom role

```js
// in app.model.Role.create() callback:

theAdminRole.principals.create({
    
    principalType: app.models.RoleMapping.USER,
    principalId: 123   // someUser.id
    
}, function(err, principal) {
    // handle the error!
    cb(err);
});
```

---

### Using the New Role in ACL

```javascript
// in common/models/coffee-shop.json
// ...
"acls": [
  {
    "accessType": "EXECUTE",
    "principalType": "ROLE",
    "principalId": "admin",
    "permission": "ALLOW",
    "property": "create"
  }
]
// ...
```

^Now you can use the role defined above in the access controls. For example, add the following to common/models/project.json to enable users in the "admin" role to call all REST APIs.

---

### Custom Dynamic Roles

Use `Role.registerResolver()` to set up a custom role handler in a boot script.

```js
// server/boot/roles.js
Role.registerResolver('teamMember', function(role, context, cb) {
    
    // custom method you create to determine this...
    determineTeamStatus(function(err, isAuthorized) {
        
        if (err) {
            // maybe handle the error here?
            return cb(err);
        }
        
        // execute callback with a boolean
        cb(null, isAuthorized);
        
    });
});
```

---

## 3rd Party Authentication

![inline](/images/ids_and_credentials.png)

---

### Using Passport

```no-highlight
~/my-app$ npm install --save loopback-component-passport
```

---

### Using Passport

* `UserIdentity` model - keeps track of third-party login profiles.
* `UserCredential` model - stores credentials from a third-party provider to represent users’ permissions and authorizations.
* `ApplicationCredential` model - stores credentials associated with a client application.
* `PassportConfigurator` - the bridge between LoopBack and Passport

---

### Using Passport

In `server/providers.json`:

```js
{
    "facebook-login": {
        "provider": "facebook",
        "module": "passport-facebook",
        "clientID": "{facebook-client-id-1}",
        "clientSecret": "{facebook-client-secret-1}",
        "callbackURL": "http://localhost:3000/auth/facebook/callback",
        "authPath": "/auth/facebook",
        "callbackPath": "/auth/facebook/callback",
        "successRedirect": "/auth/account",
        "scope": ["email"]
    }
}
```

---

### Using Passport

In `server/server.js`:

```js
passport = require('loopback-component-passport');
//...

var PassportConfigurator = passport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
passportConfigurator.init();
```

---

### Set up related models

```js
// server/server.js continued

passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
});
```

^ NOTE: `app.models.user` is a model that *extends* `User`, ditto
other two models with their respective `UpperCase` base models

---

Configure passport strategies for third party auth providers:

```javascript
// server/server.js continued

config = require('./providers.json');

for(var provider in config) {
    var c = config[provider];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(provider, c);
}
```

^ set `c.session` to `true` unless it's explicitly set to `false`

---

### Boot Scripts

When a LoopBack application starts (or "bootstraps"), it runs the scripts in the `/server/boot` directory, known as boot scripts. By default, LoopBack loads boot scripts in alphabetical order.

^ boot scripts only run if you import loopback-boot & invoke it!

---

The standard scaffolded LoopBack application created by the application generator contains the following standard boot scripts (in `/server/boot`) that perform basic initialization:

* `root.js` - reports server status (`{started, uptime`}) on requests to `/` 
* `authentication.js` - Enables authentication for the application by calling `app.enableAuth()`.

^ Legacy Note: scaffolder previously included:
- `rest-api.js` - now enabled in `server/middleware.json`
- `explorer.js` - now enabled in `server/component-config.json`

---

### Add a new boot script

For example, add a new boot script `/server/boot/routes.js`:

```
module.exports = function(app) {
  // Install a "/ping" route that returns "pong"
  app.get('/ping', function(req, res) {
    res.send('pong');
  });
}
```

---

### Add a new boot script

As an aside, we could just as well have used the Express 4.0 Router instead:
```
module.exports = function(app) {
  var router = app.loopback.Router();
    router.get('/ping', function(req, res) {
      res.send('pongaroo');
    });
    app.use(router);
};
```

---

### Asynchronous boot scripts

An asynchronous boot script must export a function that takes **two** arguments:

1. The **application object**, which gives you to access system-defined variables and configurations.
1. A **callback function** to be called when your boot script is finished.

^ two arguments = async boot script

You **must** call the callback function when the script is finished to pass
control back to the application. 

General tip: if your application stalls, look for async functions where `done`
callback was never called

---

### Asynchronous boot scripts

```
module.exports = function(app, done) {
  setTimeout(function() {
    console.log('Hello world');
    done();
  }, 3000);
};
```

^ application boot loading will pause for 3 seconds & resume when `done` is
called

---

### Boot script loading order

Alphabetical order (default) or use options to the `boot()` function:

Replace the default scaffolded function call: `/server/server.js`:

```
boot(app, __dirname);
```

With something like this:

```
bootOptions = {
  "appRootDir": __dirname,
  "bootScripts" : [ "/path/to/first.js", "/path/to/second.js", ... ]
};
boot(app, bootOptions);
```

---

## Advancing Your API

---

### Remote Methods

A way to create new, non-CRUD methods on your model.

^ basically custom methods, like controller methods in MVC. Called `remote`
because if you use client code generator (e.g. `lb-ng`) you can call these
*server* methods "remote"ly, from the client

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
      accepts: { arg: 'msg', type: 'string', http:{source:'query'} },
      returns: { arg: 'greeting', type: 'string' },
      http: [
        { verb: 'get', path: '/greet' }
      ]
    }
  );
};
```

^ with no `http.path` it would still respond to `/api/persons/greet` (endpoint
defaults to method name)

---

### Remote Methods

Now, for example, a request to `GET /api/persons/greet?msg=John` will return:

```js
{ greeting: "Greetings... John" }
```

---

### HTTP Mapping of Input

There are two ways to specify HTTP mapping for input parameters (what the method accepts):

1. Provide an object with a source property (as we did before)
1. Specify a custom mapping function

---

### Custom Mapping Function

The second way to specify HTTP mapping for input parameters is to specify a custom mapping function; for example:

```js
{
  // ...
  accepts: {
    arg: 'custom',
    type: 'number',
    http: function(ctx) {
        // Get the HTTP request object as provided by Express
        var req = ctx.req;
        
        // Get 'a' and 'b' from query string or form data
        // Return their sum.
        return Number(req.query.a) + Number(req.query.b);
    }
  }
}
```

^ `ctx.req` is `Express.Request` object so you can get `ip`, `route`, `xhr`,
`originalUrl` etc.

Note: `urlencoded` body parser is enabled in `server/config.json`

---

# Remote and Operation Hooks

---

## Hooks

LoopBack provides two kinds of hooks:

1. **Remote Hooks**: execute before or after a remote method is called.
1. **Operation Hooks**: execute when models perform CRUD operations.

^ NOTE: Operation hooks replace model hooks, which are now deprecated.

---

### Remote Hooks
A remote hook enables you to execute a function before or after a remote method is called by a client:

* `beforeRemote()` runs before the remote method.
* `afterRemote()` runs after the remote method has finished successfully.
* `afterRemoteError()` runs after the remote method has finished with an error.

---

### Remote Hooks

Both `beforeRemote()` and `afterRemote()` **handlers** have the same three argument signature:

```js
Person.afterRemote( 'create', function handler(ctx, newPerson, next){
  // do some stuff... maybe send them a nice email?
  
  next();
}
```

---

### Remote Hooks

The `afterRemoteError()` handler has a slightly different signature, with only
two arguments:

```js
modelName.afterRemoteError( 'create', function handleErr(ctx, next) {
  // handle this error...
  console.error(ctx.error);
  
  next();
}
```

---

### Remote Hooks

Use an asterisk `*` in methodName to match any number of characters.

Use `*.*` to match any static method; use `prototype.*` to match any instance method.

---

### Context object

Remote hooks are provided with a Context object (`ctx`) that contains useful data:

* `ctx.req`: Express Request object
* `ctx.res`: Express Response object

The context object passed to `afterRemoteError()` also has `ctx.error`

---

### Context AccessToken

The `accessToken` of the user calling the remote method.

`ctx.req.accessToken` is undefined if the remote method is not invoked by a logged in user (or other principal).

You can use `ctx.req.accessToken.userId` to find the currently logged in user (if there is one).

---

# Middleware

---

### Introduction to Middleware

LoopBack is built on Express, which uses "Connect" style middleware.

![](/images/express-middleware.png)

^ loopback builds upon this middleware pattern with the concept of "phases"
(explicitly define middleware execution order)

---

### LoopBack Phases

LoopBack defines a number of **phases**, each of which corresponds to a stage of
the request/response lifecycle.

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

^ 
- initial - The first point at which middleware can run.
- session - Prepare the session object.
- auth - Handle authentication and authorization.
- parse - Parse the request body.
- routes - HTTP routes implementing your application logic.  Middleware registered
via the Express API app.use, app.route, app.get (and other HTTP verbs) runs at
the beginning of this phase.  Use this phase also for sub-apps like
loopback/server/middleware/rest or loopback-explorer.
- files - Serve static assets (requests are hitting the file system here).
- final - Deal with errors and requests for unknown URLs.

---

### LoopBack Phases

Each phase has "before" and "after" subphases in addition to the main phase, encoded following the phase name, separated by a colon. For example, for the "initial" phase, middleware executes in this order:

* `initial:before`
* `initial`
* `initial:after`

^Middleware within a single subphase executes in the order in which it is registered. However, you should not rely on such order. **Always explicitly order the middleware using appropriate phases when order matters.**

---

### Using built-in middleware

LoopBack provides convenience middleware for commonly-used Express/Connect middleware, as described in the following table.

* `loopback#favicon`
* `loopback#rest`
* `loopback#static`
* `loopback#status`
* `loopback#token`
* `loopback#urlNotFound`

---

### Defining Middleware

A middleware function accepts 3 arguments (4 if error-handling):

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

  // configure middleware behavior according to `options`...

  return function myMiddleware(req, res, next) {
    // do some stuff

    next();
  }
  
}
```

^
e.g. `bodyParser`, `static`

---

### Registering Middleware

```js
// server/middleware.json
{
  // ...
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

In general, each phase has the following syntax:

```no-highlight
///pseudocode///
phase[:sub-phase] : {
  middlewarePath : {
    [ enabled: [true | false], ]
    [ params : paramSpec, ]
    [ paths : routeSpec ]
  }
}
```

^ 
- *phase*: one of the predefined phases (initial, session, auth, and so on) or a custom phase
- *sub-phase*: (optional) can be before or after.
- *middlewarePath*: specifies the path to the middleware function, as described below.
- *enabled*: Whether to register or enable the middleware. You can override this property in environment-specific files, for example to disable certain middleware when running in production.
- *params*: Parameters to pass to the middleware handler (constructor) function.
  **options** object from earlier. Most middleware constructors take a single "options" object parameter; in that case the params value is that object.
To specify a project-relative path (for example, to a directory containing static assets), start the string with the prefix $!. Such values are interpreted as paths relative to the file middleware.json.
- *paths*: Specifies the REST endpoint that triggers the middleware. In addition to a literal string, route can be a path matching pattern, a regular expression, or an array including all these types.

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

^
- *enabled*: Whether to register or enable the middleware. You can override this property in environment-specific files, for example to disable certain middleware when running in production.
- *params*: Parameters to pass to the middleware handler (constructor) function. Most middleware constructors take a single "options" object parameter; in that case the params value is that object.
To specify a project-relative path (for example, to a directory containing static assets), start the string with the prefix $!. Such values are interpreted as paths relative to the file middleware.json.
- *paths*:Specifies the REST endpoint that triggers the middleware. In addition to a literal string, route can be a path matching pattern, a regular expression, or an array including all these types.

---

### Registering Middleware

We can also register middleware in JavaScript code (a boot script perhaps):

```js
app.middleware('routes:before', require('morgan')('dev'));
app.middleware('routes:after', '/foo', require('./foo/routes'));
app.middleware('final', errorhandler());
```

^ using `app.use` is **not recommended** as it does not take advantage of phases

---

### Adding a custom phase

In addition to the predefined phases in middleware.json, you can add your own custom phase simply by adding a new top-level key.

---

### Adding a custom phase

For example, below is a middleware.json file defining a new phase "log" that comes after "parse" and before "routes" in `server/middleware.json`:

```
{
  // ...
  "parse": {},
  "log": { ... },
  "routes": {}
  // ...
}
```

---

## Adding a Static Client

Applications typically need to serve static content such as HTML and CSS files, client JavaScript files, images, and so on.  It's very easy to do this with the default scaffolded LoopBack application.

You're going to configure the application to serve any files in the `/client` directory as static assets.

---

## Adding a Static Client

First, you have to disable the default route handler for the root URL.

Recall that by default, the root url (`http://localhost:3000/`) of a scaffolded
loopback application serves a simple status message such as this:

```js
{ "started": "2014-11-20T21:59:47.155Z", "uptime": 42.054 }
```

---

## Adding a Static Client

This happens because by default the scaffolded application has a boot script named root.js that sets up route-handling middleware for the root route ("/"):

`server/boot/root.js`:

```
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
```

^ using `server.use()` here because it's an app route, not middleware

---

## Adding a Static Client

This code says that for any GET request to the root URI ("/"), the application will return the results of loopback.status().
To make your application serve static content you need to disable this script.  Either delete it or just rename it to something without a .js ending (that ensures the application won't execute it).

^ You'd only do this for LoopBack app that is both **API server** and **web server**

If it's not a web server you could serve the static assets on a different path
(see e.g. `/explorer`)

---

## Static Serving Middleware

Next, you need to register static middleware to serve files in the /client directory.

Add the following in `server/middleware.json`:

```js
// ...
  "files": {
    "loopback#static": {
      "params": "$!../client"
    }
  },
// ...
```

---

These lines define static middleware that makes the application serve files in the `/client` directory as static content.

```js
// ...
  "files": {
    "loopback#static": {
      "params": "$!../client"
    }
  },
// ...
```

The `$!` characters indicate that the path is relative to the location of `middleware.json`.

---

### Add an HTML file

Now, the application will serve any files you put in the `/client` directory as static (client-side) content.

So, to see it in action, add an HTML file to /client.

---

For example, add a file named index.html with this content in `/client/index.html`:

```html
<html>
  <head>
    <title>LoopBack</title>
  </head>
  <body>
      <h1>LoopBack Rocks!</h1>
      <p>Hello World... </p>
  </body>
</html>
```

Of course, you can add any static HTML you like–this is just an example.

^ note: the path for this file is **not** `/client/index.html` but `/index.html`

---

# fin
