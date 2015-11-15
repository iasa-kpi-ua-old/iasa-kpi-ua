
var file = require('./file');
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'file';
exports.match = '*';
exports.order = ['z'];
exports.execute = function(request, response, aliasCall, middleNext){
	response.z.file = function(path, mimeType, callError){
		file(request, response, aliasCall, path, mimeType, callError);
	};
	return { response: response };
};
exports.alias = {};
