
var pf = require('util').format;
var aw = require('async').waterfall;
var log = require('./logger')('core');
var middleManager = require('./middleManager');
var replyManager = require('./replyManager');
var aliasManager = require('./aliasManager');
var typeOf = require('./usefull').typeOf;

var core = module.exports = function(){
  var self = this, mm = new middleManager(self), rm = new replyManager(self), am = new aliasManager(self);
  // alias
  self.alias = function(name){
    var args = Array.prototype.slice.call(arguments, 1);
    log.debug('Alias "%s" call (%j)', name, args);
    return am.run(name, args);
  };
  // middle register
  self.middleRegister = function(id, execute, match, order, alias){
    log.debug('Middle ("%s") registration', typeOf(id, 'object') ? id.id : id);
    var result = mm.set(id, execute, match, order, alias);
    log.debug('Middle ("%s") alias registration', typeOf(id, 'object') ? id.id : id);
    if(typeOf(result, 'object')){
      mm.aliasStore(result.id(), function(alias){
        am.set(alias);
      });
    }
    return result;
  };
  // middle register done
  self.middleRegisterDone = function(){
    log.debug('Middle registration done');
    mm.done();
  };
  // middle register undo
  self.middleRegisterUndo = function(id){
    log.debug('Middle ("%s") undo alias registration', id);
    mm.aliasStoreUndo(id, function(alias){
      am.unset(alias);
    });
    log.debug('Middle ("%s") undo registration', id);
    return mm.unset(id);
  };
  // reply register
  self.replyRegister = function(id, execute, match, alias){
    log.debug('Reply ("%s") registration', typeOf(id, 'object') ? id.id : id);
    var result = rm.set(id, execute, match, alias);
    log.debug('Reply ("%s") alias registration', typeOf(id, 'object') ? id.id : id);
    if(typeOf(result, 'object')){
      rm.aliasStore(result.id(), function(alias){
        am.set(alias);
      });
    }
    return result;
  };
  // reply register done
  self.replyRegisterDone = function(){
    log.debug('Reply registration done');
    rm.done();
  };
  // reply register undo
  self.replyRegisterUndo = function(id){
    log.debug('Reply ("%s") undo alias registration', id);
    rm.aliasStoreUndo(id, function(alias){
      am.unset(alias);
    });
    log.debug('Reply ("%s") undo registration', id);
    return rm.unset(id);
  };
  // run
  self.run = function(request, response){
    log.debug('Run {uri:"%s", method:"%s", host:"%s"}', request.url, request.method, request.headers.host);
    var tasks = mm.run(request, response, self.alias);
    aw(tasks, rm.run);
  };
};

//core.prototype.
