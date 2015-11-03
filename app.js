
var pf = require('util').format;
var meta = require('./lib/zcms/usefull').meta;
var typeOf = require('./lib/zcms/usefull').typeOf;

var srv = require('./lib/zcms');
srv.setup(3001, 1);

require('./lib/middles')(srv);
require('./lib/replies')(srv);
