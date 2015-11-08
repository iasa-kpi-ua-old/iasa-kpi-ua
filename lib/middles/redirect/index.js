
var config = require('./config');
var meta = require('../../zcms/usefull').meta;
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'redirect';
exports.match = 'get:/*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	var path = meta(request).pathname;
	if((path in redirects) && typeOf(redirects[path], 'array') && (redirects[path].length>0)){
		var redirect = redirects[path];
		var url = redirect[0];
		var code = (redirect.length>1) ? redirect[1] : 302;
		response.writeHead(code, { 'Location': url });
		response.end();
		return { error: 'redirect' };
	}
	else return {};
	//middleNext(null, request, response);
};

var redirects = {
	'/index.html': ['/', 301],
	'/index.php': ['/', 301],
	'/index.asp': ['/', 301]
};