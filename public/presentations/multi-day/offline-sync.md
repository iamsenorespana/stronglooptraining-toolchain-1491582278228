
![](/images/StrongLoop.png)

# Offline Synchronization

---

## Why and How?

Mobile applications need to be able to operate without constant network connectivity.

Client apps must synchronize data with the server application after reconnection!

---

## Synchronization

1. Disconnect occurs
1. Client app handles local changes
1. Server has changes from other sources
1. On client reconnection:
  * client sends local changes to server
  * server replocates changes from client with server changes
  * client applies final changeset from server

---

### "Replication"?

Replication means intelligently copying data from one location to another.

LoopBack copies data that has changed from source to target, but does not 
overwrite data that was modified on the target since the last replication.

^ The LoopBack replication API is a JavaScript API, and thus (currently, at least) works only with a JavaScript client.

---

### Conflict Resolution

_There may be conflicts when performing replication!_

For example:

1. Client 1 disconnects
1. User 1 changes data on client
1. User 2 changes same data point on different client
1. Client 1 reconnects

LoopBack can handle conflict resolution for you, or you can present a UI to allow user to decide.

^ Currently synchronization is built-in to LoopBack, but will be refactored into a component in the future.

---

### Isomorphic JavaScript

LoopBack implements synchronization using the LoopBack browser API, that provides the same client JavaScript API as for Node.  Thus, LoopBack in the browser is sometimes referred to as isomorphic, because you can call exactly the same APIs on client and server.

---

### Browser Side

LoopBack in the browser uses Browserify to handle dependencies.

If you wish, you can use build tools such as Gulp or Grunt to generate the client API based on the back-end models and REST API.

---

## Enabling Offline Sync

You must enable change tracking for each model that you want to be able to access offline.  Make the following change to the Model definition JSON file:

* Set trackChanges to true.
* Change the id property to an auto-generated GUID; for information on GUIDs.
* Set strict property to validate.
* Set the persistUndefinedAsNull property to true.

---

### A Simple TODO Model

`common/models/todo.json`:

```js
{
  "name": "Todo",
  "base": "PersistedModel",
  "strict": "validate",
  "trackChanges": true,
  "persistUndefinedAsNull": true,
  "id": {
    "id": true,
    "type": "string",
    "defaultFn": "guid"
  },
  "title": {
    "type": "string",
    "required": true
  },
  "description": {
    "type": "string"
  }
}
```

---

### Change Tracking

For each change-tracked model, a new model (database table) is created to contain change-tracking records. In the example above, a Todo-Change model will be created. The change model is attached to the same data source as the model being tracked.

Therefore, you will need to migrate your database schema after you have enabled change tracking, for example using StrongLoop Arc.

---

### Change Tracking

The change-tracking records are updated in background. Any errors are reported via the static model method handleChangeError. It is recommended to provide a custom error handler in your models, as the default behavior is to throw an error.


```js
module.exports = function(Todo) {
  Todo.handleChangeError = function(err) {
    console.warn('Cannot update change records for Todo:', err);
  };
}
```

---

### The Client

The next step is to create client-side LoopBack app. For each replicated model, create two new client-only subclasses:

* A local model that will use local storage to persist the changes offline
* A remote model that will be connected to the server and used as a target for replication.

^ This model will have change tracking disabled (because the server is already handling it) and enable only the replication REST API.

---

### The Client

For example, for the To Do example, here is the JSON file that defines the client local model:

`client/models/local-todo.json`:

```js
{
  "name": "LocalTodo",
  "base": "Todo"
}
```

---

### The Client

Here is the JSON file that defines the client remote local model:

`client/models/remote-todo.json`:

```
{
  "name": "RemoteTodo",
  "base": "Todo",
  "plural": "Todos",
  "trackChanges": false,
  "enableRemoteReplication": true
}
```

---

### The Client

And here is the client model configuration JSON file:

`client/model-config.json`

```
{
  "_meta": {
    "sources": ["../../common/models", "./models"]
  },
  "RemoteTodo": {
    "dataSource": "remote"
  },
  "LocalTodo": {
    "dataSource": "local"
  }
}
```

---

### Client Data Sources

Here is the JSON file that defines the client datasources:

`client/datasources.json`

```
{
  "remote": {
    "connector": "remote",
    "url": "/api"
  },
  "local": {
    "connector": "memory",
    "localStorage": "todo-db"
  }
}
```

---

### Doing the Sync

Now that you have all models in place, you can set up bi-directional replication between LocalTodo and RemoteTodo:

```
  var LocalTodo = client.models.LocalTodo;
  var RemoteTodo = client.models.RemoteTodo;

  var since = { push: -1, pull: -1 };

  function sync() {
    // It is important to push local changes first,
    // that way any conflicts are resolved at the client
    LocalTodo.replicate(
      ...
```

---

### Browserifying

The loopback-boot module provides a build tool for adding all application
metadata and model files to a Browserify bundle. Browserify is a tool that
packages Node.js scripts into a single file that runs in a browser.

---

### Browserifying

Below is a simplified example packaging the client application into a browser "module" that can be loaded via require('lbclient'). Consult build.js in loopback-example-full-stack for a full implementation that includes source-maps and error handling.

```js
var b = browserify({ basedir: __dirname });
b.require('./client.js', { expose: 'lbclient '});

boot.compileToBrowserify({ appRootDir: __dirname }, b);

var bundlePath = path.resolve(__dirname, 'browser.bundle.js');
b.pipe(fs.createWriteStream(bundlePath));
```

---

### Understanding replication

Offline data access and synchronization has three components:

* Change tracking
* Replication of changes
* Browser version of LoopBack

---

### Replication algorithm

A single iteration of the replication algorithm consists of the following steps:

1. Create new checkpoints (both source and target)
1. Get list of changes made at the source since the given source checkpoint
1. Find out differences between source and target changes since the given target checkpoint, 1. detect any conflicts.
1. Create a set of instructions - what to change at target
1. Perform a "bulk update" operation using these instructions
1. Return the new checkpoints to the callback

---

### Sync methods

The LoopBack Model object provides a number of methods to support sync, mixed in via the DataModel object:

* `bulkUpdate` - Apply an update list.
* `changes` - Get the changes to a model since a given checkpoint. Provide a filter object to * `reduce the number of results returned.
* `checkpoint` - Create a checkpoint.
* `createUpdates` - Create an update list for Model.bulkUpdate() from a delta list from Change.diff().

---

### Sync methods

* `currentCheckpoint` - Get the current checkpoint ID.
* `diff` - Get a set of deltas and conflicts since the given checkpoint.
* `enableChangeTracking` - Start tracking changes made to the model.
* `getChangeModel` - Get the Change model.

---

### Sync methods

* `getSourceId` - Get the source identifier for this model / dataSource.
* `handleChangeError` - Handle a change error. Override this method in a subclassing model to * `customize` change error handling.
* `rectifyChange` - Tell LoopBack that a change to the model with the given ID has occurred.
* `replicate` - Replicate changes since the given checkpoint to the given target model.
* `findLastChange` - Get the last (current) Change object for a given model instance.
* `updateLastChange` - Update the last (current) Change object associated with the given model instance.

---

## Example Application

You can see a full implementation of these concepts at the following location:

<https://github.com/strongloop/loopback-example-offline-sync>

---

# fin
