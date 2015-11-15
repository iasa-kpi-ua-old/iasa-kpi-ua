
var pf = require('util').format;

exports.id = 'form3';
exports.match = '/f3';
exports.execute = function(request, response, aliasCall){
	response.writeHead(200, {'content-type': 'text/html'});
	console.log('get: "' + pf(request.z.GET) + '";');
	console.log('post: "' + pf(request.z.POST) + '";');
	response.write(
		'<html>' +
		'<body>' +
		'<form method="post" action="" enctype="text/plain">' +
		'<input type="text" name="xxx"><br>' +
		'<input type="text" name="yyy"><br>' +
		'<input type="text" name="zzz"><br>' +
		'<input type="text" name="aaa"><br>' +
		'<input type="submit" value="f3">' +
		'</form>' +
		'</body>' +
		'</html>');
	return true;
};
exports.alias = {};
