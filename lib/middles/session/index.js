
var cluster_store = require('strong-store-cluster');
var typeOf = require('../../zcms/usefull').typeOf;
var logger = require('../../zcms/logger');

exports.id = 'session';
exports.match = '*';
exports.order = ['z'];
exports.execute = function(request, response, aliasCall, middleNext){
	var collection = cluster_store.collection('session');
	collection.configure({ expireKeys: 0 });
	request.z.session = function(){
		return collection;
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
