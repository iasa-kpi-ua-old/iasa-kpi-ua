
exports.id = 'news';
exports.match = /^[\/]news(?:[\/].*)?$/i;
exports.execute = function(request, response){
	if(!request.z.db){
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
		return;
	}
	else if(request.z.URL.method=='post'){
		var m = /[\/]news(?:([\/][^\/]))+/i.exec(request.URL.pathname);
		switch(m[1]){
			case '/add':
				break;
			case '/edit':
				break;
			case '/del':
				break;
		}
	}
};

function newsInsert(request, response){
	var t = request.DB.collection('t');
	t.insert([ {b:request.URL} ], function(error, result){
		console.log(result);
		response.writeHead(200, {'content-type': 'text/plain'});
		response.write('news');
		response.end();
		//db.close();
	});
}

