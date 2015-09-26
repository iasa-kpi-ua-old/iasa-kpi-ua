var HTTP = require('http');
var URL = require('url');
var FS = require('fs');
var SWIG = require('swig');

var swig = new SWIG.Swig({
    cache: false,
    locals: {
        meta: {
            title: "xxx"
        }
    },
    loader: SWIG.loaders.fs('./storage', {encoding: 'utf8'})
});

var srv = HTTP.createServer();

srv.on('request', function (req, res){
    var u = URL.parse(req.url);
    if (u.pathname == '/'){
        res.writeHead(200, {'content-type': 'text/html'});
        swig.renderFile('templates/default/layout/index-uk.html', {
            meta: {
                title: 'yyy'
            }
        }, function (err, out){
            if (err) throw err;
            res.end(out);
        });
    }

    else {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end('others');
    }
});

srv.listen(3000);
