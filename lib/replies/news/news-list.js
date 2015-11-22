
var util = require('util');
var typeOf = require('../../zcms/usefull').typeOf;
var config = require('./config');

exports.id = 'news-list';
exports.match = '/news';
exports.execute = function(request, response, aliasCall){
	aliasCall('news-list', request.z, function(items){
		console.log('333: ', items);
		response.z.view('replies/news/layout/list.html', {
			news:{
				items: items,
				title: 'xxx',
				content: 'yyy',
				meta:{
					z: request.z.path()
				}
			}
		}, function(error){
			throw error;
		});
	});
};
exports.alias = {
	'news-list': function(z, back){
		z.logger('news').notice('xxxxx');
		var page = z.path().match(RegExp.apply(null, config.match));
		page = Math.max(parseInt(page ? page[1] : 0), config.min);
		z.db.collection('news')
			.find({})
			.skip(config['per-page']*page)
			.limit(config['per-page'])
			.toArray(function(error, rows){
				if(error) throw error;
				else back(rows);
			});
	}
};

