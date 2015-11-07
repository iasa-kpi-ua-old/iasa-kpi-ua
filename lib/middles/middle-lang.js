
var meta = require('../zcms/usefull').meta;
var typeOf = require('../zcms/usefull').typeOf;

exports.id = 'lang';
exports.match = '*';
exports.order = ['url'];
exports.execute = function(request, response, middleNext){
	if(typeOf(request.z, 'object')){
		console.log('lang:', request.z.PATH);
		request.z.LANG = '';
	}
	return { request: request, response: response };
};
