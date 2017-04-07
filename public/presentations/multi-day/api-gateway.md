
![](/images/StrongLoop.png)

# API Gateway

---

## What is it?

A Gateway externalizes, secures, and manages APIs.

It acts as an intermediary between API consumers (clients) and backend API providers (API servers).

^ Note that this is a premium feature and requires a paid license

---

## What is a Gateway?

* Centralized Security
* Mediation and Transformation
* Rate Limiting and Throttling
* Performance Monitoring and Reporting
* Virtualization (proxy)

---

<!-- .slide: data-background="white" -->

![fit](/images/async-gateway.png)

---

## API Request Flow

1. Client requests access token from gateway
<!-- .element: class="fragment" -->
1. Client sends request with token for resource to gateway
<!-- .element: class="fragment" -->
1. Gateway validates token (expiration, scope, ownership)
<!-- .element: class="fragment" -->
1. Metrics middleware fires
<!-- .element: class="fragment" -->
1. Rate limiting / throttling middleware fires
<!-- .element: class="fragment" -->
1. Proxy middleware fires (forward req to Resource server)
<!-- .element: class="fragment" -->
1. Resource server processes request and produces response
<!-- .element: class="fragment" -->
1. Response relayed to client by gateway
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

### Request-Response Pipeline

![](/images/gateway-pipeline.png)

^ Note that the gateway adds information to the context at each layer in the pipeline.  
This information can be inspected and evaluated at each subsequent level through the application of additional middleware.

---

## Gateway Setup

<ol>
    <li class='fragment'>Have an existing resource server (LoopBack app)</li>
    <li class='fragment'>
        Clone [strong-gateway](https://github.com/strongloop/strong-gateway)<br>
        `~$ git clone https://github.com/strongloop/strong-gateway gateway-server`
    </li>
    <li class='fragment'>
        Install dependencies<br>
        `~$ cd gateway-server && npm install`
    </li>
    <li class='fragment'>[Configure middleware](https://github.com/strongloop/strong-gateway-demo/tree/master/notes-app-gateway#change-the-default-auth-server-ports) (server ports, https-redirect, etc)</li>
</ol>

---

### Proxying Requests

We need to send requests from this gateway to the resource server(s):

```js
// in middleware.json

"routes:after": {
  "./middleware/proxy": {
    "params": {
      "rules": [
        "^/api/(.*)$ http://otherserver.com:3007/api/$1 [P]"
      ]
    }
  }
}
```

---

### Proxy Rules

Each rule in the proxy setup follows this format, but the flag must be `[P]` for proxies.

`matching_paths replace_with [flags]`

^ Note that for now, [P] is the only flag, but more will be added.

---

### Configure Authentication

Add in some authentication middleware:

```js
"auth": {
  "loopback-component-oauth2#authenticate": {
    "paths": [ "/api" ],
    "params": {
      "session": false,
      "scopes": {
        "demo": [ "/api/someModels" ],
        "someModel": [
          {
            "methods": "all",
            "path": "/api/someModels"
          }
        ]
      }
    }
  }
}
```

^ In /server/middleware.json

---

### Configure Authentication

We also need to configure the oauth2 component in `server/component-config.json`:

```js
{
  "loopback-component-oauth2": {
    "dataSource": "mydb",    // Name of the data source for oAuth2 metadata
    "loginPage": "/login",   // The login page url
    "loginPath": "/login",   // The login processing url
    "authorizationServer": true,
    "resourceServer": true   // Is this also the resource server?
  }
}
```

---

## Collecting Metrics

The [StrongLoop Process Manager](https://strong-pm.io/) will collect API metrics
for you and display them in [Arc](https://strongloop.com/node-js/arc/).

Simply add the middleware piece to `server/middleware.json`:


```js
"initial:before": {
  "strong-express-metrics": {}
}
```

---

## Collecting Metrics

By default `strong-express-metrics` will send API statistics to the StrongLoop supervisor.

If you aren't using StrongLoop Process Manager you can still collect these metrics, but you will need to configure the module.

See the [Github repo](https://github.com/strongloop/strong-express-metrics) for details!

---

## Rate Limiting Your API

Control how many requests a given client can make within a time period.

This helps ensure QoS and allows for "premium" API scaling.

Simply add the middleware config!

---

### Configure Rate Limiting

```js
"routes:after": {
  "./middleware/rate-limiting": {
    "params": {
      "limit": 100,
      "interval": 60000,
      "keys": {
        "ip": 500,
        "url": { "template": "url-${urlPaths[0]}/${urlPaths[1]}”, "limit": 1000 },
        "user": { "template": "user-${user.id}”, "limit": 1000 },
        "app,user": { "template": "app-${app.id}-user-${user.id}”, "limit": 1000 }
      }
    }
  }
}
```

---

## Gateway Demo App

[Demo application (with tutorial) on Github](https://github.com/strongloop/strong-gateway-demo)

```
~$ git clone https://github.com/strongloop/strong-gateway-demo.git
```

^ This is really for people to try later on their own

---

# fin
