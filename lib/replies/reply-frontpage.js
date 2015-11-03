
exports.id = 'frontpage';
exports.match = '/';
exports.execute = function(request, response){
	response.view('templates/default/layout/index-uk.html', {
	}, function(error){
		throw error;
	});
};
