var async = require ('async');
var http = require('http');
var url = require('url');

function M(){
	this.execute = function (req,res,next){
		next('error',req,res);
	}
	this.check = function (req){
		throw 'error';
	}

}

function R(){
	this.execute = function (err,req,res){
		throw 'error';
	}

	this.rate = function (req){
		throw 'error';

	}
}

function manager(req,res){
	var middles = [];
	var replies = [];
	this.setMiddleOne = function (obj){
		if (!(obj instanceof M)) throw 'error';

		middles.push(obj);
		console.log('M is pushed ');




	}

	this.setReplyOne = function (obj){
		if (!(obj instanceof R)) throw 'error';

		replies.push(obj);
		console.log('R is pushed');

	}

	this.run = function run(req,res){
		console.log('x.run');
		console.log('m='+middles);
		console.log('r='+replies);

		var mrun = [function (next) {
			next(null,req,res);
		},
			function (req,res,next){
				next(null,req,res);
			}
		];
		var m;
		console.log('m.length='+middles.length);
		console.log('r.length='+replies.length);

		for (var m in middles){
			if(middles[m].check(req)) mrun.push(middles[m].execute);
		}
		var rate = 0,done;
		for (var r in replies){
			var temp=replies[r].rate();
			if (temp>rate) {
				done = replies[r].execute;
				rate = temp;
			}
		}

		console.log('waterfall');

		async.waterfall(mrun,done);

	}

}
var x = new manager();
var server = http.createServer(function(req,res){
	var url_parts = url.parse(req.url);
	switch (url_parts.pathname){
		case '/': {
			x.run(req,res);
			break;
		}
		case '/upload':{
			upload_file(req,res);
			break;
		}
	}

});



server.listen(7070,function(){
	console.log("serv started");
});

module.exports.mang = x;
module.exports.manager = manager;
module.exports.M = M;
module.exports.R = R;