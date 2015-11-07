// mongoDB

var mongoConnectionString = 'mongodb://localhost:27017/test';
var mongoClient = require('mongodb').MongoClient;

var i = 11;
mongoClient.connect(mongoConnectionString, function(err, db){
	var table = db.collection('t');
	table.insert([ {a:i++, b:'abc'}, {x:i++}, {y:i++} ], function(error, result){
		console.log(result);
		db.close();
	});
});

