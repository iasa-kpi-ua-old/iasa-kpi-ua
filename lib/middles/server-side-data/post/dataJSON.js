
var postdata = require('post-data');

var dataJSON = module.exports = function(request, callback){
	postdata(request, JSON.parse, function (error, data) {
		if(error){
			callback(error, request);
		}
		else{
			request.z.POST = data;
			callback(null, request);
		}
	});
};
