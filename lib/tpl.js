
var swig = require('swig');

module.exports = new swig.Swig({
    cache: false,
    /*
    cache: 'memory',
    cache: {
        get: function(key){ ... },
        set: function(key, val){ ... }
    }
    * */
    locals:{
        'html-title': 'title',
        'html-description': 'description',
        'html-abstract': 'abstract',
        'html-keywords': 'keywords',
        'html-path': '/templates/default'
    },
    loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
    /*
     loader: swig.loaders.memory({
         "layout": "{% block content %}{% endblock %}",
         "home.html": "{% extends 'layout.html' %}{% block content %}...{% endblock %}"
     })
    * */
});
