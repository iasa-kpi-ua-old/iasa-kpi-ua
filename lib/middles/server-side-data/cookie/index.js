
exports.id = 'cookie';
exports.match = '*';
exports.order = ['z', 'url'];
exports.execute = function(request, response, aliasCall, middleNext){
	console.log(request.z.URL.cookie);
	return true;
	middleNext(null, request, response);
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
