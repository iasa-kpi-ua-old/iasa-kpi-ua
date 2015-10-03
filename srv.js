var HTTP = require('http');
var URL = require('url');

var srv = HTTP.createServer();

srv.listen(3000);

function my () {
    var s = srv;
    var itemMiddle = [];

    var itemReply = [];
    this.setCall = function (method, host, path, callBack) {
        if (typeof callBack!='function' || callBack instanceof Function) return false;
        var o = { cd: callBack };
        // method
        if (String(method).match(/^(GET|POST|PUT)$/ig)) o.m = String(method).toUpperCase();
        else o.m = 'GET';
        // host
        if (typeof host=='string' || host instanceof String) o.h = String(host).toLowerCase();
        else if (host instanceof RegExp) o.h = host;
        else o.h = false;
        // path
        if (typeof path=='string' || path instanceof String) o.p = String(path).toLowerCase();
        else if (path instanceof RegExp) o.p = path;
        else o.p = false;
        //
        cfg.push(o);
    };
    this.getCall = function (u) {
        
    }
};

var x = 1;

var my1 = new my();
/**/
srv.on('request', function (req, res){
    res.setHeader('conten-type', 'text/plain');
    res.end('Hello world!');
    return;
    var u = URL.parse(req.url);
    var cb = mysrv.getCall(u);
    u.call(srv, req, res);
});
/**/

module.exports = my1;