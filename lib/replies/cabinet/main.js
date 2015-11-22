
exports.id = 'cabinet-main';
exports.match = /^[\/]cab([\/].*)?$/;
exports.execute = function(request, response, aliasCall){
    request.z.db.collection('t').find({}).toArray(function(err, rows){aliasCall('yyy', rows)});
    return;
};
exports.alias = {
    'xxxx': function(a){
        console.log(arguments);
        return a[0] + a[1] + a[2];
    },
    'yyy': function(rows){
        console.log(rows;
        response.z.view('templates/default/layout/cabinet/cab.html', {
            cab:{
                username:'Igor Petrovich' + aliasCall('xxxx', [1, 2, 3]),//���-�� ������-�� ��������
                rights:'admin'
            }
        },function(error){
            throw error;
        });
    }
};
