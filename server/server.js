'use strict';

var path = require('path'),
    express = require('express'),
    serveStatic = require('serve-static'),
    // Routes
    staticPages = require('./routes/static'),
    presentations = require('./routes/presentation'),
    markdownFiles = require('./routes/markdown');


// ---------------- Primary Server Config --------------- //

var server = express();
server.set('port', process.env.PORT || 3000);
server.set('view engine', 'jade');
server.set('views', path.join(__dirname, '..', 'views'));
server.set('public', path.join(__dirname, '..', 'public'));

server.use('/presentations/', markdownFiles({
  prefix      : '@module/',
  src         : path.join(server.get('public'),'presentations'),
  includePath : path.join(server.get('public'),'presentations', 'modules')
}));

server.use(serveStatic(server.get('public')));

server.use('/', staticPages);
server.use('/', presentations);

server.use(function(req, res, next) {
    var err = new Error('Sorry, but that page wasn\'t found!');
    err.status = 404;
    return next(err);
});
server.use(require('./helpers/errorHandler')());


// ------------------- Main Server Startup ------------------ //

server.listen(server.get('port'), function() {
    console.info('Training server started successfully on port ' + server.get('port'));
});
