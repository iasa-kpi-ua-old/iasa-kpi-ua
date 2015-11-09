
var config = require('./config');
var typeOf = require('../../../zcms/usefull').typeOf;

exports.id = 'lang';
exports.match = '*';
exports.order = ['url'];
exports.execute = function(request, response, middleNext){
	if(typeOf(request.z, 'object')){
		if(config.langs.some(function(v){return v==request.z.PATH[0];})){
			request.z.LANG = request.z.PATH.shift();
		}
		else{
			request.z.LANG = config.default;
		}
	}
	return { request: request, response: response };
};
