
var pf = require('util').format;

exports.id = 'form4';
exports.match = '/f4';
exports.execute = function(request, response){
	response.writeHead(200, {'content-type': 'text/html'});
	console.log('get: "' + pf(request.GET) + '";');
	console.log('post: "' + pf(request.POST) + '";');
	response.write(
		'<html>' +
		'<body>' +
		'<form method="post" action="" enctype="application/json">' +
		'<input type="text" name="xxx">' +
		'<input type="text" name="yyy">' +
		'<input type="text" name="zzz">' +
		'<input type="text" name="aaa">' +
		'<input type="submit" value="f4">' +
		'</form>' +
		'</body>' +
		'</html>');
	return true;
};
