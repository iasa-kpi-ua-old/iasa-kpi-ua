
var cluster = require('cluster');
var http = require('http');
var os = require('os');
var typeOf = require('./usefull').typeOf;
var core = require('./core');

var coreManager = module.exports = function(_port, _numberOfCPU){
  var c = new core(), items = this._items = [];

  var fork = function(numberOfCPU){
    for(var i=0; i<numberOfCPU; i++){
      cluster.fork();
    }
    /** /
    cluster.on('exit', function(worker, code, signal){
      console.log('worker ' + worker.process.pid + ' died');
    });
    /**/
  };

  var work = function(port){
    http.createServer(function(request, response){
      c.run(request, response);
    }).listen(port);
  };

  this.setup = function(port, numberOfCPU){
    port = typeOf(port, 'number') && (port>0) ? port : 80;
    numberOfCPU = typeOf(numberOfCPU, 'number') && (numberOfCPU>0) ? numberOfCPU : os.cpus().length;
    if(!(numberOfCPU>1)){
      work(port);
    }
    else if(cluster.isMaster){
      fork(numberOfCPU);
    }
    else{
      work(port);
    }
  };

  this.register = function(id, execute, match, order, alias){
    return c.register(id, execute, match, order, alias);
  };

  this.unregister = function(id){
    return c.unregister(id);
  };

  this.registerDone = function(){
    c.registerDone();
  };

  this.reply = function(id, execute, match, alias){
    return c.reply(id, execute, match, alias);
  };

  this.unreply = function(id){
    return c.unreply(id);
  };

  this.replyDone = function(){
    c.replyDone();
  };
};

//coreManager.prototype
