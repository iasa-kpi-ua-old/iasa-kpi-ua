
exports.id = 'get';
exports.match = '*';
exports.order = ['z', 'url'];
exports.execute = function(request, response, aliasCall, middleNext){
	request.z.GET = request.z.URL.query;
	return { request: request };
};
exports.alias = {};
