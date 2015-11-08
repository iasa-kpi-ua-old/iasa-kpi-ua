
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'get';
exports.match = '*';
exports.order = ['url'];
exports.execute = function(request, response, middleNext){
	if(typeOf(request.z, 'object')){
		request.z.GET = request.z.URL.query;
	}
	return { request: request, response: response };
};
