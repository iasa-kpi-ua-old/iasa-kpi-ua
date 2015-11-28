
var typeOf = require('../../zcms/usefull').typeOf;

exports.id = 'accounts';
exports.match = '*';
exports.order = ['z', 'mongo'];
exports.execute = function(request, response, aliasCall, middleNext){
	middleNext(request, response, aliasCall);
};
exports.alias = {
	'account-login': function(z, back){
		z.sessionGet('login', function(error, value){
			if(!error) back(error, value);
			else
				z.db.findOne({}, function(error, row){

				});
		});
	}
};
