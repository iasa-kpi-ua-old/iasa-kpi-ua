/*
function xxx (){
    this.y = 8;
    this.x = 10;
}

function yyy (){
    this.y = 11;
}

yyy.prototype = new xxx();

var Y = new yyy();

console.log(Y.__proto__.y);

module.exports.x = xxx;
module.exports.y = yyy;
module.exports.inspect = function(){return 'xxx';}
*/

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

var middle = function(req, res, next) {
    if (req.method === 'POST') {
        var form = new multiparty.Form({uploadDir:'tmp'});
        form.parse(req, function(err, fields, files) {
            var req2 = {fields: fields, files: files};
            req2.__proto__ = req;
            next(req2, res);
        });
    }
    else next(req, res);
};

var middle2 = function(req, res, next) {
    if (req.method === 'POST') {
        var form = new multiparty.Form({uploadDir:'tmp'});
        form.parse(req, function(err, fields, files) {
            var req2 = {fields: fields, files: files};
            req2.__proto__ = req;
            next(req2, res);
        });
    }
    else next(req, res);
};

var srv = http.createServer(function(req, res) {
    console.log(req.url);
    middle(req, res, function(req, res){
        if (req.url === '/upload' && req.method === 'POST') {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: req.fields, files: req.files}));
            return;
        }

        // show a file upload form
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
            '<form action="/upload" enctype="multipart/form-data" method="post">'+
            '<input type="text" name="title"><br>'+
            '<input type="file" name="upload" multiple="multiple"><br>'+
            '<input type="submit" value="Upload">'+
            '</form>'
        );
    });
});

srv.listen(3333);
