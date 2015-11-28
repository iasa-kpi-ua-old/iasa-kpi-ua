
var pf = require('util').format;
var log = require('./logger')('middleManager');
var typeOf = require('./usefull').typeOf;
var middle = require('./middle.js');

var middleManager = module.exports = function(_core){
	if(!typeOf(_core, 'object')) throw pf('Error [middleManager.constructor]: CORE is undefined');
	var self = this, items = self._items = [], CORE = self._core = _core;
	// alias call
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
			log.warning('Unknown exception on alias-call id:%s, name:%s, args:%j', id, name, args);
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
	// core for middleManager
	self.core = function(){
		return CORE;
	};
	// count
	self.count = function(){
		return items.length;
	};
	// done: reordering after all set's & check requirements
	self.done = function(){
		log.debug('Done\n');
		self._order(items);
		log.debug('Done ordering\n');
		self._ordered(items);
		log.debug('Done dependence check\n');
	};
	// get
	self.get = function(id){
		var result = self._get(items, id);
		log.debug('Get middle id:%s -> %j', id, result ? 'ok' : 'undefined');
		return result;
	};
	// IDs
	self.ids = function(){
		var result = self._ids(items);
		log.debug('IDs -> %j', result);
		return result;
	};
	// set
	self.set = function(id, execute, match, order, alias){
		if(typeOf(id, 'object')){
			if(typeOf(execute, 'function'));
			else if(('execute' in id) && typeOf(id.execute, 'function')) execute = id.execute;
			else if(('e' in id) && typeOf(id.e, 'function')) execute = id.e;
			else execute = undefined;
			if(!typeOf(match, 'undefined'));
			else if(('match' in id) && !typeOf(id.match, 'undefined')) match = id.match;
			else if(('m' in id) && !typeOf(id.m, 'undefined')) match = id.m;
			else match = undefined;
			if(!typeOf(order, 'undefined'));
			else if(('order' in id) && !typeOf(id.order, 'undefined')) order = id.order;
			else if(('o' in id) && !typeOf(id.o, 'undefined')) order = id.o;
			else order = undefined;
			if(typeOf(alias, 'object'));
			else if(('alias' in id) && typeOf(id.alias, 'object')) alias = id.alias;
			else if(('a' in id) && typeOf(id.a, 'object')) alias = id.a;
			else alias = undefined;
			id = ('id' in id) ? id.id : undefined;
		}
		log.debug('Middle registration id:"%s", match:"%s", order:"%s", alias:{%s}', id, match, order, typeOf(alias, 'object') ? Object.keys(alias) : '');
		var m = middle.prototype.one(self, id, execute, match, order, alias);
		var result = self._set(items, m);
		// self._order(items); // do it after all set's
		return result;
	};
	// unset
	self.unset = function(id){
		log.debug('Middle registration undo id:%s', id);
		return self._unset(items, id);
	};
	// run
	self.run = function(request, response, aliasCall){
		var tasks = self._match(items, request, response, aliasCall);
		tasks = tasks.map(function(index){
			var item = items[index], execute = item.execute, id = item.id();
			return function(request, response, aliasCall, next){
				var middleNext = function(err, req, res, acall){
					//console.log(id); // !!!
					if(!acall) acall = aliasCall;
					if(!err) err = null;
					if(!req) req = request;
					if(!res) res = response;
					next(err, req, res, acall);
				};
				var result = execute(request, response, aliasCall, middleNext);
				// execute CALLS CALLBACK or RETURNS OBJECT as result
				//console.log('mm: ', !!request.z, id, result); // !!!
				if(typeOf(result, 'object')){
					var acall = ('aliasCall' in result) ? result.aliasCall : ('acall' in result) ? result.acall : aliasCall;
					var err = ('error' in result) ? result.error : ('err' in result) ? result.err : null;
					var req = ('request' in result) ? result.request : ('req' in result) ? result.req : request;
					var res = ('response' in result) ? result.response : ('res' in result) ? result.res : response;
					middleNext(err, req, res, acall);
				}
				else if(!!result){
					middleNext(null, request, response, aliasCall);
				}
			};
		});
		tasks.unshift(function(next){
			request.z = response.z = {};
			next(null, request, response, aliasCall);
		});
		return tasks;
	};
};

