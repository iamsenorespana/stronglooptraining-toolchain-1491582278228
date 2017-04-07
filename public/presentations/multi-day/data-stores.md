
![](/images/StrongLoop.png)

# Connecting to Data Stores

### SQL, NoSQL, and more!

---

![inline](/images/datasources.png)

---

## MySQL

```no-highlight
~/my-app$ npm install mysql --save
```

<https://github.com/felixge/node-mysql/>

---

```js
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'test',
    user: 'foo',
    password: 'bar'
});

connection.connect();

var query = 'SELECT 1 + 1 AS solution';

connection.query(query, function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);

    connection.end();
});
```

---

### ORMs

* [sequelize](http://docs.sequelizejs.com/en/latest/)
<!-- .element: class="fragment" -->

* [LoopBack MySQL connector](https://github.com/strongloop/loopback-connector-mysql)
<!-- .element: class="fragment" -->

* [Waterline](https://github.com/balderdashy/waterline)
<!-- .element: class="fragment" -->

---

### Sequelize

```bash
$/my-app$ npm install --save sequelize
```

```js
var Sequelize = require('sequelize');

var db = new Sequelize('mysql://user:pass@foo.com:3306/dbname');
```
<!-- .element: class="fragment" -->

---

### Sequelize Models

Now we create a model, and sync it to the table:

```js
var User = db.define('user', {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    salary: Sequelize.FLOAT // Note that in JS, this is just a number!
});
```

```js
User.sync().then(function() {
    // Now we're ready to use it!
});
```

---

### Sequelize Models

```js
User.findById(13)
    .then(function(user) {
        // `null` indicates no entry for that id!
        console.log( user );
    })
    .catch(function(err) {
        // oops, there was an error accessing the DB!
    });
```

```js
User.find({ where: { firstName: { $like: 'jordan' } } })
    .then(function(records) {
        // ...
    });
```
<!-- .element: class="fragment" -->


---

## What about NoSQL?

* Simplicity of design
<!-- .element: class="fragment" -->
* Horizontal scaling
<!-- .element: class="fragment" -->
* Speed
<!-- .element: class="fragment" -->
* Integration with JS
<!-- .element: class="fragment" -->

---

## MongoDB

Open source, document-oriented database built for high performance and availability

Uses JSON documents to store records

[Getting Started Docs](http://docs.mongodb.org/getting-started/node/client/)

---

### Getting Started with Mongo

Either [install Mongo](https://www.mongodb.org/downloads) locally...

<p class='fragment'>
    Or use a service like [MongoLab](https://mongolab.com)!
</p>

---

### Getting Started with Mongo

```no-highlight
~/my-app$ npm install --save mongodb
```

```js
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/mydatabase';

MongoClient.connect(url, function(err, db) {
    if (err) {
        /* handle the error... */
        return;
    }
    
    console.log('Connected!');
    
    db.close();
});
```
<!-- .element: class="fragment" -->

---

### Inserting Records in Collections

```js
MongoClient.connect(url, function(err, db) {
    if (err) { /* ... */ }
    
    db.collection('users').insert(
        {
            name: 'StrongLooper',
            email: 'callback@strongloop.com'
        },
        function(err, user) {
            if (err) { /* handle the error... */ return; }
            
            console.log('The new user', user);
            
            db.close();
        });
});
```

---

### Retrieving Records

```js
MongoClient.connect(url, function(err, db) {
    if (err) { /* ... */ }

    db.collection('users')
        .find({ /* somefilters */ })      // get a cursor
        .toArray(function(err, records) { // execute search
            if (err) { /* ... */ }
            
            console.log(records);
        });
});
```

---

### ODMs

* [mongoose](http://mongoosejs.com/)
* [loopback mongodb connector](https://github.com/strongloop/loopback-connector-mongodb)
* [waterline](https://github.com/balderdashy/waterline)

---

### Mongoose

`mongoose` is an Object Document Mapper (ODM) for MongoDB built in Node.js

Use npm to install `mongoose`

```no-highlight
~/my-app$ npm install mongoose --save
```

---

#### Create a Connection

```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
```

```js
mongoose.connect(uri, {
    server : 'localhost',
    db     : 'someDB',
    user   : 'someUser',
    pass   : 'somePass'
});
```

^ "_The connect method also accepts an options object which will be passed on to
the underlying driver. All options included here take precedence over options
passed in the connection string._"

---

### Event-driven Connections

Add event listeners to detect a successful and failed connections

```js
var db = mongoose.connection;

db.on('error', function (err) {
    // connection failed
    console.error('Connection error', err);
});

db.once('open', function () {
    // connection successful!
});
```

---

### Schemas

A Mongoose `schema` is an object that maps to a MongoDB collection

```js
var Schema = mongoose.Schema;

var gamerSchema = new Schema({
    name : String,
    win  : Number,
    loss : Number,
    team : String
});
```

---

### Supported Types

* String
* Number
* Date
* Buffer
* Boolean
* Mixed
* ObjectId
* Array

---

### Models

Mongoose models are classes that represent documents in MongoDB

They are dependent on the schema which defines them

```js
var Gamer = mongoose.model('Gamer', gamerSchema);
```

---

### Model Instances

Each instance of a model manages a single document

```js
var someGamer = new Gamer({
    name : 'batman',
    win  : 100,
    loss : 0,
    team : 'justice-league'
});
```

---

### Instance Methods

Instance behaviour is defined in the schema's `methods` object:

```js
gamerSchema.methods.findTeamMates = function (cb) {
    this.model('Gamer').find({ team : this.team }, cb);
};
```

```js
someGamer.findTeamMates(function (err, teamMates) {
    if (err) {
        console.error(err);  // might want to handle this better
        return;
    }
  
    console.log(teamMates); // gamers from the same team
});
```
<!-- .element: class="fragment" -->

---

### Static Methods

Static behaviour is defined in the schema's `statics` object:

```js
gamerSchema.statics.findByName = function (name, cb) {
    this.find({ name : new RegExp(name, 'i') }, cb);
};
```

```js
Gamer.findByName('batman', function (err, gamers) {
    if (err) { /* ... */ return; }
    
    console.log(gamers);
});
```
<!-- .element: class="fragment" -->

---

## Querying Documents

To retrieve all documents, use the `find` method

```js
Gamer.find(function (err, gamers) {
    if (err) { /* ... */ return; }
    
    // process records...
});
```

---

Mongoose provides static helpers for filtering query results

```js
var query = Gamer.find({ name : /man$/ })
            .where('team').equals('justice-league')
            .limit(10).select('name win loss');
```

Then use the `exec` method to retrieve query results:

```js
query.exec(function (err, gamers) {
    if (err) { /* ... */ return; }

    // process records...
});
```

---

### Saving Documents

New documents do not get saved automatically!

Call the `save` method explicitly for persistence:

```js
someGamer.save(function (err, someGamer) {
    if (err) { /* ... */ return; }

    someGamer.findTeamMates(function (err, teamMates) {
        if (err) { /* ... */ return; }
        
        console.log(teamMates);
    });
});
```

---

### Warning!

**Mongoose passes calls to `update()` directly to Node's native MongoDB driver.**

If you use it, then you'll bypass all the Schema logic such as schema 
validation, get/set, pre/post hooks, etc.

Therefore, **use `find()` and `save()` instead of `update()`**.

---

### Deleting Documents

To delete documents, call the `remove` method

```js
Gamer.remove({ name : 'batman' }, function (err, gamer) {
    if (err) { /* ... */ return; }
    
    console.log(gamer); // the deleted gamer
});
```

---

### Closing a Connection

To close a Mongoose connection, use the `close` method

```js
var db = mongoose.connection;

db.close(function () {
    console.log('MongoDB connection closed!');
});
```

---

### Graceful Shutdown

```js
function shutdown() {
    db.close(function () {
        console.log('MongoDB connection closed!');
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
```

---

## Redis

Open source, advanced key-value cache and store.

<http://redis.io/>

---

Redis supports these types:

* strings
* hashes
* lists
* sets
* sorted sets
* bitmaps (bit arrays)
* hyperloglogs (probabilistic data structure for estimating cardinality of a set)

---

Redis has no nested documents, but you can serialize nested structures and store
them as strings.

---

### Redis for Node

<https://github.com/mranney/node_redis>

```no-highlight
~/my-app$ npm install redis --save
```

---

### Connecting to a Redis Store

```js
var redis = require('redis'),
    client = redis.createClient(6379, '192.168.1.13');

client.auth('myPassword', function(err) {
    if (err) { /* ... */ }
});
```

```js
client.on('error', function (err) {
    // Handle the error!!
});

client.on('connect', function () {
    // We've connected... now what?
});
```
<!-- .element: class="fragment" -->

---

### Using a Redis Store

```js
client.set('foo', 'bar');

client.get('foo', function(err, reply) {
    if (err) { /* ... */ }
    
    console.log( reply.toString() );  // "bar"
});
```

---

### Using a Redis Hash Set

```js
client.hset('someKey', 'hashtest 1', 'some value');
client.hset('someKey', 'hashtest 2', 'some other value');

client.hkeys('someKey', function (err, replies) {
    if (err) { /* ... */ }
    
    replies.forEach(function (reply) {
        console.log( reply );
    });
});
```

Prints:
```no-highlight
hashtest 1
hashtest 2
```

---

### Using a Redis Hash Set

```js
client.hset('someKey', 'hashtest 1', 'some value');
client.hset('someKey', 'hashtest 2', 'some other value');

client.hgetall('someKey', function (err, data) {
    if (err) { /* ... */ }

    console.log( data );
});
```

Prints:
```no-highlight
{ "hashtest 1": "some value", "hashtest 2": "some other value" }
```

---

### Using a Redis Hash Set

```js
client.hset('someKey', 'hashtest 1', 'some value');
client.hset('someKey', 'hashtest 2', 'some other value');
```

```js
client.hmset('someKey', {
    'hashtest 1': 'some value',
    'hashtest 2': 'some other value'
});
```

---

### Closing a Redis Client

```js
client.end();
```

**Careful!** This command does _not_ wait for requests to exit cleanly!

Mostly useful for cleanup operations.

---

### Closing a Redis Client

Instead of `end()`, use `quit()` in a callback...

```js
client.hmget('someKey', function(err, data) {
    if (err) { /* ... */ }
    
    // process data...
    
    client.quit();
})
```

---

### Hiredis

Better non-blocking support and fast I/O for Redis

```no-highlight
~/my-app$ npm install hiredis redis --save
```

_Note that the `node_redis` module you installed may already be using hiredis!_

---

# fin
