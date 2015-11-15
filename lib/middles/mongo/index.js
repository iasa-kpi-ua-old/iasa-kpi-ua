
var mongoClient = require('mongodb').MongoClient;
var typeOf = require('../../zcms/usefull').typeOf;
var config = require('./config');

var mongoConnectionString = config.url;
var mongoDataBase = undefined;

exports.id = 'mongo';
exports.match = '*';
exports.order = ['z'];
exports.execute = function(request, response, aliasCall, middleNext){
	if(config.enable!=true){
		return {};
	}
	else if(mongoDataBase){
		request.z.db = mongoDataBase;
		middleNext(null, request, response);
	}
	else{
		mongoClient.connect(mongoConnectionString, {
			db:config.connect.db,
			replset:config.connect.replset,
			mongos:config.connect.mongos,
			server:config.connect.server
		}, function(error, db){
			if(!error) request.z.db = mongoDataBase = db;
			middleNext(error, request, response);
		});
	}
};
exports.alias = {};
