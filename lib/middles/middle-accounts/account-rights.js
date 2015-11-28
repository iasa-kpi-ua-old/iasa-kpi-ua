
exports.id = 'account-rights';
exports.match = '*';
exports.order = ['z', 'mongo'];
exports.execute = function(request, response, aliasCall, middleNext){
	//return true;
	middleNext(null, request, response);
};
exports.alias = {

};
