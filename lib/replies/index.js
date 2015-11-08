
var pf = require('util').format;
var typeOf = require('../zcms/usefull').typeOf;

var replies = [
	require('./reply-f1'),
	require('./reply-f2'),
	require('./reply-f3'),
	require('./reply-f4'),
	require('./reply-frontpage'),
	require('./reply-news'),
	require('./storage'),
	require('./reply-unknown'),
	require('./reply-cabinet')
];

module.exports = function(server){
	if(!server) throw pf('Error [middles]: register require server object, but "%s" given', typeOf(server));
	for(var index in replies){
		var reply = replies[index];
		if(!typeOf(reply, 'object')) continue;
		else if(!('id' in reply)) continue;
		else if(!('execute' in reply)) continue;
		else if(!('match' in reply)) continue;
		else server.reply(reply);
	}
};

