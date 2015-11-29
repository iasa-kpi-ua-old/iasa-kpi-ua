/**
 * Created by siredvin on 25.11.15.
 */


exports.id = 'todo-list';
exports.match = '/todo/list';
exports.execute = function(request, response, aliasCall){
    response.z.view('templates/default/layout/todo-list.html');
    return;
};
exports.alias = {};