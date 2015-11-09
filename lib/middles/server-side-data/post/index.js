
var fs = require('fs');
var multiparty = require('multiparty');
var urlencode = require('urlencode');
var meta = require('../../../zcms/usefull').meta;
var typeOf = require('../../../zcms/usefull').typeOf;

exports.id = 'post';
exports.match = 'post:/*';
exports.order = ['get'];
exports.execute = function(request, response, middleNext){
	if(!typeOf(request.z, 'object')){
		return {};
	}
	var contentType = meta(request).contentType;
	var contentTypeMatch = /^([\w\-]+[\/][\w\-]+)/i.exec(contentType);
	switch(contentTypeMatch ? contentTypeMatch[1] : contentTypeMatch){
		case null:
			return {};
		case 'multipart/form-data':
			multipartFormData(request, function(error, request){
				middleNext(error, request, response);
			});
			return undefined;
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
			return undefined;
		case 'application/json':
			chunckedFormData(request, function(error, request){
				middleNext(error, request, response);
			}, function(data){
				try{ return JSON.parse(JSON.stringify(data)); } catch(e){ return undefined; }
			});
			return undefined;
	}
	return {};
};



// Content-Type:
//   multipart/form-data
//   application/x-www-form-urlencoded
//   text/plain
//   application/json

var multipartFormData = function(request, callback){
	var settings = {
		encoding: 'utf8',
		maxFieldsSize: 2*1024*1024,
		maxFields: 1000,
		maxFilesSize: 'Infinity',
		autoFields: true,
		autoFiles: true,
		uploadDir: 'tmp'
	};
	var form = new multiparty.Form(settings);
	form.parse(request, function(error, fields, files){
		if(error) callback(error, request);
		// files: {name: {fieldName, originalFilename, path, headers: {content-disposition, content-type}, size}}
		// name: {'name', 'a.xxx' 'tmp/abc.doc' {'form-data; name="name"; filename="abcd.doc"', 'application/msword'}, 123}
		request.z.POST = { fields: fields, files: files };
		request.z.POST.clean = function(){
			if(!typeOf(files, 'object')) return;
			for(var name in files){
				if(typeOf(files[name], 'array')){
					for(var index in files[name]){
						var file = files[name][index];
						//console.log(file.fieldName, file.originalFilename, file.path, file.headers, file.size);
						fs.unlink(file.path, function(err){});
					}
				}
				else if(typeOf(files[name], 'object')){
					var file = files[name];
					//console.log(file.fieldName, file.originalFilename, file.path, file.headers, file.size);
					fs.unlink(file.path, function(err){});
				}
			}
		};
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
		request.z.POST = data;
		callback(null, request);
	});
};
