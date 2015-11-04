
exports.id = 'news';
exports.match = 'get:/news';
exports.execute = function(request, response){
	response.writeHead(200, {'content-type': 'text/plain'});
	response.write('news');
	return true;
};

