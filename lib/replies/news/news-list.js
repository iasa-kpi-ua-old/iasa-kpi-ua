
var util = require('util');
var typeOf = require('../../zcms/usefull').typeOf;
var config = require('./config');

exports.id = 'news-list';
exports.match = '/news';
exports.execute = function(request, response, aliasCall){
	var log = request.z.logger('news-list');
	var page = request.z.path().match(RegExp.apply(null, config.match));
	var page2 = Math.max(parseInt(page ? page[1] : 0), config.min);
	log.notice('page %s -> %s', page, page2);
	aliasCall('news-list', request.z, {
		where: {},
		skip: config['per-page']*page,
		limit: config['per-page']
	}, function(error, items){
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
	'news-list': function(z, opt, back){
		var log = z.logger('news-list');
		log.notice('opt: %j', opt);
		z.db.collection('news')
			.find(opt.where)
			.skip(opt.skip)
			.limit(opt.limit)
			.toArray(back);
	}
};

