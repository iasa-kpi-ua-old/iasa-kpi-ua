
exports.id = 'frontpage';
exports.match = /^[\/]$/i;
exports.execute = function(request, response){
	response.z.view('templates/default/layout/index-lang.html', {
	}, function(error){
		throw error;
	});
};
