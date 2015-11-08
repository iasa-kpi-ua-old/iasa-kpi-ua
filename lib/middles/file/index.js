
var fs = require('fs');
var mime = require('mime');
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'file';
exports.match = '*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	if(typeOf(response.z, 'object')){
		response.z.file = function(path, mimeType, callError){
			fileResponse(request, response, path, mimeType, callError);
		};
	}
	return { request: request, response: response };
};



var fileResponse = function(request, response, path, mimeType, callError){
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
