var URL = require('url');
var FS = require('fs');

var srv = require('srv');
var tpl = require('tpl');

srv.setCall('GET', /.*/, '/', function (req, res){
    res.writeHead(200, {'content-type': 'text/html'});
    tpl.renderFile('templates/default/layout/index-uk.html', {
    }, function (err, out){
        if (err) throw err;
        res.end(out);
    });
});

srv.setCall('GET', /.*/, /.*/, function (req, res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('others');
});
