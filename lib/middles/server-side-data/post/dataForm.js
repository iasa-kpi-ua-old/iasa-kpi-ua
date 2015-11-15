
var postdata = require('post-data');

var dataForm = module.exports = function(request, callback){
	postdata(request, function(error, data){
		if(error){
			callback(error, request);
		}
		else{
			request.z.POST = data;
			callback(null, request);
		}
	});
};
