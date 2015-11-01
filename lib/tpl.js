var SWIG = require('swig');

module.exports = new SWIG.Swig({
    cache: false,
    locals: {
        metaTitle: null,
        metaDescription: null,
        metaAbstract: null,
        metaKeywords: null
    },
    loader: SWIG.loaders.fs('./storage', {encoding: 'utf8'})
});

