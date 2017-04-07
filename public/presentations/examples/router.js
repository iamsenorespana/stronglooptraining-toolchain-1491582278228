'use strict';

var urlParser = require('url');

var routes = {
    '/': '<h1>Welcome to StrongLoop!</h1>',
    '/about-us': '<h1>StrongLoop is the bees knees.</h1>',
    '/events': '<h1>Come find us at these great events!</h1>'
};

module.exports = function routeRequests(req, cb) {
    var url = urlParser.parse(req.url, true);
    
    if (routes[ url.pathname ]) {
        
        process.nextTick(function() {
            
            cb( null, routes[ url.pathname ] );
            
        });
        
    } else {
        console.warn('Oops, couldn\'t route to ' + req.url);
        
        var err = new Error('Not Found');
        err.code = 404;
        cb(err);
    }
};