
var pf = require('util').format;
var typeOf = require('../../zcms/usefull').typeOf;
var config = require('./config');

exports.id = 'redirect';
exports.match = 'get:/*';
exports.order = ['z', 'url'];
exports.execute = function(request, response, aliasCall, middleNext){
	if(!typeOf(config, 'object') || !typeOf(config.redirects, 'array')){
		return {};
	}
	var path = request.z.path();
	for(var index in config.redirects){
		var cfg = config.redirects[index];
		if(!typeOf(cfg, 'object')) continue;
		else if(!typeOf(cfg.code, 'number')) continue;
		else if(!typeOf(cfg.replace, 'string')) continue;
		else if(typeOf(cfg.matched, 'string')){
			if(cfg.matched!=path) continue;
			response.writeHead(cfg.code, { 'Location': cfg.replace });
			response.end();
			return { error: 'redirect' };
		}
		else if(typeOf(cfg.pattern, 'string')){
			try{
				cfg.pattern = new RegExp(cfg.pattern, 'ig');
				if(!cfg.pattern.test(path)) continue;
				response.writeHead(cfg.code, { 'Location': cfg.replacement });
				response.end();
				return { error: 'redirect' };
			}
			catch(e){
				console.log(pf('Error [redirect]: %j', e));
			}
		}
	}
	return {};
};
exports.alias = {};
