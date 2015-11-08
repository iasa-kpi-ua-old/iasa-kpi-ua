
var meta = require('../zcms/usefull').meta;
var typeOf = require('../zcms/usefull').typeOf;

exports.id = 'get';
exports.match = '*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	if(typeOf(request.z, 'object')){
		request.z.GET = meta(request).query;
	}
	return { request: request, response: response };
};