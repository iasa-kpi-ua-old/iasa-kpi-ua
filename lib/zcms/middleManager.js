
var pf = require('util').format;
var typeOf = require('./usefull').typeOf;
var middle = require('./middle.js');

var middleManager = module.exports = function(){
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

	self.set = function(id, execute, match, order){
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
			id = ('id' in id) ? id.id : undefined;
		}
		return self._set(items, middle.prototype.one(id, execute, match, order));
	};

	self.unset = function(id){
		return self._unset(items, id);
	};

	self.run = function(request, response){
		var tasks = self._matchedOrder(items, request, response).map(function(index){
			var item = items[index], execute = item.execute, id = item.id();
			//return id; // !!!
			return function(request, response, next){
				var middleNext = function(err, req, res){
					//console.log('mm: ', err, request.url, id); // !!!
					if(!req) req = request;
					if(!res) res = response;
					next(err, req, res);
				};
				var result = execute(request, response, middleNext);
				// execute CALLS CALLBACK or RETURNS OBJECT as result
				if(typeOf(result, 'object')){
					var req = ('request' in result) ? result.request : ('req' in result) ? result.req : request;
					var res = ('response' in result) ? result.response : ('res' in result) ? result.res : response;
					var err = ('error' in result) ? result.error : ('err' in result) ? result.err : null;
					middleNext(err, req, res);
				}
			};
		});
		tasks.unshift(function(next){
			next(null, request, response);
		});
		return tasks;
	};
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

middleManager.prototype._matchedOrder = function(items, request, response){
	var cmp = function(ab, ba, aID, bID){
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
		if(ab<ba) return -1;
		else if(ab>ba) return 1;
		else return 0;
		// throw pf('Error [middleManager._matchedOrder.cmp]: id:("%s", "%s")', aID, bID);
	};
	return Object.keys(items).filter(function(index){
		return items[index].match(request, response);
	}).sort(function(aIndex, bIndex){
		var a = items[aIndex], b = items[bIndex];
		return cmp(a.order(b.id()), b.order(a.id()), a.id(), b.id());
	});
};

middleManager.prototype._set = function(items, value){
	if(!(value instanceof middle)){
		throw pf('Error [middleManager._set]: not middle given:"%j"', value);
	}
	else if(items.some(function(item){return item.id()==value.id();})){
		throw pf('Error [middleManager._set]: middle id:"%s" already exists', value.id());
	}
	items.push(value);
	return true;
};

middleManager.prototype._unset = function(items, id){
	this._indexById(items, id).map(function(index){
		delete items[index];
	});
};
