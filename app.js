var HTTP = require('http');
var URL = require('url');
var FS = require('fs');

var srv = HTTP.createServer();

srv.on('request', function (req, res){
    var u = URL.parse(req.url);
    if (u.pathname == '/'){
        res.writeHead(200, {'content-type': 'text/html'});
        res.end('Frontend');
    }

    else {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end('others');
    }
});

srv.listen(3000);
