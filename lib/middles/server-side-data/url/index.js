
var meta = require('./meta');

exports.id = 'url';
exports.match = '*';
exports.order = ['z'];
exports.execute = function(request, response, aliasCall, middleNext){
	request.z.URL = meta(request);
	request.z.PATH = request.z.URL.pathname.match(/[\/][^\/]*/ig);
	request.z.path = function(index){
		if(0<=index && index<request.z.PATH.length){
			return request.z.PATH[index];
		}
		else if(index==undefined || index==null){
			return request.z.PATH.join('');
		}
		else{
			return undefined;
		}
	};
	return { request: request };
};
exports.alias = {};
