// middle & reply

/** /
var meta = function(request){
	var url = urlp(request.url);
	url.method = request.method;
	url.http = request.httpVersion;
	url.headers = request.headers;
	if (url.host==null) url.host = request.headers['host'];
	if (url.hostname==null) url.hostname = url.host.split(':')[0];
	if (url.port==null) url.port = url.host.split(':')[1];
	if ('user-agent' in request.headers) url.agent = request.headers['user-agent'];
	if ('accept-language' in request.headers) url.language = request.headers['accept-language'];
	if ('cookie' in request.headers) url.cookie = request.headers['cookie'];
	if ('statusCode' in request) url.statusCode = request.statusCode;
	if ('statusMessage' in request) url.statusMessage = request.statusMessage;
	return url;
};
/**/

var m1 = {
	id: 'm1',
	execute: function(req, res){
		req.xxx1 = 'test1';
		return {req: req, res: res};
	},
	match: true,
	order: 0
};

var m2 = {
	id: 'm2',
	execute: function(req, res){
		req.xxx2 = 'test2';
		return {req: req, res: res};
	},
	match: '*',
	order: 0
};

var m3 = {
	id: 'm3',
	execute: function(req, res){
		req.xxx3 = 'test3';
		return {req: req, res: res};
	},
	match: {m:'get', p:'/mm33'},
	order: ['m1', 'm2']
};

var r1 = {
	id: 'r1',
	execute: function(req, res){
		res.write('test4');
		return true;
	},
	match: '/b'
};

var r2 = {
	id: 'r2',
	execute: function(req, res){
		res.write('test5');
		return true;
	},
	match: '/a'
};

var r3 = {
	id: 'r3',
	execute: function(req, res){
		res.write('test6');
		return true;
	},
	match: '*'
};

var cm = require('./lib/zcms');

cm.setup(3001, 2);
cm.register(m3.id, m3.execute, m3.match, m3.order);
cm.register(m1.id, m1.execute, m1.match, m1.order);
cm.register(m2.id, m2.execute, m2.match, m2.order);
cm.reply(r1.id, r1.execute, r1.match);
cm.reply(r2.id, r2.execute, r2.match);
cm.reply(r3.id, r3.execute, r3.match);

