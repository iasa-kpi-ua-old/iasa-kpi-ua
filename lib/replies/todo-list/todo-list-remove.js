/**
 * Created by siredvin on 25.11.15.
 */


exports.id = 'todo-list-remove';
exports.match = 'post:/todo/list/remove';
exports.execute = function (request, response, aliasCall) {
    request.z.db.collection('todo_list').remove({
        'text': request.z.POST['text']
    });
    return true
};
/**
 * Created by siredvin on 29.11.15.
 */
