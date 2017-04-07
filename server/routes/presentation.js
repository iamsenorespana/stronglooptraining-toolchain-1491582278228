'use strict';

var util = require('util'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    groups = {},
    manifest = require(path.join(__dirname, '..', '_manifest.json'));


Object.keys(manifest).forEach(function(key) {
    if (manifest[key].isMulti) {
        groups[key] = manifest[key];
    }
});


function checkAuth(req, res, next) {
    var slugPieces = req.params.slug.split(/\-/);
    
    if (manifest[req.params.slug] && manifest[req.params.slug].auth) {
        return doAuth(req.headers.authorization, req.params.slug, next);
        
    } else if (slugPieces && groups[slugPieces[0]]) {
        return doAuth(req.headers.authorization, slugPieces[0], next);
    }
    
    next();
}

function doAuth(authorization, slug, next) {
    var err = new Error('You must log in to access this content'),
        auth = authorization || '';
    
    err.status = 401;
    
    auth = auth.match(/^basic\s+(.+)$/i);
    auth = new Buffer((auth && auth[1]) || '', 'base64').toString();
    auth = auth.match(/^([^:]+):(.+)$/);
    if (!auth) {
        return next(err);
    }
    
    if (auth[1] !== manifest[slug].auth.user ||
        auth[2] !== manifest[slug].auth.pass) {
        err.message = 'Sorry, but those are not valid credentials for this content. Please try again';
        return next(err);
    }
    
    next();
}

function getPresoForSlug(slug, res, data, slides) {
    var err,
        tmplData = util._extend({}, data);
    
    tmplData.slides = (slides || data.slides);
    
    if (/\.md$/.test(tmplData.slides)) {
        
        res.render('preso-md', tmplData);
        
    } else if (/\.(html|pdf)$/.test(tmplData.slides)) {
        
        res.redirect(tmplData.slides);
        
    } else {
        err = new Error('Invalid presentation manifest entry (check the "slides" property).');
        err.status = 500;
        return err;
    }
    
    return null;
}

router.get('/:slug', checkAuth, function(req, res, next) {
    var err, presoSlides, tmplData,
        slugPieces = req.params.slug.split(/\-/);
    
    if (manifest[req.params.slug]) {
        
        err = getPresoForSlug(req.params.slug, res, manifest[req.params.slug]);
        
    } else if (slugPieces && groups[slugPieces[0]]) {
        tmplData = util._extend({}, groups[slugPieces[0]]);
        tmplData.isMultiContent = true;
        
        presoSlides = slugPieces.slice(1).join('-');
        err = getPresoForSlug(
            presoSlides,
            res,
            tmplData,
            path.join('presentations', 'multi-day', presoSlides + '.md')
        );
        
    } else {
        err = new Error('Sorry, but that presentation does not exist.');
        err.status = 404;
    }
    
    if (err) { next(err); }
});

module.exports = router;
