
var cluster = require('cluster');
var os = require('os');
var process = require('process');

var pid = function(){
	console.log('pid: %s', process.pid, cluster.isMaster ? 'master' : 'worker');
};

if(cluster.isMaster){
	cluster.fork();
	cluster.fork();
}

setInterval(pid, 1000);


