'use strict';

var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/contact', function(req, res) {
    res.redirect('https://strongloop.com/node-js/training/');
});

router.get([ '/events', '/schedule' ], function(req, res) {
    res.redirect('https://strongloop.com/developers/events/');
});

module.exports = router;
