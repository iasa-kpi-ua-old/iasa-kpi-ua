/**
 * Created by siredvin on 25.11.15.
 */


exports.id = 'todo-list';
exports.match = '/todo/list';
exports.execute = function (request, response, aliasCall) {
    aliasCall('todo-list-view', request.z, function(items){
        response.z.view('templates/default/layout/todo-list.html', {
            todo_items:{
                items: items
            }
        }, function(error){
            throw error;
        });
    });
};
exports.alias = {
    'todo-list-view': function (z, back) {
        z.db.collection('todo_list')
            .find({}, {'_id': false})
            .toArray(function (error, rows) {
                if (error) throw error;
                else back(rows);
            });
    }
};