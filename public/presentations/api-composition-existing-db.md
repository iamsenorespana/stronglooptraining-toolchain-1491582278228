
![](/images/StrongLoop.png)

## Composing a Node API
### from an Existing Database

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
~/coffee-reviews$ npm install --save loopback-connector-mysql
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

### Step 2: Add connection information...

![](/images/arc-datasource-mysql.png)
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
  "test-data": {
    "name": "test-data",
    "host": "localhost",
    "port": 3306,
    "database": "coffee-reviews",
    "user": "root",
    "password": "********",
    "connector": "mysql"
  }
}
```

---

### Discover Existing Models

![](/images/arc-discover-model-1.png)
<!-- .element: class="fragment" -->

---

### Select Discovered Models

![](/images/arc-discover-model-2.png)

---


### Select Model Properties

![](/images/arc-discover-model-3.png)

---

### Update API Model and Properties

![](/images/arc-update-model.png)

---

### Review Model Configuration

`/common/models/review.json`

```js
{
  "name": "Review",
  "base": "PersistedModel",
  "idInjection": false,
  "options": {
    "validateUpsert": true
  },
  "mysql": {
    "schema": "coffee-reviews",
    "table": "cs-review"
  },
  "properties": {
    // ...
  },
  // ...
}
```

---

### Review Model Configuration

`/common/models/review.json`

```js
{
  "name": "Review",
  // ...
  "properties": {
    "rating": {
      "type": "Number",
      "required": true,
      "mysql": {
        "columnName": "rating",
        "dataType": "smallint",
        "dataPrecision": 5,
        "nullable": "N"
      }
    },
    // ...
  },
  // ...
}
```

---

### Review Model Configuration

`/common/models/review.json`

```no-highlight
{
  "name": "Review",
  // ...
  "properties": {
    // ...,
    "coffeeShopId": {
      "type": "Number",
      "required": true,
      "mysql": {
        "columnName": "cs-id",
        "dataType": "int",
        "dataPrecision": 10,
        "nullable": "N"
      }
    }
  },
  // ...
}
```

---

## Create Additional Models!

---

## Adding Model Relations

---

## Relationship Types

1. `hasOne` relations
1. `hasMany` relations
1. `hasManyThrough` relations
1. `belongsTo` relations
1. `hasAndBelongsToMany` relations
1. Embedded relations (`embedsOne` and `embedsMany`)
1. Polymorphic relations

---

### Adding a Relationship

Two options:

* Command Line
* Direct config file editing

---

### Adding a Relationship

<pre><code class='lang-no-highlight'>~/coffee-reviews$ <strong>slc loopback:relation</strong>
? Select the model to create the relationship from: <strong>CoffeeShop</strong>
? Relation type: <strong>has many</strong>
? Choose a model to create a relationship with: <strong>Review</strong>
? Enter the property name for the relation: <strong>reviews</strong>
? Optionally enter a custom foreign key:
? Require a through model? No</code></pre>

---

### Review the Relation Config

`/common/models/coffee-shop.json`

```js
{
  "name": "CoffeeShop",
  // ...,
  "relations": {
    "reviews": {
      "type": "hasMany",
      "model": "Review",
      "foreignKey": ""
    }
  }
}
```

---

## A `belongsTo` Relation == Ownership

---

### Adding a Relationship

<pre><code class='lang-no-highlight'>~/coffee-reviews$ <strong>slc loopback:relation</strong>
? Select the model to create the relationship from: <strong>Review</strong>
? Relation type: <strong>belongsTo</strong>
? Choose a model to create a relationship with: <strong>User</strong>
? Enter the property name for the relation: <strong>reviewer</strong>
? Optionally enter a custom foreign key: <strong>reviewerId</strong>
? Require a through model? No</code></pre>

---

### Review the Relation Config

`/common/models/review.json`

```js
{
  "name": "Review",
  // ...,
  "relations": {
    "reviewer": {
      "type": "belongsTo",
      "model": "User",
      "foreignKey": "reviewerId"
    }
  }
}
```

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

### Using Filters

`/api/CoffeeShops?filter={"where":{"name":"Starbucks"}}`

```js
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
<!-- .element: class="fragment" -->

---

### Including Relations

`/api/CoffeeShops?filter={"include": [ "reviews" ] )`
<!-- .element: class="fragment" -->

```js
[
  {
    "id": 13,
    "name": "Awesome Shop",
    ...,
    "reviews": [
      { "id": 27, "rating": 4, "comments": "..." },
      { "id": 31, "rating": 5, "comments": "..." },
      ...
    ]
  },
  ...
]
```
<!-- .element: class="fragment" -->

---

## What's Next?

https://strongloop.com/get-started

https://docs.strongloop.com

---

![](/images/StrongLoop.png)

# Thank You!

![{{speaker}}]() | ![{{contact}}]()

![{{url}}]()
