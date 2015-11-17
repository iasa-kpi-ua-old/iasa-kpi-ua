
exports.id = 'cabinet-feedback';
exports.match = '/cab/feedback.html';
exports.execute = function(request, response, aliasCall){
    response.z.view('templates/default/layout/cabinet/feedback.html');
    return;
};
exports.alias = {};/**
 * Created by Екатерина on 17.11.2015.
 */
