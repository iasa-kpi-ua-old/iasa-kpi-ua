
function myManager(){
	var name = 'myManager';
	this.getName = function(){
		return name;
	};
	this.setName = function(_name){
		if (typeof _name=='string') name = _name;
		else if (_name instanceof String) name = _name;
		else throw 'Error myManager.setName: wrong name type';
	};
};
module.exports = myManager;


myManager.prototype.execute = function(req, res, next) {
	throw 'Error myManager.execute: not set';
};

myManager.prototype.rate = function(req){
	throw 'Error myManager.rate: not set';
};
