var HTTP = require('http');
var URL = require('url');
var listOfReplayes = require('listOfReplayes');

var httpServer = HTTP.createServer(function (request, response){
    httpManager.do(request, response);
});
httpServer.listen(3000);

var httpManager = function(){
    //var middles = new listOfMiddles();
    var replays = new listOfReplayes();
};

function options2middle (options, name){
    if (!(options instanceof Object)) throw name;
};

function my () {
    var s = srv;
    var itemMiddle = [];

    var itemReply = [];
    this.setCall = function (options, callBack) {
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
    this.getCall = function (url) {
        
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
    if (cb) cb(req, res);
});
/**/

module.exports = my1;