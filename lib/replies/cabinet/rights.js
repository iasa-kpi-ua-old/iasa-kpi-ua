
exports.id = 'cabinet-rights';
exports.match = '/cab/rights.html';
exports.execute = function(request, response, aliasCall){
    response.z.view('templates/default/layout/cabinet/rights.html');
    return;
};
exports.alias = {};/**
 * Created by Екатерина on 17.11.2015.
 */
