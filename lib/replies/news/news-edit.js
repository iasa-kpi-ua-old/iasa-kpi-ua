
var typeOf = require('../../zcms/usefull').typeOf;
var config = require('./config');


exports.id = 'news-edit';
exports.match = '/news/edit';
exports.execute = function(request, response, aliasCall){
    var log = request.z.logger('news-edit');

    var regex = new RegExp('^/news/edit/(new|\\d+)$', 'i');
    var postParsed = request.z.path().match(regex);
    var postId = parseInt(postParsed[1]);

    var viewFn = function(error, item){
        response.z.view('replies/news/layout/edit.html', {
            post: item
        }, function(error){
            throw error;
        })
    };
    if(postId >= 0){
        aliasCall('news-edit', request.z, {
            where: {
                _id: postId
            }
        }, viewFn);
    } else {
        viewFn(undefined, {title: "New post", content: "New content", author: config['new-author']});
    }
};

exports.alias = {
    'news-edit': function (z, opt, back) {
        var cursor = z.db.collection('news')
            .find(opt.where) // better to use findOne but it throws some internal error
            .limit(1);

        cursor.toArray(function (error, rows) {
            back(error, rows[0])
        })
    }
    // ERROR: if add more aliases with names(i.e. news-edit-add) here, last would be chosen.
};
