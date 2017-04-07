![](/images/StrongLoop.png)

# API Security, Customization, and Mobile Backends

![{{speaker}}]()

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

# Working with Data Models

---

## Creating a Model via CLI

```bash
~/my-app$ slc loopback:model
[?] Enter the model name: CoffeeShop
[?] Select the data-source to attach CoffeeShop to: (Use arrow keys)
❯ mdb (mongodb)
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
  ...
[?] Required? (y/N)
```

When complete, simply hit "enter" with a blank property

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

### CoffeeShop Routes

`http://localhost:3000/api/CoffeeShops`

```no-highlight
[]
```

We don't have any coffee shops yet,  
so we get an empty array!

---

<!-- .slide: data-background="white" -->

<http://localhost:3000/explorer>

![inline](/images/lb-explorer.png)

---

<!-- .slide: data-background="white" -->

![fit](/images/lb-coffeeshop-rest.png)

^ Show the swgger UI, walk through various endpoints and try them out!
Be sure to mention how we're using in-memory DB!

---

## Relationship Modeling

---

### Various Relationship Types

* HasMany
* HasManyThrough
* HasAndBelongsToMany
* Polymorphic
* Embedded (embedsOne and embedsMany)

We also have a special "ownership" relation:

* "BelongsTo"

---

### Relationship Definition

```js
// common/models/coffee-shop.json
{
  "name": "CoffeeShop",
  // ...,
  "relations": {
    "reviews": {
      "type": "hasMany",
      "model": "Review"
    }
  }
}
```

---

### BelongsTo Relationships (Ownership)

```js
// common/models/review.json
{
  "name": "Review",
  // ...,
  "relations": {
    "reviewer": {
      "type": "belongsTo",
      "model": "User"
    }
  }
}
```

---

# Authentication and Authorization

---

## LoopBack Auth Models

* User
* Principal
* Role
* RoleMapping
* ACL

---

### Principals

An entity that can be identified or authenticated

* A user
* A role
* An application

^ Represents identities of a request to protected resources.

---

### Roles and Mappings

A `Role` is a group of principals with the same permissions.

RoleMappings are used to map principals onto Roles.

---

### Dynamic Roles

Some dynamic roles already exist for you:

* `$everyone` (regardless of authorization status)
* `$unauthenticated`
* `$authenticated`
* `$owner` (using a `belongsTo` relation)

^ Organizes principals into groups so they can be used.

---

## Creating New Roles

```js
// server/boot/roles.js
module.exports = function(app) {

    app.models.Role.create({
        
        name: 'admin'
        
    }, function(err, theAdminRole) {
        if (err) { cb(err); }
        
        // Maybe add some users to it?
    });
    
};
```

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

### Custom Dynamic Roles

Use `Role.registerResolver()` to set up a custom role handler:

```js
// server/boot/roles.js
Role.registerResolver('admin', function(role, context, cb) {
    
    // custom method you create to determine this...
    determineAdminStatus(function(err, isAuthorized) {
        
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

## Access Control Layers

A layer defines what access a principal has for a certain operation against a specific model.

---

### Whitelisting

For example, we might create these layers:

* Deny everyone to access the model
* Allow '$everyone' role to read instances
* Allow '$authenticated' role to create instances
* Allow '$owner' to update an existing instance

This is an example of "whitelisting", and is safer than denying specific operations.

---

### Defining an ACL

We use the `slc loopback:acl` subcommand:

```bash
~/my-app$ slc loopback:acl
```

---

### Defining an ACL

The CLI will ask you some questions...

```bash
~/my-app$ slc loopback:acl
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: All users
? Select the permission to apply: Explicitly deny access
```

---

### Defining an ACL

Now allow everyone to read CoffeeShops:

```bash
~/my-app$ slc loopback:acl
? Select the model to apply the ACL entry to: CoffeeShop
? Select the ACL scope: All methods and properties
? Select the access type: Read
? Select the role: All users
? Select the permission to apply: Explicitly grant access
```

---

### Defining an ACL

Here's what this looks like in the config file:

```js
// in common/models/coffee-shop.json
"acls": [
  {
    "accessType": "*",
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "DENY"
  },
  {
    "accessType": "READ",
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "ALLOW"
  }
]
```

---

### Defining ACLs

Access Control Layers execute in order, so be sure to DENY first,
then add all of your "whitelisting".

---

### Using Owners

By creating a `belongsTo` relation, we can use `$owner`:

```js
"acls": [
  // ...,
  {
    "accessType": "WRITE",
    "principalType": "ROLE",
    "principalId": "$owner",
    "permission": "ALLOW"
  }
]
```

---

### Restricting Specific Methods

We can ALLOW or DENY access to specific remote methods:

```js
"acls": [
  // ...,
  {
    "accessType": "EXECUTE",
    "principalType": "ROLE",
    "principalId": "admin",
    "permission": "ALLOW",
    "property": "create"
  }
]
```

---

## Advancing Your API

---

### Remote Methods

A way to create new, non-CRUD methods on your model.

---

### Remote Methods

First, define the handler function...

```js
// common/models/coffee-shop.js
module.exports = function(CoffeeShop){
    
    CoffeeShop.status = function(id, cb) {
        CoffeeShop.findById(id, function(err, shop) {
            if (err) { return cb(err); }
            
            cb( null, determineStatus() );
        });
    };
    
    // ...
};
```

---

### Remote Methods

Then define the API spec...

```js
// common/models/coffee-shop.js
module.exports = function(CoffeeShop){
    
    CoffeeShop.status = function(id, cb) { /* ... */ }

    CoffeeShop.remoteMethod(
        'status',
        {
            accepts: [ {
                arg: 'id',
                type: 'number',
                required: true,
                http: { source: 'path' }
            } ],
            returns: { arg: 'isOpen', type: 'boolean' },
            http: [ {verb: 'get', path: '/:id/status'} ]
        }
    );
};
```

---

### Accessing Remote Methods

A `GET` request to `/api/CoffeeShops/1/status` might return:

```
{ isOpen: true }
```

---

### Restricting Remote Methods

Remember, we can ALLOW or DENY access to specific remote methods on a model, including custom ones!

```js
"acls": [
  // ...,
  {
    "accessType": "EXECUTE",
    "principalType": "ROLE",
    "principalId": "$unauthenticated",
    "permission": "DENY",
    "property": "status"
  }
]
```

---

### Getting the Current User

At any point in your application you can get the current user access token, and the user ID:

```js
// common/models/coffee-shop.js

