
exports.id = 'frontpage';
exports.match = '/front';
exports.execute = function(request, response, aliasCall){
	response.z.view('templates/default/layout/index-lang.html', {
		news: aliasCall('news-1')
	}, function(error){
		throw error;
	});
};
exports.alias = {};