middleManager.prototype._aliasStore = function(middleItem, aliasRegistration){
	if(!typeOf(aliasRegistration, 'function')) return;
	var self = this;
	for(var alias in middleItem.alias()){
		aliasRegistration({
			type: 'middle',
			name: alias,
			run: function(args){
				return self.aliasApply(middleItem.id(), alias, args);
			}
		});
	}
};

middleManager.prototype._aliasStoreUndo = function(middleItem, aliasRegistrationUndo){
	if(!typeOf(aliasRegistrationUndo, 'function')) return;
	var self = this;
	for(var alias in middleItem.alias()){
		aliasRegistrationUndo(alias);
	}
};

middleManager.prototype._get = function(items, id){
	return items.filter(function(item){
		return item.id()==id;
	});
};

middleManager.prototype._ids = function(items){
	return Object.keys(items).map(function(index){
		return items[index].id();
	});
};

middleManager.prototype._indexById = function(items, id){
	return Object.keys(items).filter(function(index){
		return items[index].id()==id;
	});
};

middleManager.prototype._match = function(items, request, response, aliasCall){
	return Object.keys(items).filter(function(index){
		return items[index].match(request, response, aliasCall);
	});
};

middleManager.prototype._order = function(items){
	/*
	 *  ab | ba -> return    ab | ba -> return    ab | ba -> return
	 *  -1 | -1 -> error      0 | -1 ->  1         1 | -1 ->  1
	 *  -1 |  0 -> -1         0 |  0 ->  0         1 |  0 ->  1
	 *  -1 |  1 -> -1         0 |  1 -> -1         1 |  1 -> error
	 *
	 *  ab | ba -> return    ab | ba -> return
	 *   0 |  0 ->  0         1 |  0 ->  1
	 *   0 |  1 -> -1         1 |  1 ->  0 (error)
	 */
	var compareOrders = function(ab, ba, aID, bID){
		if(ab<ba) return -1;
		else if(ab>ba) return 1;
		else if(ab==ba && ab==0)return 0;
		else{
			log.error('_matchedOrder.cmp: id:("%s", "%s")', aID, bID);
			//throw pf('Error [middleManager._matchedOrder.cmp]: id:("%s", "%s")', aID, bID);
		}
	};
	var itemsCompre = function(items, aIndex, bIndex){
		var a = items[aIndex], b = items[bIndex];
		return compareOrders(a.order(b.id()), b.order(a.id()), a.id(), b.id());
	};
	var itemsSwap = function(items, indexA, indexB){
		var item = items[indexA];
		items[indexA] = items[indexB];
		items[indexB] = item;
	};
	for(var i=0; i<items.length; i++){
		for(var j=0; j<items.length; j++){
			if((i!=j) && (itemsCompre(items, i, j)<0)) itemsSwap(items, i, j)
		}
	}
};

middleManager.prototype._ordered = function(items){
	var ordered = [];
	for(var i=0; i<items.length; i++){
		var item = items[i], id = item.id();
		if(!item.ordered(ordered)){
			log.error('_ordered: not all ordered in %j', id);
			//throw pf('Error [middleManager._ordered]: not all ordered in %j', id);
		}
		else{
			ordered.push(id);
		}
	}
};

middleManager.prototype._set = function(items, value){
	if(!(value instanceof middle)){
		log.error('_set: not middle given:"%j"', value);
		//throw pf('Error [middleManager._set]: not middle given:"%j"', value);
	}
	else if(items.some(function(item){return item.id()==value.id();})){
		log.error('_set: middle id:"%s" already exists', value.id());
		//throw pf('Error [middleManager._set]: middle id:"%s" already exists', value.id());
	}
	items.push(value);
	return value;
};

middleManager.prototype._unset = function(items, id){
	this._indexById(items, id).map(function(index){
		delete items[index];
	});
};
