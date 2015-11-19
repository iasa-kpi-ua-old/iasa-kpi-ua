
exports.id = 'news-list';
exports.match = '/news';
exports.execute = function(request, response, aliasCall){
	aliasCall('news-list-top10', [request.z.db, function(list){
		response.z.view('templates/default/layout/news.html', {
			news:{
				title: 'xxx',
				content: 'yyy',
				meta:{
					z: request.z.path()
				}
			}
		}, function(error){
			throw error;
		});
	}]);
};
exports.alias = {
	'news-list-top10': function(db, back){
		back([]);
	}
};

