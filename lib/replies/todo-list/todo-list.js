/**
 * Created by siredvin on 25.11.15.
 */


exports.id = 'todo-list';
exports.match = '/todo/list';
exports.execute = function(request, response, aliasCall){
    aliasCall('news-view', [request.z.db, function(record){
        response.z.view('templates/default/layout/news.html', {
            news:{
                title: 'xxx',
                content: 'yyy',
                meta:{
                    z: request.z.path()
                }
            }
        }, function(error){
            throw error;
        });
    }]);
};
exports.alias = {};