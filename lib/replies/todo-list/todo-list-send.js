/**
 * Created by siredvin on 25.11.15.
 */


exports.id = 'todo-list-send';
exports.match = 'post:/todo/list/send';
exports.execute = function (request, response, aliasCall) {
    request.z.POST['completed'] = request.z.POST['completed'] == "true";
    request.z.db.collection('todo_list').update({
        'text': request.z.POST['text']
    }, request.z.POST, {
        upsert: true
    });
    return true
};
