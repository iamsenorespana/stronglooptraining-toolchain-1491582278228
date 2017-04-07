
![](/images/StrongLoop.png)

# Real-Time Communication

---

# Real-Time Communication

Polling vs Server Sent Events vs Websockets

---

## Server Sent Events

* HTML5 server side events (SSEs) is an EventSource API.
* SSEs open a single, unidirectional channel from server to client.
* SSEs are sent over traditional HTTP (no special protocol or server implementation)

^ `EventSource` extends `EventTarget`, like `Element` (has `addEventListener` etc.)

---

### Client Side

```js
if (!!window.EventSource) {
    var source = new EventSource('/events');
} else {
    // Fallback to xhr polling :(
}
```

---

### Client Side

Adding event listeners:

```js
source.addEventListener('message', function(e) {
    console.log(e.data);
}, false);

source.addEventListener('open', function(e) {
    // Connection was opened.
}, false);

source.addEventListener('error', function(e) {
    if (source.readyState == EventSource.CONNECTING) {
      // Attempting to reconnect
    }
}, false);
```

---

### Server Side

_(inside request handler)_

```js
if (req.headers.accept &&
    req.headers.accept === 'text/event-stream' &&
    req.url === '/events') {
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    
    res.write('id: ' + id + '\n');
    res.write('data: ' + data + '\n\n');
}
```

^ send `'event: foo\n'` to emit a `foo` event on client `EventSource`

no `event` specified: defaults to `message` 

---

## WebSockets

API enabling Web pages to use **two-way communication** with remote host.

[API Specification](http://www.w3.org/TR/websockets/)

---

### WebSockets vs SSE

* WebSockets are bi-directional communication protocol
* No automatic reconnect
<!-- .element: class="fragment" -->
* Not all browsers fully support protocol (ws)
<!-- .element: class="fragment" -->
* Need WebSocket server to handle requests/responses
<!-- .element: class="fragment" -->

---

### WebSocket Module

```bash
~/my-app$ npm install --save ws
```

^ requires native bin build

---

### WebSocket Module

```js
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function(ws) {
    
    ws.send('XYZ');
    
    ws.on('message', function(message) {
        console.log('received:', message);
    });
});
```

---

### WebSocket Client

```js
if (window.WebSocket) {
    var ws = new WebSocket(
        'ws://localhost:3000',
        'echo-protocol'
    );
} else {
    // Fallback to xhr polling :(
}
```

```js
ws.onopen = function(event) {
    ws.send('sending to the server...');
};

ws.onmessage = function(event) {
    console.log('server message: ', event.data);
};
```
<!-- .element: class="fragment" -->

---

## Socket.IO

* Oldest realtime communication library for JavaScript
<!-- .element: class="fragment" -->
* High-level library supporting custom events, broadcasting, channels
<!-- .element: class="fragment" -->
* Falls back to XHR long polling as needed (cross-browser!)
<!-- .element: class="fragment" -->

---

### Socket.IO + Express == <3

```js
var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

// other setup...

io.on('connection', function( socket ) {
    socket.on('chat message', function( msg ) {
        io.emit('chat message', msg);
    });
});

http.listen(3000);
```

^ "Where's `app.listen()`?"

An express app is, in fact, a nodecore.HTTP request handler function, so it can
be passed to `httpServer.onRequest` or constructor. `app.listen()` is just
convenience fn

---

### Socket.IO Client

```js
var socket = io('http://localhost:3000');

socket.on('chat message', function (data) {
    myDiv.innerHTML += data;
});

myForm.addEventListener('submit', function() {
    socket.emit('chat message', 'Here I am!');
});
```

_Full example code: [bit.ly/socketio-chat](http://bit.ly/socketio-chat)_

---

## Alternatives

---

### Engine.IO

* low-level WebSocket abstraction layer
* transport layer for Socket.IO 1.x

---

### SockJS

* low-level WebSocket abstraction layer
* downgrade approach - faster, occasionally problematic
* great test coverage
* lots of language implementations

---

### Primus

Abstraction layer that simplifies the development Prevents lock in by allowing for multiple transports

<https://github.com/primus/primus>

---

### Primus Features

Primus' abstraction layer comes with:

* built-in reconnect
* offline detection
* stream compatible interface
* fixes bugs and stability issues in supported realtime libraries

---

### Library Support

Supported realtime libraries:

* Socket.IO *(<v1.0)*
* Engine.IO
* SockJS
* WebSockets
* Faye
* BrowserChannel

---

### Install Primus

```no-highlight
~/my-app$ npm install --save primus
```

Install a realtime library to use with primus:

```no-highlight
~/my-app$ npm install --save engine.io
```

---

### Server Side

Configure primus by specifying a transport layer

```js
var Primus = require('primus'),
    server = require('http').createServer(),
    primusServer = new Primus(server, { transformer : 'engine.io' });

server.listen(3000);
```

---

### Server Side

```js
primusServer.on('connection', function (socket) {
    
    socket.on('data', function (message) {
        console.log('Message received:', message);

        // send a reply
        socket.write({ reply: 'Hi!' });
    });
    
});
```

---

### Managing Disconnects

To handle disconnections, subscribe to the `disconnection` event:

```js
primusServer.on('disconnection', function (socket) {
    // the socket disconnected, do stuff here
});
```

---

### Broadcasting

Send a message to all connected sockets

```js
primusServer.write('some message');
```

---

### Authorization

Support for authorization via the `authorize` function:

```js
primusServer.authorize(function (req, done) {
    // check for authorization
    // i.e. basic auth, check against session, etc
    
    if (checkAuth(req)) {
        // Success!
        return done();
    }
    
    done(new Error('Who are you?'));
});
```

---

### Closing Primus Conenctions

```js
primusServer.end({
    close   : false, // close the HTTP server
    end     : true,  // close all active sockets
    timeout : 5000   // initiate cleanup after this time
});
```

---

### Primus Client Side

```html
<html>
  <head> ... </head>
  <body>
    ...
    
    <script src="/primus/primus.js">< /script>
    <script>
      var primus = new Primus('http://localhost:3000');

      primus.on('open', function() {
        primus.write('Hello world!');
      });

      primus.on('data', function (data) {
        console.log('Message received:', data);
      });
    < /script>
  </body>
</html>
```

---

### Client Side Customization

```js
var primus = new Primus('http://localhost:3000', {
    reconnect : {
        max : 10000,  // in ms
        min : 500,
        retries : 10
    },
    timeout : 10000,
    ping    : 25000
});
```

---

### Reconnectivity

```js
primus.on('reconnect scheduled', function (options) {
    // in the process of a reconnect
});

primus.on('reconnect', function () {
    // runs when a reconnect attempt has started
    // NOTE: another `open` event will also occur!
});
```

---

### Handling Errors

In case of errors, listen to the error event

```js
primus.on('error', function (err) {
    // handle the error here
});
```

---

### Disconnection From Server

The `end` event will fire when closed from either side:

```js
primus.on('end', function () {
    // connection closed
});
```

To end the connection from the client:

```js
primus.end();
```

---

# fin
