
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
        'html_head_title': '<title>',
        'html_head_description': '<description>',
        'html_head_abstract': '<abstract>',
        'html_head_keywords': '<keywords>',
        'html_path': '/templates/default'
    },
    loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
    /*
     loader: swig.loaders.memory({
         "layout": "{% block content %}{% endblock %}",
         "home.html": "{% extends 'layout.html' %}{% block content %}...{% endblock %}"
     })
    * */
});
