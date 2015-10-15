
var http = require('http');
var serverManager = require('./serverManager');

var sm = new serverManager();
var server = http.createServer(
  function(request, response){
    sm.run(request, response);
  });
server.listen(3000);

module.exports = sm;