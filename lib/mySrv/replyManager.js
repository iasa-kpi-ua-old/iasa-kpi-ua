
var url = require('url');
function url2string(_url){
  if (typeof _url=='string'){
    _url = url.parse(_url);
  }
};

function replyManager(_overwrite){
  var items = [];
  var ow = Boolean(_overwrite);
  
  this.set = function(id, value){
    
  };
  
  this.get = function(id){
    
  };
  
  this.run = function(request, response){
    
  };
  
  return this;
};

module.exports = replyManager;