var HTTP = require('http');
var URL = require('url');
var FS = require('fs');

var srv = HTTP.createServer();

srv.on('request', function (req, res){
    var u = URL.parse(req.url);
    if (u.pathname=='/'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('Hello<br>');
        res.end('xxx');
    }
/*
    else if (u.pathname=='/i'){
        FS.readFile('./storage/x.jpg', function(err, f){
            if (err) throw err;
            res.writeHead(200, {'content-type': 'image/jpg'});
            res.end(f);
        });
    }
*/
    else {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end('yyy');
    }
});

srv.listen(3000);
