
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
			response.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': out.length
			});
			response.write(out);
			response.end();
		}
		else if(typeOf(callError, 'function')) callError(error);
		else throw error;
	});
};