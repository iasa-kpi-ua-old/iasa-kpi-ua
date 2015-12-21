
var util = require('util');
var typeOf = require('../../zcms/usefull').typeOf;
var config = require('./config');

exports.id = 'news-list';
exports.match = /^[\/]news[\/]?(page(\d+))?$/i; //TODO: duplicated with config file
exports.execute = function(request, response, aliasCall){
	var log = request.z.logger('news-list');

	var page = request.z.path().match(RegExp.apply(null, config.match));
	var page2 = Math.max(parseInt(page ? page[2] : 0), config.min);
	log.notice('page %s -> %s', page, page2);

	aliasCall('news-list', request.z, {
		where: {},
		skip: config['per-page']*page2,
		limit: config['per-page']
	}, function(items){
		console.log('333: ', items);
		response.z.view('replies/news/layout/list.html', {
			news:{
				items: items,
				title: 'xxx',
				content: 'yyy', // todo: check if items.len > 0
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
	'news-list': function(z, opt, back){
		var log = z.logger('news-list');
		var cursor = z.db.collection('news')
				.find(opt.where)
				.skip(opt.skip)
				.limit(opt.limit);
		cursor.toArray(function(error, rows){
			if(error) throw error;
			else back(rows)
		});
	}
};

