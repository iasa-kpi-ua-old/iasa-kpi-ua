
function myMiddle(){
	var name = 'myMiddle';
	this.getName = function(){
		return name;
	};
	this.setName = function(_name){
		if (typeof _name=='string') name = _name;
		else if (_name instanceof String) name = _name;
		else throw 'Error myMiddle.setName: wrong name type';
	};
};
module.exports = myMiddle;


myMiddle.prototype.execute = function(req, res, next) {
	throw 'Error myMiddle.execute: not set';
};

myMiddle.prototype.check = function(req){
	throw 'Error myMiddle.check: not set';
};

myMiddle.prototype.order = function(name){
	throw 'Error myMiddle.order: not set';
};


myMiddle.prototype.build = function(name, execute, check, order){
	var result = {};
	result.__proto__ = new myMiddle();
	result.check = check;
	result.execute = execute;
	result.order = order;
};
