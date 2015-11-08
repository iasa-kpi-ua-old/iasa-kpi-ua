
var fs = require('fs');
var pf = require('util').format;
var typeOf = require('../zcms/usefull').typeOf;

module.exports = function(server){
	if(!server) throw pf('Error [middles]: register require server object, but "%s" given', typeOf(server));
	fs.readdir('./lib/middles', function(error, items){
		for(var index in items){
			var item = items[index];
			var stat = fs.statSync('./lib/middles/' + item);
			if(!stat.isDirectory()) continue;
			var middle = require('./' + item);
			registration(server, middle);
		}
	});
};



var registration = function(server, middle){
	if(typeOf(middle, 'array')){
		for(var index in middle){
			registration(server, middle[index]);
		}
	}
	else if(!typeOf(middle, 'object')){
		console.log('Error [middles.registration]: middle [%s] has wrong type', item);
	}
	else if(!('id' in middle)){
		console.log('Error [middles.registration]: middle [%s] has no id', item);
	}
	else if(!('execute' in middle)){
		console.log('Error [middles.registration]: middle [%s] has no execute', item);
	}
	else if(!('match' in middle)){
		console.log('Error [middles.registration]: middle [%s] has no match', item);
	}
	else if(!('order' in middle)){
		console.log('Error [middles.registration]: middle [%s] has no order', item);
	}
	else{
		//console.log('Note [middles.registration]: middle [%s] registered', item);
		server.register(middle);
	}
};