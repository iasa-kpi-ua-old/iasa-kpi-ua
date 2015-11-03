
var meta = require('../zcms/usefull').meta;

exports.id = 'get';
exports.match = '*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	request.GET = meta(request).query;
	return { request: request, response: response };
	//middleNext(null, request, response);
};
