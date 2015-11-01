//var URL = require('url');
//var FS = require('fs');
//var UTIL = require('util');

var srv = require('./lib/zcms');
srv.setup(3001);
var tpl = require('./lib/tpl');

srv.reply('unknown', function(req, res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('unknown');
}, '*');

srv.reply('frontpage', function(req, res){
    res.writeHead(200, {'content-type': 'text/html'});
    tpl.renderFile('templates/default/layout/index-uk.html', {
    }, function (err, out){
        if (err) throw err;
        res.end(out);
    });
}, '/');
