/* jshint strict: false */
var express = require('express'),
    path = require('path'),
    async = require('async'),
    fs = require('fs'),
    extend = require('extend');

/**
 * Usage :
 *
 * app.use('/presentations/', markdownIncluder({
 *  prefix      : '@module/',
 *  src         : 'path/to/mainMDfiles/',
 *  includePath : 'path/to/includes
 * });
 *
 *  path/to/mainMDfiles/foo.md===========
 *  
 *  # Here's a title
 *
 *  @module/menu
 *
 *  **the end**
 *
 *  path/to/includes/menu.md=============
 *
 *  * included file here
 *  * menu items
 *
 * Known issues:
 *
 * Currently only works with .md files, not 100% flexible
 *
 * Parameters:
 *
 * @param {Object} o options
 * @param {string} o.prefix - used for include default '@module/'
 * @param {string} o.src - path to main md files
 * @param {string} o.includePath - path to includes
 */
module.exports = function markdownIncluder(o){
  var defaults = { prefix : '@module/' };
  o = extend(defaults, o);

  var router = express.Router();
  var modulePattern = new RegExp('^' + o.prefix + '([\\S]+)','mg');

  router.get('*', handleMdRequest);

  function handleMdRequest(req, res, next){
    readMd(path.join(o.src,req.path), function(err, text){
      if(err) return next(err);
      sendMd(res,text);
    });
  }

  function modpathFor(modName){
    return path.join(o.includePath, modName + '.md');
  }

  function patternFor(modName){
    return new RegExp('^' + o.prefix + modName, 'm');
  }

  //read md file & inject includes, recursively
  function readMd(mdPath, done){
    fs.readFile(mdPath, 'utf-8', function(err, text){
      if(err) return done(err);

      var modules = getFirstMatches(modulePattern, text);
      if(!modules.length) return done(null, text);

      //module includes found
      async.reduce( modules, text, function processMod(textBefore, modname, nxt){
        //pass to readMd, check for submodules
        readMd(modpathFor(modname), function(err, contents){
          if(err) return nxt(err);
          nxt(null, textBefore.replace(patternFor(modname), contents));
        });
      },
      function end(err, results){
        if(err) return done(err);
        done(null, results);
      });
    });
  }

  return router;
}

function sendMd(res, body){
    res.set('Content-Type', 'text/x-markdown; charset=UTF-8');
    res.send(body);
    res.end();
}

function getFirstMatches(re, str){
  var current,
      results = [];
  while ((current = re.exec(str)) !== null) {
    results.push(current[1]);
  }
  return(results);
}
