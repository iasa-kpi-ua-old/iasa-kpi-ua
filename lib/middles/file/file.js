
var fs = require('fs');
var mime = require('mime');
var typeOf = require('../../zcms/usefull').typeOf;

module.exports = function(request, response, aliasCall, path, mimeType, callError){
	fs.exists(path, function(exists){
		if(exists){
			mimeType = typeOf(mimeType, 'string') ? mimeType : mime.lookup(path);
			response.writeHead(200, { 'Content-Type': mimeType });
			var readable = fs.createReadStream(path);
			readable.pipe(response);
			readable.on('error', function(error){
				if(typeOf(callError, 'function')) callError(error);
				else errorBack(response, 404);
			});
			readable.on('end', function(){
				response.end();
			});
		}
		else errorBack(response, 404);
	});
};

var errorBack = function(response, code){
	response.writeHead(code, { 'Content-Type': 'text/plain' });
	response.end('Not found.');
};
