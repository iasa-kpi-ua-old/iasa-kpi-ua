
var aw = require('async').waterfall;
var typeOf = require('./usefull').typeOf;
var middleManager = require('./middleManager');
var replyManager = require('./replyManager');
var aliasManager = require('./aliasManager');

var core = module.exports = function(){
  var self = this, mm = new middleManager(self), rm = new replyManager(self), am = new aliasManager(self);
  // alias
  self.alias = function(name, args){
    return am.run(name, args);
  };
  // register
  self.register = function(id, execute, match, order, alias){
    var result = mm.set(id, execute, match, order, alias);
    mm._aliasStore(result, function(alias){
      am.set(alias);
    });
    return result;
  };
  // unregister
  self.unregister = function(id){
    return mm.unset(id);
  };
  // register done
  self.registerDone = function(){
    mm.done();
  };
  // reply
  self.reply = function(id, execute, match, alias){
    var result = rm.set(id, execute, match, alias);
    rm._aliasStore(result, function(alias){
      am.set(alias);
    });
    return result;
  };
  // unreply
  self.unreply = function(id){
    return rm.unset(id);
  };
  // reply done
  self.replyDone = function(){
    rm.done();
  };
  // run
  self.run = function(request, response){
    var tasks = mm.run(request, response, self.alias);
    aw(tasks, rm.run);
  };
};

core.prototype.get = function(id, execute, match){
  switch(typeOf(match)){
    case 'array':
      return this.reply(id, execute, { method: 'get', path: match });
    case 'object':
      match.method = 'get';
      return this.reply(id, execute, match);
    case 'regexp':
      return this.reply(id, execute, { method: 'get', path: match });
    case 'string':
      return this.reply(id, execute, { method: 'get', path: match });
    default:
      return false;
  }
};

core.prototype.post = function(id, execute, match){
  switch(typeOf(match)){
    case 'array':
      return this.reply(id, execute, { method: 'post', path: match });
    case 'object':
      match.method = 'post';
      return this.reply(id, execute, match);
    case 'regexp':
      return this.reply(id, execute, { method: 'post', path: match });
    case 'string':
      return this.reply(id, execute, { method: 'post', path: match });
    default:
      return false;
  }
};
