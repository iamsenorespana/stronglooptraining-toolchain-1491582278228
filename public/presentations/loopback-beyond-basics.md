
![](/images/StrongLoop.png)

## LoopBack APIs:
## Beyond the Basics

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

## Starting Point

CoffeeShop --< Review >-- Reviewer
<!-- .element: class="fragment" -->

---

### CoffeeShop

```js
{
  "name": "CoffeeShop",
  "base": "PersistedModel",
  // ...
  "properties": {
    "name": { "type": "string", "required": true },
    "openingHour": { "type": "number", "required": true },
    "closingHour": { "type": "number", "required": true },
  },
  "relations": {
    "reviews": {
      "type": "hasMany",
      "model": "Review"
    }
  },
  // ...
}
```

---

### Review

```js
{
  "name": "Review",
  "base": "PersistedModel",
  // ...
  "properties": {
    "rating": { "type": "number", "required": true },
    "comments": { "type": "string", "required": false },
    "date": { "type": "date", "required": true }
  },
  "relations": {},
  // ...
}
```

---

### Reviewer

```js
{
  "name": "Reviewer",
  "base": "User",
  // ...
  "properties": {
    "fullName": { "type": "string", "required": true }
  },
  "relations": {
    "reviews": {
      "type": "hasMany",
      "model": "Review",
      "foreignKey": "publisherId"
    }
  },
  // ...
}
```

---

### Our DataSource

```js
// server/datasources.json
{
  "mongodb": {
    "name": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "coffee-shop-test",
    "connector": "mongodb"
  }
}
```
<!-- .element: class="fragment" -->

---

## Environment-Specific Config

---

## Production DataSources

```js
// server/datasources-production.json
{
  "mongodb": {
    "name": "mongodb",
    "host": "mongo.my-org.com",
    "port": 27017,
    "database": "coffee-shop-test",
    "username": "my-mongo-user",
    "password": "12345"
    "connector": "mongodb"
  }
}
```

<p class='fragment'><strong>Don't forget to set `NODE_ENV`!</strong></p>

---

### Environment-Specific Config

* config.json ... config.[env].json
* datasources.json ... datasources.[env].json
* model-config.json ... model-config.[env].json
* middleware.json ... middleware.[env].json
* component-config.json ... component-config.[env].json

---

### Dynamic Config

```js
// server/config.js

var config = require('my-config-loader');

var values = config.getConfigValues();

module.exports = {
  "restApiRoot": "/api",
  "host": values.host,
  "port": process.env.MY_APP_PORT,
  // ...
};
```

---

## Ownership Relations

---

### Add Ownership Relation

<pre><code class='lang-no-highlight'>~/coffee-reviews$ <strong>slc loopback:relation</strong></code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Select the model to create the relationship from: <strong>Review</strong>
? Relation type: <strong>belongsTo</strong>
? Choose a model to create a relationship with: <strong>Reviewer</strong>
? Enter the property name for the relation: <strong>reviewer</strong>
? Optionally enter a custom foreign key:
? Require a through model? No</code></pre>

---

### Review Relation Config

```js
{
  "name": "Review",
  // ...
  "relations": {
    "reviewer": {
      "type": "belongsTo",
      "model": "Reviewer",
      "foreignKey": ""
    }
  },
  // ...
}
```

---

# Authentication and Authorization

---

## LoopBack Auth

* Principal<span class='fragment'>: <em>An entity that can be authenticated</em></span>
* Role<span class='fragment'>: <em>A group of principals</em></span>
* RoleMapping<span class='fragment'>: <em>Maps a principal to a role</em></span>
* ACL<span class='fragment'>: <em>Access control list for a principal on a model</em></span>

---

### Principal

Any entity that can be identified or authenticated

* A user
* An application
* A role

---

### Built-in, Dynamic Roles

* `$everyone`
<!-- .element: class="fragment" -->
* `$unauthenticated`
<!-- .element: class="fragment" -->
* `$authenticated`
<!-- .element: class="fragment" -->
* `$owner`
<!-- .element: class="fragment" -->

---

## Access Control

<p class="fragment">Use a **"White Listing"** approach!</p>

---

### Adding ACLs

One possible workflow...

