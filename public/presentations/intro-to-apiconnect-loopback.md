![](/images/StrongLoop.png)

# Building REST APIs in LoopBack

![{{speaker}}]()

---

<!-- .slide: data-background="white" -->

![fit](images/StrongLoop_who.png)

---

@module/framework-patterns

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

## Step 1: Install API Connect Developer Toolkit

```no-highlight
~$ npm install -g apiconnect
```

<div class='fragment' style='margin-top:1em;'>
    <p>And scaffold your application:</p>

    <pre><code>~$ apic loopback</code></pre>
</div>

---

## CLI Project Creation

![fit](/images/apic-createproject.png)

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
 |_ definitions  #  API and product definition YAML files
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
<aside class="notes">
- Mention that when you publish it automatically pushes to production ( publishing to Bluemix or production syestem )
- the regular file will be the basis and the environment specific file will overwrite that value
</aside>

---

# Working with Data Sources

---

<!-- .slide: data-background="white" -->

![fit](/images/loopback-connector-list.png)

---

## Datasource Definition

1. API Designer
1. CLI: `$ apic create --type datasource`
1. Programmatically

---

### In API Designer

![inline](/images/apic-datasources.png)

^

Let's look at creating a new mongo datasource

---

### Create a datasource

![inline](/images/apic-datasource-new.png)

^

- Clicked "add new"
- entered name
- selected "mongoDB"
- **click to install connector**

---

### Install connector

![inline](/images/apic-datasource-install.png)

^

- apic will run `npm install --save loopback-connector-mongodb` for you
- Point and click!! :)
- Less time spent messing with config files

---

### Configure &amp; Test

![inline](/images/apic-datasource-configure.png)

^

- Enter url (or host, port, etc. info)
- click little running man button to test

---

### Configure &amp; Test

![inline](/images/apic-datasource-tested.png)

^

- all done

---

### Via CLI (and code)

1. `~/my-app$ apic create --type datasource`
1. Edit `server/datasources.json` with connection info
1. Install the connector with npm ( all connectors installs should auto install module )
1. Update model-config as needed
1. Install connector module:

```no-highlight
~/my-app$ npm install --save loopback-connector-mongodb
```

^ Does more or less what APIC editor did in the last step

---

### APIConnect Supported Connectors

* IBM DB2 & Cloudand DB
* MongoDB
* MySQL
* Oracle
* Postgres
* MSSQL
* REST and SOAP webservices

---

### More LoopBack connectors (3rd patry)

Kafka, Elastic Search, CouchDB, Neo4j, RethinkDB, Riak, etc, etc, etc

<https://github.com/pasindud/awesome-loopback>

---

### Configuring the Datasource

```js
{
  "mlab-restaurants-db": {
    "name": "mlab-restaurants-db",
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

# Working with Data Models

---

## Creating Models

Different ways...

1. UI: `~/my-app$ apic edit` and API Designer.
1. CLI: `~/my-app$ apic create --type model`.
1. Config files in `/common/models`, etc
1. Programmatically in a boot script
1. Programmatically with model discovery from data source

---

## API Designer


![](/images/apic-apimanager.png)

---

### Model Discovery/Generation

![](/images/apic-datasource-discover.png)

^
Generate models from datasources

- greate way to rapidly build an API out from existing database
- **click find/loupe button**

---

![fit](/images/apic-models-discover.png)

^

- Check the model you want
- Click "select properties"

---

![fit](/images/apic-models-select-fields.png)

^ 

- click select

---

![fit](/images/apic-models-generate.png)

^
click Generate

---

## Creating a Model via CLI

```no-highlight
$ apic create --type model
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

^ In a brand new application, only the default in-memory data source is available. PersistedModel is the base object for all models connected to a persistent data source such as a database.

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

## Run the Application ( simple )

```
~/my-app$ node .
Web server's listening at http://localhost:3000

```

---

## Run the Gateway  ( to Explore )

```
~/my-app$ apic start
Service myapp started on port 4001
Service myapp-gw started on port 4002

~/my-app$ apic edit
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

## Models REST API Endpoints

---

<!-- .slide: data-background="white" -->

![inline](/images/apic-explorer.png)

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

## Advancing Your API

---

### Remote Methods

A way to create new, non-CRUD methods on your model.

---

### Remote Methods

```js
// common/models/person.js

module.exports = function(Car){
    // Remote Methods
    Car.make = function(carMaker,cb){
      
        Car.find({where:{make:carMaker}}, function(err, cars){
            cb( null, cars );
        });

    };
    Car.remoteMethod(
        'make',
        {
            http: { path:'/make/:carMaker', verb:'GET'},
            description: 'this method returns list of cars by Car Make i.e. Ford, Madza, Honda, etc',
            accepts: {arg: 'carMaker', type: 'string', required: true},
            returns: {arg: 'cars', type: 'array'}
        }
    );
};
```

---

### Remote Methods

Now, for example, a request to `GET /api/cars/make/Toyota` will return:

```
{ cars: [{"make":"Honda"}, {"make":"Toyota"}] }
```

---

## Remote and Operation Hooks

---

## Hooks

API Connect LoopBack provides two kinds of hooks:

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
    Car.afterRemote('make', function(context, remoteMethodOutput, next) {

      _.each( context.result.cars, function(line){
          line["message"] = "Turning off the engine, removing the key.";
      });

      next();
    });
```

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

## Quick Tips

---

### Working Between CLI and API Designer

Any changes you make to the project in code should be picked up by API Designer.  Any changes you make in API Designer will update the code. 

To make sure your manual code changes are picked up, run the command below.

```no-highlight
~/my-app$ apic loopback:refresh
Updating swagger and product definitions
Created /Users/architect/myapp/definitions/myapp.yaml swagger description
```

---

# Thank You!

### Questions?

### Introduction to API Connect LoopBack

<br style='margin-top:1.5em'>

![{{speaker}}]()


[IBM Knowledge Center API Connect](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/capim_cli_overview.html?lang=en)
