
## Run the Application

```no-highlight
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

<http://localhost:3000/explorer>

![inline](/images/lb-explorer.png)
<!-- .element: class="fragment" -->

---

<!-- .slide: data-background="white" -->

### Model REST API Endpoints

<img class='fragment' src='/images/lb-coffeeshop-rest.png' style='width: 85%;position: relative;top: -1em;'>

---

## Using Filters to Find Records

---

### Using Filters

`/api/CoffeeShops`

```js
[
  { "id": 1, "name": "Crema" },
  { "id": 2, "name": "Kaldi" },
  { "id": 3, "name": "Starbucks" },
  { "id": 4, "name": "JJ's" }
]
```


`/api/CoffeeShops?filter={"where":{"name":"Starbucks"}}`
<!-- .element: class="fragment" -->

```js
[
  { "id": 3, "name": "Starbucks" }
]
```
<!-- .element: class="fragment" -->

---

### The `where` Filter

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
