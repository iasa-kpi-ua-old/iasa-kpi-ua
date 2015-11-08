
var meta = require('../../zcms/usefull').meta;
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'url';
exports.match = '*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	if(typeOf(request.z, 'object')){
		request.z.URL = meta(request);
		request.z.PATH = request.z.URL.pathname.match(/[\/][^\/]*/ig);
	}
	return { request: request, response: response };
};
