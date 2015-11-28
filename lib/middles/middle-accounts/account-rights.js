
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'account-rights';
exports.match = '*';
exports.order = ['z', 'mongo'];
exports.execute = function(request, response, aliasCall, middleNext){
	middleNext(request, response, aliasCall);
};
exports.alias = {

};
