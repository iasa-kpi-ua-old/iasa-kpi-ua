
var typeOf = require('../../zcms/usefull').typeOf;
var logger = require('../../zcms/logger');

exports.id = 'z';
exports.match = '*';
exports.order = [];
exports.execute = function(request, response, aliasCall, middleNext){
	if(!typeOf(request.z, 'object') && !typeOf(response.z, 'object')){
		request.z = response.z = {};
	}
	else if(!typeOf(response.z, 'object')){
		response.z = request.z;
	}
	else if(!typeOf(request.z, 'object')){
		request.z = response.z;
	}
	if(!typeOf(request.z.aliasCall, 'function')){
		request.z.aliasCall = aliasCall;
	}
	if(!typeOf(request.z.logger, 'object')){
		request.z.logger = logger;
	}
	return { request: request, response: response };
};
exports.alias = {
	
};
