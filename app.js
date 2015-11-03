
var srv = require('./lib/zcms');
srv.setup(3001, 1);

require('./lib/middles')(srv);
require('./lib/replies')(srv);
