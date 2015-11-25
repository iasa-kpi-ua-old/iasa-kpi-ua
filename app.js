
var memTotalMax = 0;
setInterval(function(){
	var memUsed = require('./lib/zcms/usefull').memUsed;
	var mem = memUsed();
	if(mem.total>memTotalMax){
		memTotalMax = mem.total;
		console.log('memoryUsage: %s %s;', mem.size, mem.unit);
	}
}, 1000);

var run = function(){
	var srv = require('./lib/zcms');
	var config = require('./config');
	require('array.prototype.find');
	require('./lib/middles')(srv);
	require('./lib/replies')(srv);

	srv.setup(config.port, config.amountThreads);
};
run();return; // !!!

var domain = require('domain');
domain.create().on('error', function(error){
	console.log('Error [app]: %j', error);
}).run(function(){
	run();
});
