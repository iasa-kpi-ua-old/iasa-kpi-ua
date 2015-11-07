
var pf = require('util').format;
var typeOf = require('./usefull').typeOf;
var reply = require('./reply.js');

var replyManager = module.exports = function(){
  var self = this, items = self._items = [];

  self.count = function(){
    return items.length;
  };

  self.get = function(id){
    return self._get(items, id);
  };

  self.ids = function(){
    return self._ids(items);
  };

  self.set = function(id, execute, match){
    if(typeOf(id, 'object')){
      if(typeOf(execute, 'function'));
      else if(('execute' in id) && typeOf(id.execute, 'function')) execute = id.execute;
      else if(('e' in id) && typeOf(id.e, 'function')) execute = id.e;
      else execute = undefined;
      if(!typeOf(match, 'undefined'));
      else if(('match' in id) && !typeOf(id.match, 'undefined')) match = id.match;
      else if(('m' in id) && !typeOf(id.m, 'undefined')) match = id.m;
      else match = undefined;
      id = ('id' in id) ? id.id : undefined;
    }
    return self._set(items, reply.prototype.one(id, execute, match));
  };

  self.unset = function(id){
    return self._unset(items, id);
  };

  self.run = function(request, response){
    var done = self._match(items, request, response);
    var execute = done.execute, id = done.id;
    return function(error, request, response){
      if(!error) execute(request, response);
      //else throw pf('Error [replyManager.run]: id:"%s", error:"%j"', id, error);
    };
  };
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

replyManager.prototype._match = function(items, request, response){
  var cmp = function(a, b){
    if(a.rate<b.rate) return b;
    else if(a.rate>b.rate) return a;
    else if(a.priority<b.priority) return b;
    else if(a.priority>b.priority) return a;
    else return a;
    //throw pf('Error [replyManager._match]: id:("%s", "%s") rate:(%s, %s) priority:(%s %s)', a.id, b.id, a.rate, b.rate, a.priority, b.priority);
  };
  return Object.keys(items).map(function(index){
    var match = items[index].match(request, response);
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
    throw pf('Error [replyManager._set]: not reply given:"%j"', value);
  }
  else if(items.some(function(item, index, items){return item.id()==value.id();})){
    throw pf('Error [replyManager._set]: reply id:"%s" already exists', value.id());
  }
  items.push(value);
  return true;
};

replyManager.prototype._unset = function(items, id){
  this._indexById(items, id).map(function(index){
    delete items[index];
  });
};
