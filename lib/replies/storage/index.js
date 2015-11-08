
var meta = require('../../zcms/usefull').meta;

exports.id = 'resource';
exports.match = /^.*[\.](?:css|js|jpe?g|gif|png|ico)$/i;

exports.execute = function(request, response){
	var path = './storage' + meta(request).pathname;
	response.z.file(path);
};
