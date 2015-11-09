
var pf = require('util').format;

exports.id = 'form1';
exports.match = '/f1';
exports.execute = function(request, response){
	response.writeHead(200, {'content-type': 'text/html'});
	console.log('get: "' + pf(request.GET) + '";');
	console.log('post: "' + pf(request.POST) + '";');
	var post = request.POST;
	if(post && ('files' in post)){
		var files = post.files;
		for(var name in files){
			var file = files[name];
			if(file instanceof Array){
				for(var index in file){
					var f = file[index];
					console.log(f.fieldName, f.originalFilename, f.path, f.headers, f.size);
				}
			}
			else console.log(file.fieldName, file.originalFilename, file.path, file.headers, file.size);
		}
		post.clean();
	}
	response.write(
		'<html>' +
		'<body>' +
		'<form method="post" action="" enctype="multipart/form-data">' +
		'<input type="text" name="xxx"><br>' +
		'<input type="text" name="yyy"><br>' +
		'<input type="text" name="zzz"><br>' +
		'<input type="file" name="aaa"><br>' +
		'<input type="file" name="aaa"><br>' +
		'<input type="submit" value="f1">' +
		'</form>' +
		'</body>' +
		'</html>');
	return true;
};
