
var fs = require('fs');
var multiparty = require('multiparty');
var typeOf = require('../../../zcms/usefull').typeOf;
var config = require('./config');

var dataFormMultipart = module.exports = function(request, callback){
	var form = new multiparty.Form(config);
	form.parse(request, function(error, fields, files){
		if(error) callback(error, request);
		// files: {name: {fieldName, originalFilename, path, headers: {content-disposition, content-type}, size}}
		// 'name': {'name', 'a.xxx' 'tmp/abc.doc' {'form-data; name="name"; filename="abcd.doc"', 'application/msword'}, 123}
		request.z.POST = fields;
		request.z.FILE = files;
		request.z.FILE.clean = function(){
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
