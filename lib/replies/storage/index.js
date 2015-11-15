
exports.id = 'resource';
exports.match = /^.*[\.](?:css|js|jpe?g|gif|png|ico)$/i;
exports.execute = function(request, response, aliasCall){
	var path = './storage' + request.z.URL.pathname;
	response.z.file(path);
};
exports.alias = {};
