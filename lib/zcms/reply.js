
var pf = require('util').format;
var typeOf = require('./usefull').typeOf;
var meta = require('./usefull').meta;

var reply = module.exports = function(_id){
  if(_id==undefined) throw pf('Error [reply.constructor]: ID is undefined');
  var self = this, ID = self._id = String(_id).toLowerCase();
  // id for reply
  self.id = function(){
    return ID;
  };
  // execute -> callback ( request, response )
  // @overwrite
  self.execute = function(request, response){
    throw pf('Error [reply.execute]: not overloaded of "%s"', ID);
  };
  // execute match -> match rate return { rate: length in [0, ...), priority: number in (0, 1), match: string }
  // @overwrite
  self.match = function(request, response){
    throw pf('Error [reply.match]: not overloaded of "%s"', ID);
  };
};

reply.prototype.one = function(id, execute, match){
  if(!typeOf(execute, 'function')){
    throw pf('Error [reply.one]: execute for id:"%s" unknown', id);
  }
  if(!typeOf(match, 'function')){
    var matchValue = match;
    match = function(request, response){
      var result = this._oneMatch(id, matchValue, meta(request));
      return result;
    };
  }
  var r = new reply(id);
  r.execute = function(request, response){
    var done = execute.apply(r, [request, response]);
    if((done==true) && !response.finished) response.end();
  };
  r.match = function(request, response){
    var result = match.apply(r, [request, response]);
    return result;
  };
  return r;
};

reply.prototype._oneMatchReturn = function(match, priority, pattern, how){
  if(!typeOf(match, 'string')){
    return { rate: 0, priority: 0, match: '' };
  }
  else if(typeOf(priority, 'number') && Number.isFinite(priority)){
    return { rate: match.length, priority: priority, match: match };
  }
  var p = parseFloat(priority);
  if(Number.isFinite(p)){
    return { rate: match.length, priority: p, match: match };
  }
  else if(typeOf(pattern, 'string')){
    switch(how){
      case 'any':
        return { rate: 0, priority: 1, match: match };
      case 'regexp':
      case 'string':
      case 'object':
        return { rate: match.length, priority: match.length/pattern.length, match: match };
    }
  }
  return {rate: 0, priority: 0, match: match };
};

reply.prototype._oneMatch = function(id, match, meta){
  //if(!meta) throw pf('Error [reply._oneMatch]: meta for id:"%s" unknown', id);
  //if(!('method' in meta)) throw pf('Error [reply._oneMatch]: meta.method for id:"%s" unknown', id);
  //if(!('hostname' in meta)) throw pf('Error [reply._oneMatch]: meta.hostname for id:"%s" unknown', id);
  //if(!('pathname' in meta)) throw pf('Error [reply._oneMatch]: meta.pathname for id:"%s" unknown', id);
  switch(typeOf(match)){
    case 'array':
      return this._oneMatchArray(id, match, meta);
    case 'object':
      return this._oneMatchObject(id, match, meta);
    case 'regexp':
      return this._oneMatchRegexp(id, match, meta);
    case 'string':
      return this._oneMatchString(id, match, meta);
    default:
      return this._oneMatchReturn('', 0);
      //throw pf('Error [reply._oneMatch]: match for id:"%s" unknown', id);
  }
};

reply.prototype._oneMatchArray = function(id, match, meta){
  if((match.length==2) && typeOf(match[0], 'regexp') && typeOf(match[1], 'number')){
    return this._oneMatchObject(id, { path: match[0], priority: match[1] }, meta);
  }
  if((match.length==2) && typeOf(match[1], 'regexp') && typeOf(match[0], 'number')){
    return this._oneMatchObject(id, { path: match[1], priority: match[0] }, meta);
  }
  var result = this.this._oneMatchReturn('', 0);
  for(var index in match){
    var tmp = this._oneMatch(id, match[index], meta);
    if(!tmp) continue;
    else if(result.rate>tmp.rate) continue;
    else if(result.rate<tmp.rate) result = this._oneMatchReturn(tmp.match, tmp.priority);
    else if(result.priority>tmp.rate) continue;
    else if(result.priority<tmp.rate) result = this._oneMatchReturn(tmp.match, tmp.priority);
    else continue;
  }
  return result;
};

reply.prototype._oneMatchObject = function(id, match, meta){
  if(('method' in match) && !this._oneMatchObjectEqual(match.method, meta.method))
    return this._oneMatchReturn('', 0);
  if(('m' in match) && !this._oneMatchObjectEqual(match.m, meta.method))
    return this._oneMatchReturn('', 0);
  if(('host' in match) && !this._oneMatchObjectEqual(match.host, meta.hostname))
    return this._oneMatchReturn('', 0);
  if(('h' in match) && !this._oneMatchObjectEqual(match.h, meta.hostname))
    return this._oneMatchReturn('', 0);
  var value = '';
  if(('path' in match) && !!match.path){
    value = this._oneMatchObjectLLike(match.path, meta.pathname);
    if(value==false) return this._oneMatchReturn('', 0);
    else if(value==true) value = match.path;
  }
  else if(('p' in match) && !!match.p){
    value = this._oneMatchObjectLLike(match.p, meta.pathname);
    if(value==false) return this._oneMatchReturn('', 0);
    else if(value==true) value = match.path;
  }
  var priority;
  if(('priority' in match) && !!match.priority) priority = match.priority;
  else if(('pp' in match) && !!match.pp) priority = match.pp;
  return this._oneMatchReturn(value, priority, meta.pathname, 'object');
};

reply.prototype._oneMatchObjectEqual = function(match, value){
  if(match=='*') return true;
  switch(typeOf(match)){
    case 'array':
      if(!match.find(function(m){return (m=='*')||(m==value);})) return false;
    case 'regexp':
      if(!match.test(value)) return false;
      return match.exec(value)[0];
    case 'string':
      if(!(match==value)) return false;
  }
  return true;
};

reply.prototype._oneMatchObjectLLike = function(match, value){
  if(match=='*') return true;
  switch(typeOf(match)){
    case 'array':
      if(!match.find(function(m){return (m=='*')||(value.indexOf(m, 0)==0);})) return false;
    case 'regexp':
      if(!match.test(value)) return false;
      return match.exec(value)[0];
    case 'string':
      if(!(value.indexOf(match, 0)==0)) return false;
  }
  return true;
};

var REPLY_PRIORITY = 2;
reply.prototype._oneMatchRegexp = function(id, match, meta){
  var matched = match.exec(meta.pathname), priority = 1./REPLY_PRIORITY++;
  if(matched){ // && (matched.index==0)
    return this._oneMatchReturn(matched[0], priority, meta.pathname, 'regexp');
  }
  else return this._oneMatchReturn('', 0);
};

reply.prototype._oneMatchString = function(id, match, meta){
  // 0.8::get://host1.host2.host3.host4/path1/path2/path3/path4
  var RE = /^(?:([\.\d]+)[\:]{2})?(?:([\w]+)[\:])?(?:[\/]{2}([\w\.\_\-]+))?((?:[\/][^\/]*)+|[\/][\*])$/i;
  if(meta.pathname.indexOf(match, 0)==0){
    return this._oneMatchReturn(match, undefined, meta.pathname, 'string');
  }
  else if(match=='*'){
    return this._oneMatchReturn('', undefined, meta.pathname, 'any');
  }
  else if(RE.test(match)){
    var m = RE.exec(match);
    return this._oneMatchObject(id, { method: m[2], host: m[3], path: m[4], priority: m[1] }, meta);
  }
  return this._oneMatchReturn('', 0);
};
