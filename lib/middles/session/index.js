
var cluster_store = require('strong-store-cluster');
var typeOf = require('../../zcms/usefull').typeOf;
//var logger = require('../../zcms/logger');

exports.id = 'session';
exports.match = '*';
exports.order = ['z', 'cookie'];
exports.execute = function(request, response, aliasCall, middleNext){
	var log = request.z.logger('session');
	var collection = cluster_store.collection('session');
	collection.configure({ expireKeys: 10 });
	var cookieSession = request.z.cookieGet('session');
	if(cookieSession){
		log.notice('session id in cookie: %s', cookieSession);
	}
	else{
	}
	console.log(request.z.cookieGet('xxx5'))
	request.z.cookieSet('xxx2', 'yyy2');
	request.z.cookieSet('xxx3', 'yyy3');
	request.z.cookieSet('xxx4', '');
	request.z.cookieSet('xxx5', 'yyy5');

	request.z.session = function(){
		return collection;
	};
	request.z.sessionDet = function(key, back){
		return collection.del(key, back);
	};
	request.z.sessionGet = function(key, back){
		return collection.get(key, back);
	};
	request.z.sessionSet = function(key, value, back){
		return collection.set(key, value, back);
	};
	return { request: request, response: response };
};
exports.alias = {};