var loopback = require('loopback');

module.exports = function(CoffeeShop) {

    CoffeeShop.status = function(id, cb) {
        var context = loopback.getCurrentContext();
        var token = context.get('accessToken');
        
        console.log( 'Access Token ID', token.id );
        console.log( 'Current User ID', token.userId );
    };

};
```

---

## Connecting to the Front End

LoopBack has client SDKs for Angular, iOS, Android, and Xamarin!

---

### Step One

The first step is to generate the client code.

Here we use the Angular generator:

```bash
~/my-app$ mkdir client/js/services

~/my-app$ lb-ng server/server.js client/js/services/lb-services.js
```

---

### Angular Models

LoopBack provides models for you to use in Angular which have all of 
the remote methods (`create`, `find`, `destroy`, etc).

For `User` objects this includes the `login()` method!

---

### Angular Models

When you create your application modules, just include the LoopBack
Services we created from the CLI:

```js
angular.module('my-app', ['ui.router', 'lbServices'])
    
    .config( ... )
    
    .run( ... );
```

---

### Creating an Auth Service

Now we can create an Angular service for authentication:

```js
angular.module('my-app').factory(
    'AuthService',
    ['User', '$q', '$rootScope', function(User, $q, $rootScope) {
        
        function login(email, password) {
            return User
                .login({ email: email, password: password })
                .$promise
                .then(function(response) {
                    $rootScope.currentUser = {
                        id: response.user.id,
                        tokenId: response.id
                    };
                });
        }
        
        return {
            login: login
        };
    }]
);
```

---

### Creating an Auth Service

The `logout()` method is easy!

```js
function logout() {
    return User
        .logout()
        .$promise
        .then(function() {
            $rootScope.currentUser = null;
        });
    };
```

---

### Creating an Auth Service

When you use the `User.login()` method (and it is successful), LoopBack
will send an `Authorization` header with each request containing the
`accessToken`!

---

## Using 3rd Party Auth

Integrating with 3rd party authentication services is easy!

Just use the [`passport` LoopBack component](https://github.com/strongloop/loopback-component-passport).

---

### 3rd Party Auth

The basic workflow is:

1. Visitor clicks "login with X" button (i.e. Facebook (FB))
1. LoopBack (LB) redirects to FB login page
1. FB redirects to your LB server
1. LB requests access token from FB
1. LB uses token to get user info
1. LB matches info to internal `User` model
  * (LB creates the user locally if it doesn't exist)
1. User info is added to the LB context

---

### 3rd Party Auth

First, install the passport component:

```bash
~/my-app$ npm install --save loopback-component-passport
```

Then set up a `PassportConfigurator`...  
(This is the piece that connects LoopBack to Passport.)


---

### Configuring Passport

We need to configure Passport, a boot script works:

```js
// server/boot/setup-auth.js
var loopback = require('loopback'),
    PPConfigurator = require('loopback-component-passport').PassportConfigurator;

