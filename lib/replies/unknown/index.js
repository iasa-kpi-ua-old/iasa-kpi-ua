
exports.id = 'unknown';
exports.match = '*';
exports.execute = function(request, response, aliasCall){
	response.writeHead(404, {'content-type': 'text/plain'});
	response.write('Unknown');
	return true;
};
exports.alias = {};
