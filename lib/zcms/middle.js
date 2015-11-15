
var pf = require('util').format;
var typeOf = require('./usefull').typeOf;
var meta = require('./usefull').meta;

var middle = module.exports = function(_manager, _id){
	if(!typeOf(_manager, 'object')) throw pf('Error [middle.constructor]: MANAGER is undefined');
	if(!typeOf(_id, 'string')) throw pf('Error [middle.constructor]: ID is undefined');
	var self = this, ID = self._id = String(_id).toLowerCase(), MANAGER = self._manager = _manager;
	// manager for middle
	self.manager = function(){
		return MANAGER;
	};
	// id for middle
	self.id = function(){
		return ID;
	};
	// execute -> next( error, request, response );
	// @overwrite
	self.execute = function(request, response, aliasCall, next){
		throw pf('Error [middle.execute]: not overloaded of "%s"', ID);
	};
	// execute match -> return (bool){ true | false };
	// @overwrite
	self.match = function(request, response, aliasCall){
		throw pf('Error [middle.match]: not overloaded of "%s"', ID);
	};
	// execute order -> return (int){ 1 ( this < id ) | 0 ( this > id ) };
	// @overwrite
	self.order = function(id){
		throw pf('Error [middle.order]: not overloaded of "%s"', ID);
	};
	// execute ordered -> return (bool){ true ( all requirements ok ) | false ( not all ) };
	// @overwrite
	self.ordered = function(id){
		throw pf('Error [middle.ordered]: not overloaded of "%s"', ID);
	};
};

middle.prototype.one = function(manager, id, execute, match, order, alias){
	if(!typeOf(execute, 'function')){
		throw pf('Error [middle.one]: execute for id:"%s" unknown', id);
	}
	if(!typeOf(match, 'function')){
		var _match = match;
		match = function(request, response, aliasCall){
			return this._oneMatch(id, _match, request);
		};
	}
	order = typeOf(order, 'array') ? order : typeOf(order, 'string') ? [order] : [];
	if(!typeOf(alias, 'object')){
		alias = {};
	}
	var m = new middle(manager, id);
	m.execute = function(request, response, aliasCall, next){
		var result = execute.apply(m, [request, response, aliasCall, next]);
		return result;
	};
	m.match = function(request, response, aliasCall){
		var result = match.apply(m, [request, response, aliasCall]);
		return result;
	};
	m.order = function(middleId){
		var result;
		if(middleId==undefined) result = order;
		else result = this._oneOrder.apply(m, [id, order, middleId]);
		return result;
	};
	m.ordered = function(ordered){
		var result = this._oneOrdered.apply(m, [id, order, ordered]);
		return result;
	};
	m.alias = function(){
		return alias;
	};
	return m;
};

middle.prototype._oneMatch = function(id, match, request){
	switch(typeOf(match)){
		case 'array':
			return this._oneMatchArray(id, match, request);
		case 'boolean':
			return match==true;
		case 'object':
			return this._oneMatchObject(id, match, request);
		case 'regexp':
			return this._oneMatchRegexp(id, match, request);
		case 'string':
			return this._oneMatchString(id, match, request);
		default:
			return false;
			//throw pf('Error [middle._oneMatch]: match for id:"%s" unknown', id);
	}
};

middle.prototype._oneMatchArray = function(id, match, request){
	for(var index in match){
		if(this._oneMatch(id, match[index], request)) return true;
	}
	return false;
};

middle.prototype._oneMatchObject = function(id, match, request){
	var rm = typeOf(request.z, 'object') && typeOf(request.z.URL, 'object') ? request.z.URL : meta(request);
	if(('method' in match) && !this._oneMatchObjectEqual(match.method, rm.method)) return false;
	if(('m' in match) && !this._oneMatchObjectEqual(match.m, rm.method)) return false;
	if(('host' in match) && !this._oneMatchObjectEqual(match.host, rm.hostname)) return false;
	if(('h' in match) && !this._oneMatchObjectEqual(match.h, rm.hostname)) return false;
	if(('path' in match) && !this._oneMatchObjectLLike(match.path, rm.pathname)) return false;
	if(('p' in match) && !this._oneMatchObjectLLike(match.p, rm.pathname)) return false;
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

middle.prototype._oneMatchRegexp = function(id, match, request){
	var rm = typeOf(request.z, 'object') && typeOf(request.z.URL, 'object') ? request.z.URL : meta(request);
	var result = match.exec(rm.pathname);
	return result && (result.index==0);
};

middle.prototype._oneMatchString = function(id, match, request){
	var rm = typeOf(request.z, 'object') && typeOf(request.z.URL, 'object') ? request.z.URL : meta(request);
	// get://host1.host2.host3.host4/path1/path2/path3/path4
	var RE = /^(?:([\w]+|[\*])[\:])?(?:[\/]{2}([\w\.\_\-]+|[\*]))?(?:[\/]([^\/]+(?:[\/][^\/]+)*|[\*])?)?$/i;
	if(match==''){
		return false;
	}
	else if(rm.pathname.indexOf(match, 0)==0){
		return true;
	}
	else if(match=='*'){
		return true;
	}
	else if(RE.test(match)){
		var m = RE.exec(match);
		var matched = {};
		if(m[1]) matched.method = m[1];
		if(m[2]) matched.host = m[2];
		if(m[3]) matched.path = m[3]=='*' ? '*' : '/' + m[3];
		return this._oneMatchObject(id, matched, request);
	}
	return false;
};

middle.prototype._oneOrder = function(id, order, middleId){
	switch(typeOf(order)){
		case 'array':
			for(var index in order){
				if(this._oneOrder(id, order[index], middleId)==1) return 1;
			}
			return 0;
		case 'string':
			return (order.toLowerCase()==middleId) ? 1 : 0;
		default:
			throw pf('Error [middle._oneOrder]: order for id:"%s" unknown', id);
	}
};

middle.prototype._oneOrdered = function(id, order, ordered){
	for(var index in order){
		if(ordered.indexOf(order[index])==-1) return false;
	}
	return true;
};
