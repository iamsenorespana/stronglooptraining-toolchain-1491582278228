'use strict';

var http = require('http'),
    router = require('./router');

var server = http.createServer(function handleRequests(req, res) {
    router(req, function completeRequest(err, content) {
        var code = 200,
            body = '';
        
        if (err) {
            
            console.error(err.stack);
            
            code = err.code || 500;
            body = err.message;
        } else {
            body = content;
        }
        
        res.writeHead( code, { 'Content-Type': 'text/html' } );
        res.end( body );
    });
});

server.listen(8080, function() {
    // All done
    console.log('The server is up!');
});