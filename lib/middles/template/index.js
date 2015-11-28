
var typeOf = require('../../zcms/usefull').typeOf;
var renders = require('./renders');

exports.id = 'tpl';
exports.match = '*';
exports.order = ['z'];
exports.execute = function(request, response, aliasCall, middleNext){
	var tplData = [];
	response.z.tplDataSet = function(data){
		if(!typeOf(data, 'object')) return;
		tplData.push(data);
	};
	response.z.view = function(path, data, callError){
		renders.renderFile(request, response, path, Object.assign.apply(null, tplData.concat(data)), callError);
	};
	response.z.tpl = function(template, data){
		renders.render(template, Object.assign.apply(null, tplData.concat(data)));
	};
	return { response: response };
};
exports.alias = {};
