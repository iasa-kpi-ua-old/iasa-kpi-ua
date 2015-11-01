
var swig = require('swig');

module.exports = new swig.Swig({
    cache: false,
    locals: {
        metaTitle: null,
        metaDescription: null,
        metaAbstract: null,
        metaKeywords: null
    },
    loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
});
