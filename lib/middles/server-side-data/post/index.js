
var dataFormMultipart = require('./dataFormMultipart');
var dataForm = require('./dataForm');
var dataJSON = require('./dataJSON');
//var dataFormChuncked = require('./dataFormChuncked');

exports.id = 'post';
exports.match = 'post:/*';
exports.order = ['z', 'url'];
exports.execute = function(request, response, aliasCall, middleNext){
	var contentType = request.z.URL.contentType, contentCall;
	var contentTypeMatch = /^([\w\-]+[\/][\w\-]+)/i.exec(contentType);
	contentTypeMatch = contentTypeMatch ? contentTypeMatch[1] : 'text/plain';
	/** /
    Content-Type:
      multipart/form-data
      application/x-www-form-urlencoded
      text/plain
		  application/json
	/**/
	switch(contentTypeMatch){
		case 'multipart/form-data':
			contentCall = dataFormMultipart;
			break;
		case 'application/json':
			contentCall = dataJSON;
			break;
		case 'application/x-www-form-urlencoded':
		case 'text/plain':
		default:
			contentCall = dataForm;
			break;
	}
	contentCall(request, function(error, request){
		middleNext(error, request, response);
	});
	return undefined;
};
exports.alias = {};
