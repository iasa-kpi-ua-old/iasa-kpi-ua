
exports.id = 'news-add';
exports.match = 'post:/news/add';
exports.execute = function(request, response, aliasCall){
	var log = request.z.logger('news-add');
	log.notice('page %s -> %s', page, page2);
	aliasCall('news-add', request.z, function(error, result){

	});
	response.end('add' + aliasCall('news-1', 1, 2, 3, 4, 5));
};
exports.alias = {
	'news-1': function(a, b, c, d, e){
		return a + b + c + d + e;
	}
};


function newsInsert(request, response){
	var t = request.z.db.collection('t');
	t.insert([ {b:request.URL} ], function(error, result){
		console.log(result);
		response.writeHead(200, {'content-type': 'text/plain'});
		response.write('news');
		response.end();
		//db.close();
	});
}

