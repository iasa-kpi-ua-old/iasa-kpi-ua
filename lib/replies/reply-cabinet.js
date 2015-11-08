exports.id = 'cabinet';
exports.match = '/cab';
exports.execute = function(request, response){
    response.z.view('templates/default/layout/cab.html', {
        cab:{
            username:'Igor Petrovich',//как-то откуда-то вытащить
            rights:'admin'
        }
    },function(error){
        throw error;
    });
    return;
}