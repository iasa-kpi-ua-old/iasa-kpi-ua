
exports.id = 'cabinet-main';
exports.match = /^[\/]cab([\/].*)?$/;
exports.execute = function(request, response, aliasCall){
    response.z.view('templates/default/layout/cabinet/cab.html', {
        cab:{
            username:'Igor Petrovich',//���-�� ������-�� ��������
            rights:'admin'
        }
    },function(error){
        throw error;
    });
    return;
};
exports.alias = {};
