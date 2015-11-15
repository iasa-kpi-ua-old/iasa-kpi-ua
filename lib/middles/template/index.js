
var renders = require('./renders');

exports.id = 'tpl';
exports.match = '*';
exports.order = ['z'];
exports.execute = function(request, response, aliasCall, middleNext){
	response.z.view = function(path, data, callError){
		renders.renderFile(request, response, path, data, callError);
	};
	response.z.tpl = function(template, data){
		renders.render(template, data);
	};
	return { response: response };
};
exports.alias = {};
