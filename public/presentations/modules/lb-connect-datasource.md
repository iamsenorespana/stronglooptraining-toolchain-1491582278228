
## Connecting to a Data Source

---

### StrongLoop Supported Connectors

* MongoDB
* MySQL
* Oracle
* Postgres
* MSSQL
* Redis
* Cloudant
* DB2
* In-Memory

---

### Community-Supported connectors

Kafka, Elastic Search, CouchDB, Neo4j, RethinkDB, and more!

[github.com/pasindud/awesome-loopback](https://github.com/pasindud/awesome-loopback)

---

## Defining a Datasource

1. UI: StrongLoop Arc
<!-- .element: class="fragment" -->
1. CLI: slc loopback:datasource
<!-- .element: class="fragment" -->
1. Programmatically
<!-- .element: class="fragment" -->

---

### In Arc

![inline](/images/datasourcec-ui.png)

---

### Step 1: Install the connector

```no-highlight
~/coffee-reviews$ npm install --save loopback-connector-mongodb
```

---

### Step 2: Add the Configuration

```no-highlight
~/my-app$ slc loopback:datasource
```

<p class='fragment'>Then edit `server/datasources.json` with connection info</p>

---

### Configuring the Datasource

`server/datasources.json`

```js
{
  "my-data": {
    "name": "my-data",
    "connector": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "coffee-reviews",
    "username": "devUser",
    "password": "12345"
  }
}
```

---

### Check the Model-Datasource Mapping

`/server/model-config.json`

```js
{
  "_meta": {
    "sources": [ ],
    "mixins": [ ]
  },
  
  // ... built-in models
  
  "CoffeeShop": {
    "dataSource": "my-data",  // << change this value
    "public": true,
    "$promise": {},
    "$resolved": true
  }
}
```
