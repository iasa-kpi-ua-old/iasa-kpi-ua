
var pf = require('util').format;
var typeOf = require('../../../zcms/usefull').typeOf;

exports.id = 'cookie';
exports.match = '*';
exports.order = ['z', 'url'];
exports.execute = function(request, response, aliasCall, middleNext){
	request.z.COOKIE = {};
	if(request.z.URL.cookie){
		request.z.URL.cookie.split(';').forEach(function(v){
			v = v.trim().split('=');
			request.z.COOKIE[v[0]] = v[1] || '';
		});
	}
	request.z.cookieGet = function(key){
		return (key in request.z.COOKIE) ? request.z.COOKIE[key] : undefined;
	};
	var cookies = [];
	request.z.cookieSet = function(key, value, opt){
		var cookie = cookieOne(key, value, opt);
		cookies.push(cookie);
		response.setHeader('Set-Cookie', cookies);
	};
	return { request: request };
};
exports.alias = {};

var cookieOne = function(key, value, opt){
	var cookie = [], expires = 0, host = undefined, path = '/';
	if(typeOf(opt, 'object')){
		expires = typeOf(opt.expires, 'number') ? opt.expires : typeOf(opt.e, 'number') ? opt.e : expires;
		var expiresDate = new Date();
		expiresDate.setDate(expiresDate.getDate() + expires);
		expires = expiresDate.toUTCString();
		host = typeOf(opt.host, 'string') ? opt.host : typeOf(opt.h, 'string') ? opt.h : host;
		path = typeOf(opt.path, 'string') ? opt.path : typeOf(opt.p, 'string') ? opt.p : path;
	}
	cookie.push(pf('%s=%s;', key, value));
	cookie.push(pf('expires=%s;', expires));
	if(host) cookie.push(pf('domain=%s;', host));
	if(path) cookie.push(pf('path=%s;', path));
	return cookie.join('');
};