1. Deny ALL access to EVERYONE for the given model
<!-- .element: class="fragment" -->
1. Allow authenticated users to read model instances
<!-- .element: class="fragment" -->
1. Allow owners of a model to update existing instances
<!-- .element: class="fragment" -->
1. Allow authenticated users to create an inctance
<!-- .element: class="fragment" -->

---

### Defining an ACL

<pre><code class='lang-no-highlight'>~/my-project$ slc <strong>loopback:acl</strong></code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Select the model to apply the ACL entry to: <strong>Review</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the ACL scope: <strong>All methods and properties</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the access type: <strong>All (match all types)</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the role: <strong>All users</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the permission to apply: <strong>Explicitly deny access</strong></code></pre>

---

### Review the Config

```js
{
  "name": "Review",
  // ...
  "acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    }
  ],
  // ...
}
```

---

### Defining ACLs

Now allow **READ** access in the same manner:

<pre><code class='lang-no-highlight'>~/my-project$ slc <strong>loopback:acl</strong></code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Select the model to apply the ACL entry to: <strong>Review</strong>
? Select the ACL scope: <strong>All methods and properties</strong>
? Select the access type: <strong>READ</strong>
? Select the role: <strong>authenticated</strong>
? Select the permission to apply: <strong>Explicitly grant access</strong></code></pre>

---

## Add more ACLs!

You will need more layers to this list,  
and remember that this list executes _in order_!

---

## Data Validation

---

### Basic Validation

Via the model properties...

```js
{
  "name": "CoffeeShop",
  "base": "PersistedModel",
  // ...
  "properties": {
    "name": { "type": "string", "required": true },
    "openingHour": { "type": "number", "required": true },
    "closingHour": { "type": "number", "required": true },
  },
  // ...
}
```

---

### Built-in Validation Methods

```js
// common/models/coffee-shop.js
module.exports = function(CoffeeShop) {
  
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
};
```

---

### Built-in Validation Methods

* validatesLengthOf
* validatesInclusionOf


* validatesExclusionOf
<!-- .element: class="fragment" -->
* validatesFormatOf
<!-- .element: class="fragment" -->
* validatesNumericalityOf
<!-- .element: class="fragment" -->
* validatesUniquenessOf
<!-- .element: class="fragment" -->
* validatesPresenceOf
<!-- .element: class="fragment" -->
* validatesAbsenceOf
<!-- .element: class="fragment" -->

---

## Custom Validation Methods

---

### Custom Validation Methods

```js
// common/models/coffee-shop.js
module.exports = function(CoffeeShop) {
  
  CoffeeShop.validate(
    'openingHour',
    CoffeeShop.validateOpeningHour,
    {
      message: 'Please enter a valid opening hour (0-23).'
    }
  );
  
  CoffeeShop.validateOpeningHour = function(errorCallback) {
    if (this.openinghour < 0 ||
        this.openingHour > 23 ||
        this.openingHour > this.closingHour) {
      errorCallback();
    }
  };
};
```

---

## Custom Remote Methods

---

### First, Define the Functionality

```js
// common/models/coffee-shop.js
module.exports = function(CoffeeShop) {

  CoffeeShop.isOpen = function(id, next) {
    
    CoffeeShop.findById(id, function(err, shop) {
      if (err) { return next(err); }
      if (!shop) { return next({ message: 'Not found', status: 404 }); }
      
      var hour = (new Date()).getHours();
      var isOpen = 
        (hour >= shop.openingHour && hour < shop.closingHour);
      
      next(null, isOpen);
    });
  };
};
```
<!-- .element: class="fragment" -->

---

### Next, Define the Endpoint

```js
module.exports = function(CoffeeShop) {
  CoffeeShop.isOpen = function(id, next) { /* ... */ };
  
  CoffeeShop.remoteMethod(
    'isOpen',
    {
      description : 'See if this shop is open right now',
      accepts: [ {
        arg: 'id',
        type: 'number',
        description: 'Model id',
        required: true,
        http: { source: 'path' }
      } ],
      accessType: 'READ',
      returns: { arg: 'isOpen', type: 'boolean' },
      http: [ { verb: 'get', path: '/:id/status' } ]
  });
};
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
