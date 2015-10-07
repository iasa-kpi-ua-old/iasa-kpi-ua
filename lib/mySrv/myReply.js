
function myReply(){
	var name = 'myReply';
	this.getName = function(){
		return name;
	};
	this.setName = function(_name){
		if (typeof _name=='string') name = _name;
		else if (_name instanceof String) name = _name;
		else throw 'Error myReply.setName: wrong name type';
	};
};
module.exports = myReply;


myReply.prototype.execute = function(err, req, res) {
	throw 'Error myReply.execute: not set';
};

myReply.prototype.rate = function(req){
	throw 'Error myReply.rate: not set';
};


myReply.prototype.build = function(name, execute, rate){
	var result = {};
	result.__proto__ = new myReply();
	result.execute = execute;
	result.rate = rate;
};
