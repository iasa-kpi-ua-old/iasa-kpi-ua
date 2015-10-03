var list = function (){
	var items = {};
	this.is = function (key){ return items[key]!==undefined; };
	this.set = function (key, value, overWrite){
		if (typeof key!=='string' && !(key instanceof String)) throw 'Error listOfReplayes: wrong key type [' + (typeof key) + ']';
		else if (!this.is(key)) items[key]
		if (overWrite) items

	};

};

module.exports = list;

