
function replay(callBack, options){
  var cb = callBack, o = options;

  if(typeof cb!='function'){
    throw 'Error httpReply.js: not valid callback';
  };
  
  if(o==undefined){
    throw 'Error httpReply.js: no options given';
  }
  else if(!o){
    throw 'Error httpReply.js: unknown options given';
  }
  else if(typeof o=='string'){
    o = {
      uri: URL.parse(o)
    };
  }
  else if(o instanseof String){
    o = {
      uri: URL.parse(o)
    };
  }
  //else if ()
  
  this.execute = function(request, response){
    
  };
  
  this.match = function(request, response){
    
  };
  
  this.matchCompare = function(request, response){
    
  };
};

module.exports = reply;
