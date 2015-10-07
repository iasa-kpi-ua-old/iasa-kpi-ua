var HTTP = require('http');
var URL = require('url');

var httpServer = HTTP.createServer(function (request, response){
	var httpManager = require('myManager');
	httpManager.do(request, response);
});
httpServer.listen(3000);
