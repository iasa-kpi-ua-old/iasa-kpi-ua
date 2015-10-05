function middle (){
    var name = 'middle-base';
    this.getName = function (){
        return name;
    };
    this.setName = function (_name){
        if (!(typeof _name=='string' && _name instanceof String)) throw 'Error middle.js::setName : wrong name type';
        else if (_name.trim().length<1) throw 'Error middle.js::setName : wrong name length';
        name = String(_name);
    };
    this.execute = function (request, resporse, next){
        throw 'Error middle.js::execute : method not set for ' + name;
    };
    this.executOn = function (request, resporse){
        throw 'Error middle.js::executOn : method not set for ' + name;
    };
    this.executeOrder = function (_middleName){
        throw 'Error middle.js::executeOrder : method not set for ' + name;
    };
};

middle.prototype.wrap = function (f, on, order){
    var o = { execute: f, executOn: on, executeOrder: order };
    o.__proto__ = new middle();
    return o;
};

module.exports = middle;