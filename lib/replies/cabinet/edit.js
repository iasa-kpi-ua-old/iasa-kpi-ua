
exports.id = 'cabinet-edit';
exports.match = '/cab/edit.html';
exports.execute = function(request, response, aliasCall){
    response.z.view('templates/default/layout/cabinet/edit.html');
    return;
};
exports.alias = {};/**
 * Created by Екатерина on 17.11.2015.
 */
