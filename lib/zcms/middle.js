
var pf = require('util').format;
var typeOf = require('./usefull').typeOf;
var meta = require('./usefull').meta;

var middle = module.exports = function(_id){
	var self = this, ID = self._id = String(_id).toLowerCase();
	// id for middle
	self.id = function(){
		return ID;
	};
	// execute -> return (object){ request: request, response: response, error: error };
	// @overwrite
	self.execute = function(request, response){
		throw pf('Error [middle.execute]: not overloaded of "%s"', ID);
	};
	// execute match -> return (bool){ true | false };
	// @overwrite
	self.match = function(request, response){
		throw pf('Error [middle.match]: not overloaded of "%s"', ID);
	};
	// execute order -> return (int){ 1 ( this < id ) | 0 ( this > id ) };
	// @overwrite
	self.order = function(id){
		throw pf('Error [middle.order]: not overloaded of "%s"', ID);
	};
};

middle.prototype.one = function(id, execute, match, order){
	if(!typeOf(execute, 'function')){
		throw pf('Error [middle.one]: execute for id:"%s" unknown', id);
	}
	if (!typeOf(match, 'function')){
		var _match = match;
		match = function(request, response){
			return this._oneMatch(id, _match, meta(request));
		};
	}
	if (!typeOf(order, 'function')){
		var _order = order;
		order = function(middleId){
			return this._oneOrder(id, _order, middleId);
		};
	}
	var m = new middle(id);
	m.execute = function(request, response){
		return execute.apply(m, [request, response]);
	};
	m.match = function(request, response){
		return match.apply(m, [request, response]);
	};
	m.order = function(id){
		return order.apply(m, [id]);
	};
	return m;
};

middle.prototype._oneMatch = function(id, match, meta){
	//if(!meta) throw pf('Error [middle._oneMatch]: meta for id:"%s" unknown', id);
	//if(!('method' in meta)) throw pf('Error [middle._oneMatch]: meta.method for id:"%s" unknown', id);
	//if(!('hostname' in meta)) throw pf('Error [middle._oneMatch]: meta.hostname for id:"%s" unknown', id);
	//if(!('pathname' in meta)) throw pf('Error [middle._oneMatch]: meta.pathname for id:"%s" unknown', id);
	switch(typeOf(match)){
		case 'array':
			return this._oneMatchArray(id, match, meta);
		case 'boolean':
			return match==true;
		case 'object':
			return this._oneMatchObject(id, match, meta);
		case 'regexp':
			return this._oneMatchRegexp(id, match, meta);
		case 'string':
			return this._oneMatchString(id, match, meta);
		default:
			return false;
			//throw pf('Error [middle._oneMatch]: match for id:"%s" unknown', id);
	}
};

middle.prototype._oneMatchArray = function(id, match, meta){
	for(var index in match){
		if(this._oneMatch(id, match[index], meta)) return true;
	}
	return false;
};

middle.prototype._oneMatchObject = function(id, match, meta){
	if(('method' in match) && !this._oneMatchObjectEqual(match.method, meta.method)) return false;
	if(('m' in match) && !this._oneMatchObjectEqual(match.m, meta.method)) return false;
	if(('host' in match) && !this._oneMatchObjectEqual(match.host, meta.hostname)) return false;
	if(('h' in match) && !this._oneMatchObjectEqual(match.h, meta.hostname)) return false;
	if(('path' in match) && !this._oneMatchObjectLLike(match.path, meta.pathname)) return false;
	if(('p' in match) && !this._oneMatchObjectLLike(match.p, meta.pathname)) return false;
	return true;
};

middle.prototype._oneMatchObjectEqual = function(match, value){
	if(match=='*') return true;
	switch(typeOf(match)){
		case 'array':
			if(!match.find(function(m){return (m=='*')||(m==value);})) return false;
		case 'regexp':
			if(!match.test(value)) return false;
		case 'string':
			if(!(match==value)) return false;
	}
	return true;
};

middle.prototype._oneMatchObjectLLike = function(match, value){
	if(match=='*') return true;
	switch(typeOf(match)){
		case 'array':
			if(!match.find(function(m){return (m=='*')||(value.indexOf(m, 0)==0);})) return false;
		case 'regexp':
			if(!match.test(value)) return false;
		case 'string':
			if(!(value.indexOf(match, 0)==0)) return false;
	}
	return true;
};

middle.prototype._oneMatchRegexp = function(id, match, meta){
	var result = match.exec(meta.pathname);
	return result && (result.index==0);
};

middle.prototype._oneMatchString = function(id, match, meta){
	// get://host1.host2.host3.host4/path1/path2/path3/path4
	var RE = /^(?:([\w]+)[\:])?(?:[\/]{2}([\w\.\_\-]+))?((?:[\/][^\/]*)+|[\*])$/i;
	if(meta.pathname.indexOf(match, 0)==0){
		return true;
	}
	else if(match=='*'){
		return true;
	}
	else if(RE.test(match)){
		var m = RE.exec(match);
		return this._oneMatchObject(id, { method: m[1], host: m[2], path: m[3] }, meta);
	}
	return false;
};

middle.prototype._oneOrder = function(id, order, middleId){
	//if(!middleId) throw pf('Error [middle._oneOrder]: middleId for id:"%s" unknown', id);
	switch(typeOf(order)){
		case 'array':
			for(var index in order){
				if(this._oneOrder(id, order[index], middleId)==1) return 1;
			}
			return 0;
		case 'number':
			return (order>0) ? 1 : (order<0) ? -1 : 0;
		case 'regexp':
			var result = order.exec(middleId);
			return !!result ? 1 : 0;
		case 'string':
			return (order.toLowerCase()==middleId) ? 1 : 0;
		default:
			return 0;
			//throw pf('Error [middle._oneOrder]: order for id:"%s" unknown', id);
	}
};
