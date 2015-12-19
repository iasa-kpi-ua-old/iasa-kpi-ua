
exports.id = 'news-edit-post';
exports.match = 'post:/news/edit'; //new RegExp('^/news/(new|\\d+)/edit/post$', 'i');//'post:/news/add';

exports.execute = function(request, response, aliasCall){
	var log = request.z.logger('news-edit-post');

	var regex = new RegExp('^/news/edit/(new|\\d+)$', 'i');
	var postParsed = request.z.path().match(regex); //exports.match);
	var postId = parseInt(postParsed[1]);

	aliasCall('news-edit-post', request.z, postId, function(error, result){
		var _id = request.z.POST._id;
		response.writeHead(301, { 'location': '/news/edit/'+_id });
		response.end();
	});
};

exports.alias = {
	'news-edit-post': function(z, postId, back){
		var news = z.db.collection('news');

		var upsert = function(id, post){
			post.timestamp = new Date();
			post._id = id;
			news.update({ _id: id }, post, { upsert: true }, back)
		};

		if(postId >= 0){
			upsert(postId, z.POST);
		} else {
			news.find({}, {_id: true}).sort({_id: -1}).limit(1).toArray(function(error, idList){
				newId = idList.length > 0 ? idList[0]._id + 1 : 0;
				upsert(newId, z.POST);
			});
		}

	}
};