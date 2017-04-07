
## Step 1: Install API Connect Tools

```bash
~$ npm install -g apiconnect
```

*`apiconnect`, **not** `apic`!*

<div class='fragment' style='margin-top:1em;'>
    <p>And scaffold your application:</p>

    <pre><code>~$ apic loopback</code></pre>
</div>

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
 |_ server
   |_ boot                   # app startup scripts
   |_ config.json            # primary API config
   |_ datasources.json       # data source config
   |_ middleware.development.json # dev middleware config
   |_ middleware.json        # middleware config
   |_ model-config.json      # LB model config
   |_ server.js              # server start script
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
    "context": false,
    "rest": {
      "normalizeHttpPath": false,
      "xml": false
    },
    "json": { ... },
    "urlencoded": { ... },
    "cors": false,
    "handleErrors": false
  },
  "legacyExplorer": false
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
legacyExplorer - enable (& install) for api explorer

---

### Environment-specific configuration

Simply duplicate and rename your config file to:

`config.[ENV].json`

With `[ENV]` referring to the value of `process.env.NODE_ENV`!

This works with all JSON config files.
<!-- .element: class="fragment" -->
