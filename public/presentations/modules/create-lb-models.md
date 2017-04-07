
## Creating Data Models

---

### Creating Models

Different ways...

1. UI: `~/my-app$ slc arc` and Composer
1. UI: Discover from existing SQL data source
1. CLI: `~/my-app$ slc loopback:model`
1. Write JSON config files in `/common/models`
1. Programmatically

---

## Composer

![fit](/images/composer.png)

---

## Creating a Model via CLI

<pre><code class='lang-no-highlight'>~/coffee-reviews$ <strong>slc loopback:relation</strong></code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Enter the model name: <strong style='color:navy'>CoffeeShop</strong>
? Select the data-source to attach CoffeeShop to: <strong style='color:navy'>my-data (mongodb)</strong>
? Select model's base class <strong style='color:navy'>PersistedModel</strong>
? Expose CoffeeShop via the REST API? <strong style='color:navy'>Yes</strong>
? Custom plural form (used to build REST URL):
? Common model or server only? <strong style='color:navy'>common</strong></code></pre>

---

## Creating a Model via CLI

<pre class='fragment'><code class='lang-no-highlight'>Let's add some CoffeeShop properties now.
? Property name: <strong style='color:navy'>name</strong>
? Property type: (Use arrow keys)
<strong style='color:navy'>❯ string</strong>
  number
  boolean
  object
  array
  date
  buffer
[?] Required? <strong style='color:navy'>Yes</strong></code></pre>

Hit 'enter' on a blank property name to save the model config!
<!-- .element: class="fragment" -->

^Right now, you're going to define one property, "name," for the CoffeeShop model.

---

### Review the Model Config

`common/models/coffee-shop.json`

```js
{
  "name": "CoffeeShop",
  "base": "PersistedModel",
  "strict": false,
  "idInjection": false,
  "options": {
    "validateUpsert": true
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

# Model Config Detail

```js
{
  "name": "Person",      // Name of the model
  "plural": "People",    // Custom plural form
  "description": "A Person model representing our people.",
  "base": "User",        // Parent model to extend
  "idInjection": false,  // id property is added to the model automatically or not
  "strict": true,        // the model accepts only predefined properties or not
  "options": { ... },    // data source-specific options
  "properties": { ... }, // model properties
  "hidden": [...],       // hide data from HTTP response
  "relations": {...},    // model relationships
  "acls": [...],         // access control lists
  "scopes": {...},       // define named queries for models
  "indexes" : { ...},    // DB-level indices
  "http": { "path": "/foo/mypath" }  // custom http endpoint properties
}
```
