
![](/images/StrongLoop.png)

## Node.js API Composition
### with LoopBack and StrongLoop

![{{speaker}}]() | ![{{contact}}]()

---

## The Many Faces of Node at IBM

![](/images/faces_of_node.png)

---

## APIs at IBM

### Create > Run > Manage > Enforce

---

![fit](/images/arc-products.png)

---

## Let's Get Started!

---

### Installing StrongLoop

1. Install Node.js ([nodejs.org/en/download](https://nodejs.org/en/download/))
2. `~$ npm install -g strongloop` 

---

### Creating a LoopBack Application

`~$ slc loopback`

![](/images/loopback-yeoman.png)
<!-- .element: class="fragment" -->

---

### Starting Arc

```no-highlight
~$ cd coffee-reviews
~/coffee-reviews$ slc arc
Loading workspace /home/johndoe/coffee-reviews
StrongLoop Arc is running here: http://localhost:45593/#/
```

_(Your browser should open automatically,  
or go to the URL in the console!)_

---

![](/images/arc-login.png)

<p style='font-size:0.8em;font-style:italic'>(Registration is free and easy!)</p>

---

![](/images/arc-landing.png)

---

## Using the API Composer

---

### Add a Datasource

Step 1: Add the connector module...

```no-highlight
~/coffee-reviews$ npm install --save loopback-connector-mongodb
```

---

### Official Connectors

* Oracle
* Cloudant
* MySQL
* MSSQL
* MongoDB
* PostgreSQL
* Redis

And many more community connectors! [github.com/pasindud/awesome-loopback](https://github.com/pasindud/awesome-loopback)

---

### Add a Datasource

Step 2: Add connection information...

![](/images/arc-datasource.png)
<!-- .element: class="fragment" -->

---

### Add a Datasource

You can also edit connection information in  
`/server/datasources.json`

```js
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "myMongo": {
    "name": "myMongo",
    "host": "127.0.0.1",
    "port": 27017,
    "username": "",
    "password": "",
    "database": "test",
    "connector": "mongodb"
  }
}
```

---

### Add a Model

![](/images/arc-new-model.png)
<!-- .element: class="fragment" -->

---

### Review Model Configuration

`/common/models/coffee-shop.json`

```js
{
  "name": "CoffeeShop",
  "base": "PersistedModel",
  "strict": false,
  "idInjection": false,
  "options": {
    "validateUpsert": true
  },
  "properties": {},
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}
```

---

### Check the Model-Datasource Mapping

`/server/model-config.json`

```js
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    // ...
  },
  // ...
  "CoffeeShop": {
    "dataSource": "myMongo",
    "public": true,
    "$promise": {},
    "$resolved": true
  }
}

```

---

### Add Model Properties

![](/images/arc-model-properties.png)
<!-- .element: class="fragment" -->

---

### Review Model Property Configuration

`/common/models/coffee-shop.json`

```js
{
  // ...
  "properties": {
    "name": {
      "type": "string",
      "required": true,
      "comments": "The name of our coffee shop"
    },
    "zip-code": {
      "type": "string",
      "index": true,
      "comments": "The zip code of our shop"
    },
    // ...
  },
  // ...
}

```

---

## Create More Models!

---

## Using the API explorer

---

### Using the API explorer

Step 1: Start the embedded controller  

![](/images/arc-app-controller.png)

---

Go to `http://localhost:3000/explorer` in your browser...

![](/images/lb-explorer.png)

---

![fit](/images//lb-coffeeshop-rest.png)

---

### Using filters

`/api/CoffeeShops?filter={"where":{"name":"Starbucks"}}`

```js
[
  { "name": "Starucks", "zip-code": "90210", ... },
  { "name": "Starucks", "zip-code": "92441", ... },
  { "name": "Starucks", "zip-code": "92648", ... },
  // ...
]
```
<!-- .element: class="fragment" -->

---

### Using filters

```no-highlight
{ "where": { "name": "Starbucks" } }

{ "where": { "name": {"like": "star"} } }

{ "where": { "opening-date": {"lt": "2006-02-01T00:00:00.000Z"} } }

{ "where": {
  "and": [
    { "name": "Starbucks" },
    { "zip-code": "90210" }
  ]
} }
```

---

## What's Next?

https://strongloop.com/get-started

https://docs.strongloop.com

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]() | ![{{contact}}]()

![{{url}}]()
