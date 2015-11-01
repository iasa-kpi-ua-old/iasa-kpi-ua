
var pu = require('url').parse;

var typeOf = module.exports.typeOf = function(obj, value){
	var t = {}.toString.call(obj).toLowerCase().match(/\s([a-zA-Z]+)/)[1];
	return (value) ? t===value : t;
};

var meta = module.exports.meta = function(request){
	if(!request) return {};
	var url = pu(('url' in request) ? request.url : '');
	url.method = ('method' in request) ? request.method.toLowerCase() : '-';
	url.http = ('httpVersion' in request) ? request.httpVersion : '-';
	url.headers = ('headers' in request) ? request.headers : {'-':'-'};
	if((url.host==null) && ('host' in url.headers)) url.host = url.headers['host'];
	if(url.hostname==null) url.hostname = url.host.split(':')[0];
	if(url.port==null) url.port = url.host.split(':')[1];
	if ('user-agent' in url.headers) url.agent = url.headers['user-agent'];
	if ('accept-language' in url.headers) url.language = url.headers['accept-language'];
	if ('cookie' in url.headers) url.cookie = url.headers['cookie'];
	if ('statusCode' in request) url.statusCode = request.statusCode;
	if ('statusMessage' in request) url.statusMessage = request.statusMessage;
	return url;
};
