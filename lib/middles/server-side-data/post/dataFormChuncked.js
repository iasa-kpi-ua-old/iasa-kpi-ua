
var urlencode = require('urlencode');
var typeOf = require('../../../zcms/usefull').typeOf;

var dataFormChuncked = module.exports = function(request, callback, dataCall){
	var data = new Buffer('');
	request.on('data', function(chunk){
		data += chunk;
	});
	request.on('error', function(error){
		callback(error, request);
	});
	request.on('end', function(){
		if(typeOf(dataCall, 'function')) data = dataCall(data);
		request.z.POST = data;
		callback(null, request);
	});
};

/** /
 dataFormChuncked(request, function(error, request){
				//console.log(contentType); // !!!
				//console.log(request.z.POST); // !!!
				middleNext(error, request, response);
			}, function(data){
				return urlencode.parse(data.toString('utf8'));
			});
/**/

/** /
 dataFormChuncked(request, function(error, request){
				middleNext(error, request, response);
			}, function(data){
				try{ return JSON.parse(JSON.stringify(data)); } catch(e){ return undefined; }
			});
/**/