module.exports = function(app) {
    // Enable http sessions
    app.use(loopback.session({ secret: 'super-secret-string' }));
    
    var configurator = new PPConfigurator(app);
    configurator.init();
    configurator.setupModels({
        userModel: app.models.user,
        userIdentityModel: app.models.userIdentity,
        userCredentialModel: app.models.userCredential
    });
    
    configurator.configureProvider('facebook-login', {
        // ...
    });
};
```

---

### Configuring Passport

And here is our Facebook-specific config...

```js
// server/boot/setup-auth.js

...
module.exports = function(app) {
    // ...
    
    configurator.configureProvider('facebook-login', {
        provider: 'facebook',
        module: 'passport-facebook',
        clientID: '{your-FB-client-id}',
        clientSecret: '{your-FB-client-secret}',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        authPath: '/auth/facebook',
        callbackPath: '/auth/facebook/callback',
        successRedirect: '/auth/account',
        scope: ['email']
    });
};
```

---

### Additional Passport Steps

* Fill in your FB/Google/etc app details
* Create a UI button linking to `/auth/facebook`
* Set up a page at `/auth/account` (or wherever `successRedirect` points)
* Add other auth providers!

See an example app here:

<https://github.com/strongloop/loopback-example-passport>

---

## Being an OAuth Provider

Want to be your own OAuth provider?  
(instead of using Facebook, Google, etc)

---

## Being an OAuth Provider

You can use StrongLoop's [oauth2 LoopBack component](https://github.com/strongloop/loopback-component-oauth2/)!

```bash
~/my-app$ npm install --save loopback-coponent-oath2
```

_* Note that this component requires a license._
<!-- .element: style="display:block;margin-top:3em;font-size:0.8em;color:#666" -->

---

### Configure OAuth

```js
// server/boot/oauth.js

var oauth2 = require('loopback-component-oauth2');

module.exports = function(app) {
    
    oauth2.oAuth2Provider( app, {
        dataSource': app.dataSources.mydb,
        authorizePath': '/oauth/authorize',
        loginPage': '/login',
        loginPath': '/login'
    });
    
};
```

Full options can be found on [docs.strongloop.com](http://docs.strongloop.com/display/LB/OAuth+2.0)

---

### OAuth Login

Don't forget that you still need to code the **login page**!

And you will also need a callback URL for the authorization action.

---

### OAuth Lock Down

Now we configure the resource endpoints we're locking down:

```js
// server/middleware.json

"auth": {
  "loopback-component-oauth2#authenticate": {
    "paths": [ "/api" ],
    "params": {
      "session": false,
      "scopes": {
        "reviews": [ "/api/Reviews" ],
        "user": [
          {
            "methods": ["find", "findById", "destroy", "save"],
            "path": "/api/Users"
          }
        ]
      }
    }
  }
}
```

^Be sure to mention that LB uses "phases" to abstract middleware

---

### What about rate limiting and proxy?

Create more middleware at specific phases.

Capture the request and evaluate before passing it on.

**Centralized in front of your resource server**!

---

### Demo Project

<https://github.com/jakerella/lb-central>

You can use this demo project as a starting point:

```bash
~$ git clone https://github.com/jakerella/lb-central.git

~$ cd lb-central && npm install
```

_NOTE: This code is licensed by StrongLoop, you will need a license to use it!_
<!-- .element: style="display:block;margin-top:3em;font-size:0.8em;color:#666" -->

---

## Rate Limiting Your API

Control how many requests a client can  
make within a time period.

Simply add the middleware config!

---

### Configure Rate Limiting

```js
"routes:after": {
  "./middleware/rate-limiting": {
    "params": {
      "interval": 60000,
      "keys": {
        "ip": 100,
        "url": {
            "template": "url-${urlPaths[0]}/${urlPaths[1]}",
            "limit": 500
        },
        "user": {
            "template": "user-${user.id}",
            "limit": 1500
        },
        "app,user": {
            "template": "app-${app.id}-user-${user.id}",
            "limit": 2500
        }
      }
    }
  }
}
```

---

## Request Proxies

Once the the user is authenticated, rate limiting is compelte, and any
other centralized code, we can proxy requests to their final destination.

---

### Proxying Requests

Send requests from this server to the resource server(s):

```js
// in middleware.json

"routes:after": {
  "./middleware/proxy": {
    "params": {
      "rules": [
        "^/api/foo/(.*)$ https://service-one.com:3007/api/$1 [P]",
        "^/api/bar/(.*)$ https://service-two.com:3001/api/v2/$1 [P]"
      ]
    }
  }
}
```

---

# Thank You!

### Questions?

<br style='margin-top:1.5em'>

![{{speaker}}]()

Join us for more events!  
[strongloop.com/developers/events](https://strongloop.com/developers/events/)
