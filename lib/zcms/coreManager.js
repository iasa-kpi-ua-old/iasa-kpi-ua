
var cluster = require('cluster');
//var cluster_store = require('strong-store-cluster');
var http = require('http');
var os = require('os');
//var process = require('process');
var util = require('util');
var log = require('./logger')('coreManager');
var typeOf = require('./usefull').typeOf;
var core = require('./core');

var coreManager = module.exports = function(_port, _numberOfCPU){
  var c = new core();

  var fork = function(numberOfCPU){
    log.debug('Fork CPU-number:"%s"', numberOfCPU);
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
    log.debug('Worker port:"%s"', port);
    http.createServer(function(request, response){
      c.run(request, response);
    }).listen(port);
  };

  this.setup = function(port, numberOfCPU){
    log.debug('Setup CPU-number:"%s", port:"%s"', numberOfCPU, port);
    port = typeOf(port, 'number') && (port>0) ? port : 80;
    numberOfCPU = typeOf(numberOfCPU, 'number') && (numberOfCPU>0) ? numberOfCPU : os.cpus().length;
    //
    if(!(numberOfCPU>1)){
      c = new core();
      work(port);
    }
    else if(cluster.isMaster){
      fork(numberOfCPU);
    }
    else if(cluster.isWorker){
      work(port);
    }
  };

  this.register = function(id, execute, match, order, alias){
    if(typeOf(id, 'object')){
      id.inspect = function(depth){
        var result = [];
        for(var p in this){
          switch(p){
            case 'alias':
              result.push(util.format('%s:{%s}', p, typeOf(this[p], 'object') ? Object.keys(this[p]) : ''));
              break;
            case 'id':
            case 'match':
            case 'order':
              result.push(util.format('%s:"%s"', p, this[p]));
              break;
            default:
              break;
          }
        }
        return util.format('{%s}', result.join(', '));
      };
    }
    log.debug('Middle registration id:%s, match:%j, order:%j, alias:%j', util.inspect(id), match, order, util.inspect(alias));
    var result = c.middleRegister(id, execute, match, order, alias);
    return result;
  };

  this.unregister = function(id){
    log.debug('Middle registration undo id:%j', id);
    var result = c.middleRegisterUndo(id);
    return result;
  };

  this.registerDone = function(){
    log.debug('Middle registration done');
    var result = c.middleRegisterDone();
    return result;
  };

  this.reply = function(id, execute, match, alias){
    if(typeOf(id, 'object')){
      id.inspect = function(depth){
        var result = [];
        for(var p in this){
          switch(p){
            case 'alias':
              result.push(util.format('%s:{%s}', p, typeOf(this[p], 'object') ? Object.keys(this[p]) : ''));
              break;
            case 'id':
            case 'match':
            case 'order':
              result.push(util.format('%s:"%s"', p, this[p]));
              break;
            default:
              break;
          }
        }
        return util.format('{%s}', result.join(', '));
      };
    }
    log.debug('Reply registration id:%s, match:%j, alias:%j', util.inspect(id), match, util.inspect(alias));
    var result = c.replyRegister(id, execute, match, alias);
    return result;
  };

  this.unreply = function(id){
    log.debug('Reply registration undo id:%j', id);
    var result = c.replyRegisterUndo(id);
    return result;
  };

  this.replyDone = function(){
    log.debug('Reply registration done');
    var result = c.replyRegisterDone();
    return result;
  };
};

//coreManager.prototype
