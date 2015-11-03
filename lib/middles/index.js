
var pf = require('util').format;
var typeOf = require('../zcms/usefull').typeOf;

var middles = [
	require('./middle-file'),
	require('./middle-get'),
	require('./middle-post'),
	require('./middle-redirect'),
	require('./middle-tpl')
];

module.exports = function(server){
	if(!server) throw pf('Error [middles]: register require server object, but "%s" given', typeOf(server));
	for(var index in middles){
		var middle = middles[index];
		if(!typeOf(middle, 'object')) continue;
		else if(!('id' in middle)) continue;
		else if(!('execute' in middle)) continue;
		else if(!('match' in middle)) continue;
		else if(!('order' in middle)) continue;
		else server.register(middle);
	}
};

