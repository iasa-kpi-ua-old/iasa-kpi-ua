
var fs = require('fs');
var pf = require('util').format;
var typeOf = require('../zcms/usefull').typeOf;

module.exports = function(server){
	if(!server) throw pf('Error [replies]: register require server object, but "%s" given', typeOf(server));
	fs.readdir('./lib/replies', function(error, items){
		for(var index in items){
			var item = items[index];
			if(item=='index.js') continue;
			if(!fs.statSync('./lib/replies/' + item).isDirectory()) continue;
			var reply = require('./' + item);
			registration(server, reply);
		}
		server.replyDone();
	});
};



var registration = function(server, reply){
	if(typeOf(reply, 'array')){
		for(var index in reply){
			registration(server, reply[index]);
		}
	}
	else if(!typeOf(reply, 'object')){
		console.log('Error [replies.registration]: reply [%s] has wrong type', item);
	}
	else if(!('id' in reply)){
		console.log('Error [replies.registration]: reply [%s] has no id', item);
	}
	else if(!('execute' in reply)){
		console.log('Error [replies.registration]: reply [%s] has no execute', item);
	}
	else if(!('match' in reply)){
		console.log('Error [replies.registration]: reply [%s] has no match', item);
	}
	else{
		//console.log('Note [replies.registration]: reply [%s] registered', item);
		server.reply(reply);
	}
};
