var middleManager = require('./middleManager');
var replyManager = require('./replyManager');
var async = require('async');

function serverManager(){
  var mm = new middleManager();
  var rm = new replyManager();
  
  this.register = function(id, execute, order){
    mm.set(id, execute, order);
  };
  
  this.reply = function(id, execute){
    rm.set(id, execute);
  };
  
  this.run = function(request, response){
    var task = mm.run(request, response);
    var done = rm.run(request, response);
    async.waterfal(task, done);
  };
};
