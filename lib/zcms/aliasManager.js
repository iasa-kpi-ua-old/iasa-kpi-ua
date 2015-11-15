
var pf = require('util').format;
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
		var item = self.get(name);
		return item ? item.run(args) : undefined;
	};
};

aliasManager.prototype._is = function(items, name){
	return items.some(function(v){
		return v.name==name;
	});
};

aliasManager.prototype._get = function(items, name){
	var result = items.find(function(v){
		return v.name==name;
	});
	return result ? result : undefined;
};

aliasManager.prototype._set = function(items, alias){
	if(!typeOf(alias, 'object')){
		return undefined;
	}
	else if(!typeOf(alias.name, 'string')){
		return undefined;
	}
	else if(!typeOf(alias.run, 'function')){
		return undefined;
	}
	else if(this._is(items, alias.name)){
		throw pf('Warning [aliasManager._set]: overloading alias [%j]', alias);
	}
	else{
		return items.push(alias);
	}
};
