
// Content-Type:
//   multipart/form-data
//   application/x-www-form-urlencoded
//   text/plain
//   application/json

var multiparty = require('multiparty');
var urlencode = require('urlencode');
var meta = require('../zcms/usefull').meta;
var typeOf = require('../zcms/usefull').typeOf;

exports.id = 'post';
exports.match = 'post:*';
exports.order = 0;
exports.execute = function(request, response, middleNext){
	var contentType = meta(request).contentType;
	switch(/^([\w\-]+[\/][\w\-]+)/i.exec(contentType)[1]){
		case 'multipart/form-data':
			multipartFormData(request, function(error, request){
				middleNext(error, request, response);
			});
			break;
		case 'application/x-www-form-urlencoded':
		case 'text/plain':
		default:
			chunckedFormData(request, function(error, request){
				//console.log(contentType); // !!!
				//console.log(request.POST); // !!!
				middleNext(error, request, response);
			}, function(data){
				return urlencode.parse(data.toString('utf8'));
			});
			break;
		case 'application/json':
			chunckedFormData(request, function(error, request){
				middleNext(error, request, response);
			}, function(data){
				try{ return JSON.parse(JSON.stringify(data)); } catch(e){ return undefined; }
			});
			break;
	}
	return undefined;
};



var multipartFormData = function(request, callback){
	var form = new multiparty.Form({ uploadDir: 'tmp' });
	form.parse(request, function(error, fields, files){
		if(error) callback(error, request);
		request.POST = { fields: fields, files: files };
		callback(null, request);
	});
};

var chunckedFormData = function(request, callback, dataCall){
	var data = new Buffer('');
	request.on('data', function(chunk){
		data += chunk;
	});
	request.on('error', function(error){
		callback(error, request);
	});
	request.on('end', function(){
		if(typeOf(dataCall, 'function')) data = dataCall(data);
		request.POST = data;
		callback(null, request);
	});
};
