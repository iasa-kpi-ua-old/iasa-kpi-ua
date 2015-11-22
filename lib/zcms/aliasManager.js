
var pf = require('util').format;
var log = require('./logger')('aliasManager');
var typeOf = require('./usefull').typeOf;

var aliasManager = module.exports = function(){
	var self = this, items = self._items = [];
	// check if there is an alias
	self.is = function(name){
		return self._is(items, name);
	};
	// get alias record (name, run, ...)
	self.get = function(name){
		return self._get(items, name);
	};
	// set alias record (name, run, ...)
	self.set = function(alias){
		return self._set(items, alias);
	};
	// run alias by name with given arguments
	self.run = function(name, args){
		return self._run(items, name, args);
	};
	// unset alias by name
	self.inset = function(name){
		return self._unset(items, name);
	};
};

aliasManager.prototype._is = function(items, name){
	var result = items.some(function(v){
		return v.name==name;
	});
	log.debug('_is("%s") -> %j', name, result);
	return result;
};

aliasManager.prototype._get = function(items, name){
	var result = items.find(function(v){
		return v.name==name;
	});
	log.debug('_get("%s") -> %j', name, result);
	return result ? result : undefined;
};

aliasManager.prototype._getIndex = function(items, name){
	var result = items.findIndex(function(v){
		return v.name==name;
	});
	log.debug('_getIndex("%s") -> %j', name, result);
	return result ? result : undefined;
};

aliasManager.prototype._run = function(items, name, args){
	var item = this._get(items, name);
	log.debug('_run("%s") with args: %j', name, args);
	var result = item ? item.run(args) : undefined;
	log.debug('_run("%s") -> %j', name, result);
	return result;
};

aliasManager.prototype._set = function(items, alias){
	if(!typeOf(alias, 'object')){
		log.error('_set: %j', alias);
		return undefined;
	}
	else if(!typeOf(alias.name, 'string')){
		log.error('_set: %j; name not string', alias);
		return undefined;
	}
	else if(!typeOf(alias.run, 'function')){
		log.error('_set: %j; run not function', alias);
		return undefined;
	}
	else if(this._is(items, alias.name)){
		log.warning('_set: %j; overload alias', alias);
		//throw pf('Warning [aliasManager._set]: overloading alias [%j]', alias);
		var index = this._getIndex(items, alias.name);
		items[index] = alias;
	}
	else{
		var result = items.push(alias);
		log.debug('_set: %j; with result %j', alias, result);
		return result;
	}
};

aliasManager.prototype._unset = function(items, name){
	if(!typeOf(name, 'string')){
		log.error('_unset: "%s"; name not string', name);
		return undefined;
	}
	else if(!this._is(items, name)){
		log.warning('_unset: "%s"; unknown alias', name);
		return undefined;
	}
	else{
		log.debug('_unset: "%s"', name);
		var index = this._getIndex(items, name);
		items[index] = undefined;
		delete items[index];
		return true;
	}
};
