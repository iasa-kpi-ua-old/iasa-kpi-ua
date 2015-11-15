
var tpl = require('../../tpl');
var typeOf = require('../../zcms/usefull').typeOf;

var renderFile = module.exports.renderFile = function(request, response, path, data, callError){
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

var render = module.exports.render = function(template, data){
	return tpl.render(template, data);
};