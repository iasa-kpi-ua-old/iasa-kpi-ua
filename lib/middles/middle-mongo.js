
var mongoClient = require('mongodb').MongoClient;
var mongoConnectionString = 'mongodb://localhost:27017/test';
var mongoDataBase = undefined;
var typeOf = require('../zcms/usefull').typeOf;

exports.id = 'mongo';
exports.match = '*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	if(!typeOf(request.z, 'object')){
		return {};
	}
	else if(mongoDataBase){
		request.z.db = mongoDataBase;
		middleNext(null, request, response);
	}
	else{
		mongoClient.connect(mongoConnectionString, {
			db:{
				wtimeout: 5
			},
			replset:{},
			mongos:{},
			server:{
				autoReconnect: true
			}
		}, function(error, db){
			if(!error) request.z.db = mongoDataBase = db;
			middleNext(error, request, response);
		});
	}
};
