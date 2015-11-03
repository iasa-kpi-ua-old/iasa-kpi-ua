
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
		'<input type="text" name="xxx"><br>' +
		'<input type="text" name="yyy"><br>' +
		'<input type="text" name="zzz"><br>' +
		'<input type="text" name="aaa"><br>' +
		'<input type="submit" value="f4">' +
		'</form>' +
		'</body>' +
		'</html>');
	return true;
};
