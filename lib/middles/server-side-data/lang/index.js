
var config = require('./config');

exports.id = 'lang';
exports.match = '*';
exports.order = ['z', 'url'];
exports.execute = function(request, response, aliasCall, middleNext){
	if(request.z.PATH.length>0 && config.langs.some(function(v){ return v==request.z.path(0); })){
		request.z.LANG = request.z.PATH.shift();
	}
	else{
		request.z.LANG = config.default;
	}
	return { request: request };
};
exports.alias = {};
