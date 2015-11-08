
var tpl = require('../../tpl');
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'tpl';
exports.match = '*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	if(typeOf(response.z, 'object')){
		response.z.view = response.z.tpl = function(path, data, callError){
			fileView(request, response, path, data, callError);
		};
	}
	return { request: request, response: response };
};



var fileView = function(request, response, path, data, callError){
	tpl.renderFile(path, data, function(error, out){
		if(!error){
			var buffer = new Buffer(out);
			response.writeHead(200, {
				'Content-Length': buffer.length,
				'Content-Type': 'text/html'
			});
			response.write(buffer);
			response.end();
		}
		else if(typeOf(callError, 'function')) callError(error);
		else throw error;
	});
};