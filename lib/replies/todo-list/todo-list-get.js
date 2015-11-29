/**
 * Created by siredvin on 25.11.15.
 */


exports.id = 'todo-list-get';
exports.match = 'post:/todo/list/get';
exports.execute = function (request, response, aliasCall) {
    aliasCall('todo-list-view', request.z, function(items){
        response.end(JSON.stringify(items))
    });
};
