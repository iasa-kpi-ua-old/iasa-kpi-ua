
exports.id = 'cabinet-profile';
exports.match = '/cab/profile.html';
exports.execute = function(request, response, aliasCall){
    response.z.view('templates/default/layout/cabinet/profile.html');
    return;
};
exports.alias = {};
