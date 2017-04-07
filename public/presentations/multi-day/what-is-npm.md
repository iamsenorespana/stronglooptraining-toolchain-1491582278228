
![](/images/StrongLoop.png)

# What is npm?

---

![fit](/images/npm.png)

---

### A package manager for Node.

* Website: [npmjs.com](https://www.npmjs.com)
* Command-line tool: `npm`
* Registries: both public and private

_Note that npm is bundled with Node.js!_
<!-- .element: class="fragment" -->

---

### Project Meta Information with `package.json`

---

### `package.json` tracks project info

You should **always** create one!

```no-highlight
~/my-project$ npm init

This utility will walk you through creating a package.json
file.  It only covers the most common items, and tries to
guess sane defaults.
...

Press ^C at any time to quit
name: (my-package-name)
```
<!-- .element: class="fragment" -->

---

### The basic `package.json`

```js
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "This is my project!",
  "main": "main.js",
  "scripts": {
    "test": "grunt test"
  },
  "author": "John Doe <john@doe.com>",
  "license": "MIT"
}
```

^Discuss various "missing" or incorrect items from the basic generated file:
"private": true
don't use version: 1.0.0!

---

## Setting Up npm

Let's also set some basic config values...

```no-highlight
~$ npm set init.author.name "Your Name"
~$ npm set init.author.email "you@example.com"
~$ npm set init.author.url "http://yourblog.com"
```
<!-- .element: class="fragment" -->

Sign up on the npm website and then verify yourself:
<!-- .element: class="fragment" -->

```no-highlight
~$ npm adduser
```
<!-- .element: class="fragment" -->

---

## Installing and Using Packages

---

### Installing Packages

**Locally in a Project**  
_(most of your projects' dependencies: express, lodash, mongodb, etc.)_

```no-highlight
~/my-project$ npm install loopback
~/my-project$ npm install mondodb lodash
```

```no-highlight
~/my-project/mode_modules
|_ lodash
|_ loopback
|_ mongodb
```
<!-- .element: class="fragment" -->

^Discuss node_modules/ directory and nested dependencies

---

### Project dependencies

You should almost always be saving dependencies to your `package.json`:

```no-highlight
~/my-project$ npm install express --save
~/my-project$ npm install grunt --save-dev
```

```js
{
  ...,
  dependencies: {
    "express": "^4.12.4"
  },
  devDependencies: {
    "grunt": "^0.4.5"
  }
}
```
<!-- .element: class="fragment" -->

---

### A word on versions...

Node encourages *Semantic Versioning* (semver)...

```no-highlight
  4   .   2   .   1  
major   minor   patch
```
<!-- .element: class="fragment" -->

---

### A word on versions...

When adding a dependency in Node:

```js
dependencies: {
  "express": "^4.12.4"
},
```

<p class='fragment'>**"^4.12.4"** >> 4.12.5, 4.12.6, 4.13.0, 4.14.1, ~~5.0.0~~</p>

<p class='fragment'>**"~4.12.4"** >> 4.12.5, 4.12.6, ~~4.13.0~~, ~~4.14.1~~, ~~5.0.0~~</p>

<p class='fragment'>**"4.12.*"** >> 4.12.5, 4.12.6, ~~4.13.0~~, ~~4.14.1~~, ~~5.0.0~~</p>

<p class='fragment'>**"*"** >> ಠ_ಠ</p>

---

### Global Packages

Mostly for tools (scaffolding, testing, build, deploy, etc.)

```no-highlight
~$ npm install -g strongloop
~$ npm install -g grunt-cli
```

---

### Basic Module Usage

Step 1: install the package.

```no-highlight
~/my-project$ npm install --save express
```

```js
var express = require('express');

var app = express();
```
<!-- .element: class="fragment" -->

---

### Requiring Modules

Modules can live in different places:

```js
var filesSys = require('fs'),             // core module
    express  = require('express'),        // from /node_modules/
    router   = require('./app/router'),   // file (".js" optional)
    mymod    = require('./my/module/'),   // 'main' file in directory
    config   = require('../config.json'); // import & parse JSON file
```

^ requiring dir will require `main` file as specified in that dir's package.json
or `index.js` by default

---

### How do I use module X?

READ THE DOCS.
<!-- .element: class="fragment" -->

Doesn't have docs? Use a different module.
<!-- .element: class="fragment" -->

---

### Choosing a Module

1. Documentation
<!-- .element: class="fragment" -->
1. Tests
<!-- .element: class="fragment" -->
1. Project Velcity
<!-- .element: class="fragment" -->
1. Community Involvement
<!-- .element: class="fragment" -->

---

### Publishing Your Own Module

```no-highlight
~/my-module$ npm publish
```

Seriously, it's that easy!

(But remember to set `"private": false`)

---

## Private Registries

* Hosted by npmjs, or
* Hosted by you

^Discuss the differences between npmjs.org and enterprise private repositories. Elaborate on how internal can be used and mixed with the public repository.

---

## Private Registries

* Code is not exposed to outside world
* No external dependencies (if self-hosted)

---

## Listing Modules

In your project...

```bash
~/my-project$ npm ls
/home/johndoe/node-app
|__ q@1.0.1
```

Globally...

```bash
~$ npm ls -g
/usr/lib
|__ bower@1.3.11
  |__ abbrev@1.0.5
  |__ archy@0.0.2
|__ semver@4.0.0
```

^ here using `--depth=0`, `--depth=1`

---

## Searching for Modules

```no-highlight
$ npm search [keyword]
```

Or just use [npmjs.com](http://npmjs.com)!

^ or use google; npm's search doesn't work well at all c.2015

---

## Update Dependencies

To update an npm module, use the update command

```no-highlight
~/my-project$ npm update mysql
```

Or update all dependencies...

```no-highlight
~/my-project$ npm update
```

---

## Remove a module

To remove an npm module

```no-highlight
~/my-project$ npm rm mysql
```

_(Does **NOT** remove the dependency!)_

```no-highlight
~$ npm rm mysql -g
```
<!-- .element: class="fragment" -->

---

# fin
