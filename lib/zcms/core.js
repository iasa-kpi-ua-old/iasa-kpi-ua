
var aw = require('async').waterfall;
var typeOf = require('./usefull').typeOf;
var middleManager = require('./middleManager');
var replyManager = require('./replyManager');

var core = module.exports = function(){
  var mm = new middleManager(), rm = new replyManager(), self = this;

  self.register = function(id, execute, match, order){
    return mm.set(id, execute, match, order);
  };
  
  self.unregister = function(id){
    return mm.unset(id);
  };

  self.reply = function(id, execute, match){
    return rm.set(id, execute, match);
  };
  
  self.unreply = function(id){
    return rm.unset(id);
  };

  self.run = function(request, response){
    var tasks = mm.run(request, response);
    var done = rm.run(request, response);
    aw(tasks, done);
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
