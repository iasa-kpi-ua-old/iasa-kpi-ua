
var inspect = require('util').inspect;
var pf = require('util').format;
var log = require('./logger')('replyManager');
var typeOf = require('./usefull').typeOf;
var reply = require('./reply.js');

var replyManager = module.exports = function(_core){
  if(!typeOf(_core, 'object')) throw pf('Error [replyManager.constructor]: CORE is undefined');
  var self = this, items = self._items = [], CORE = self._core = _core;
  // alias
  self.aliasApply = function(id, name, args){
    try{
      var item = self.get(id);
      var aliases = item[0].alias();
      var alias = aliases[name];
      var result = alias.apply(item, args);
      log.debug('Alias-call id:%s, name:%s, args:%j -> %j', id, name, args, result);
      return result;
    }
    catch (e){
      log.warning('Unknown exception [%s] on alias-call id:%s, name:%s, args:%j', e, id, name, args);
      return undefined;
    }
  };
  // alias register
  self.aliasStore = function(id, aliasRegistration){
    var item = self.get(id);
    var result = item.length==1 ? self._aliasStore(item[0], aliasRegistration) : false;
    log.debug('Alias-store id:%s -> %j', id, result ? 'ok' : 'undefined');
    return result;
  };
  // alias register undo
  self.aliasStoreUndo = function(id, aliasRegistrationUndo){
    var item = self.get(id);
    var result = item.length==1 ? self._aliasStoreUndo(item[0], aliasRegistrationUndo) : false;
    log.debug('Alias-store-undo id:%s -> %j', id, result ? 'ok' : 'undefined');
    return result;
  };
  // core for replyManager
  self.core = function(){
    return CORE;
  };
  // count
  self.count = function(){
    return items.length;
  };
  // done: after all set's
  self.done = function(){
    log.debug('Done\n');
  };
  // get
  self.get = function(id){
    var result = self._get(items, id);
    log.debug('Get reply id:%s -> %j', id, result ? 'ok' : 'undefined');
    return result;
  };
  // IDs
  self.ids = function(){
    var result = self._ids(items);
    log.debug('IDs -> %j', result);
    return result;
  };
  // set
  self.set = function(id, execute, match, alias){
    if(typeOf(id, 'object')){
      if(typeOf(execute, 'function'));
      else if(('execute' in id) && typeOf(id.execute, 'function')) execute = id.execute;
      else if(('e' in id) && typeOf(id.e, 'function')) execute = id.e;
      else execute = undefined;
      if(!typeOf(match, 'undefined'));
      else if(('match' in id) && !typeOf(id.match, 'undefined')) match = id.match;
      else if(('m' in id) && !typeOf(id.m, 'undefined')) match = id.m;
      else match = undefined;
      if(typeOf(alias, 'object'));
      else if(('alias' in id) && typeOf(id.alias, 'object')) alias = id.alias;
      else if(('a' in id) && typeOf(id.a, 'object')) alias = id.a;
      else alias = undefined;
      id = ('id' in id) ? id.id : undefined;
    }
    log.debug('Reply registration id:"%s", match:"%s", alias:{%s}', id, match, typeOf(alias, 'object') ? Object.keys(alias) : '');
    var r = reply.prototype.one(self, id, execute, match, alias);
    var result = self._set(items, r);
    return result;
  };
  // unset
  self.unset = function(id){
    log.debug('Reply registration undo id:%s', id);
    return self._unset(items, id);
  };
  // run
  self.run = function(error, request, response, aliasCall){
    if(error){
      log.notice('run: error:%j', inspect(error, {depth: 1}));
      //throw pf('Error [replyManager.run]: error:"%j"', error);
    }
    else{
      var done = self._match(items, request, response, aliasCall);
      var execute = done.execute, id = done.id;
      execute(request, response, aliasCall);
    }
  };
};

replyManager.prototype._aliasStore = function(replyItem, aliasRegistration){
  if(!typeOf(aliasRegistration, 'function')) return;
  var self = this;
  for(var alias in replyItem.alias()){
    aliasRegistration({
      type: 'reply',
      name: alias,
      run: function(args){
        return self.aliasApply(replyItem.id(), alias, args);
      }
    });
  }
};

replyManager.prototype._aliasStoreUndo = function(replyItem, aliasRegistrationUndo){
  if(!typeOf(aliasRegistrationUndo, 'function')) return;
  var self = this;
  for(var alias in replyItem.alias()){
    aliasRegistrationUndo(alias);
  }
};

replyManager.prototype._get = function(items, id){
  return items.filter(function(item){
    return item.id()==id;
  });
};

replyManager.prototype._ids = function(items){
  return Object.keys(items).map(function(index){
    return items[index].id();
  });
};

replyManager.prototype._indexById = function(items, id){
  return Object.keys(items).filter(function(index){
    return items[index].id()==id;
  });
};

replyManager.prototype._match = function(items, request, response, aliasCall){
  var cmp = function(a, b){
    if(a.rate<b.rate) return b;
    else if(a.rate>b.rate) return a;
    else if(a.priority<b.priority) return b;
    else if(a.priority>b.priority) return a;
    else return a;
    //throw pf('Error [replyManager._match]: id:("%s", "%s") rate:(%s, %s) priority:(%s %s)', a.id, b.id, a.rate, b.rate, a.priority, b.priority);
  };
  return Object.keys(items).map(function(index){
    var match = items[index].match(request, response, aliasCall);
    return {
      index: index,
      rate: match.rate,
      priority: match.priority,
      match: match.match,
      item: items[index],
      id: items[index].id(),
      execute: items[index].execute
    };
  }).reduce(cmp);
};

replyManager.prototype._set = function(items, value){
  if(!(value instanceof reply)){
    log.error('_set: not reply given:"%j"', value);
    //throw pf('Error [replyManager._set]: not reply given:"%j"', value);
  }
  else if(items.some(function(item, index, items){return item.id()==value.id();})){
    log.error('_set: reply id:"%s" already exists', value.id());
    //throw pf('Error [replyManager._set]: reply id:"%s" already exists', value.id());
  }
  items.push(value);
  return value;
};

replyManager.prototype._unset = function(items, id){
  this._indexById(items, id).map(function(index){
    delete items[index];
  });
};
