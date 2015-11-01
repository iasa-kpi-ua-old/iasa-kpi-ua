
var pf = require('util').format;
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
		return self._set(items, middle.prototype.one(id, execute, match, order));
	};

	self.unset = function(id){
		return self._unset(items, id);
	};

	self.run = function(request, response){
		var tasks = self._matchedOrder(items, request, response).map(function(index){
			var item = items[index], execute = item.execute, id = item.id();
			// return id; // !!!
			return function(request, response, next){
				try{
					var result = execute(request, response), req = request, res = response, err = null;
					if('request' in result) req = result.request;
					else if('req' in result) req = result.req;
					if('response' in result) res = result.response;
					else if('res' in result) res = result.res;
					if('error' in result) err = result.error;
					else if('err' in result) err = result.err;
					next(err, req, res);
				}
				catch (err){
					next(err, request, response);
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
		if (ab<ba) return -1;
		else if (ab>ba) return 1;
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
