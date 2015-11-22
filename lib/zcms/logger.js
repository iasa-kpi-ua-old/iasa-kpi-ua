
var debug = require('debug');
var pf = require('util').format;
var typeOf = require('./usefull').typeOf;
var LEVELs = {
	error: 0,
	warning: 1,
	notice: 2,
	info: 4,
	debug: 8
};

module.exports = function(name){
	name = typeOf(name, 'string') && name.length>0 ? name : '???';
	var levels = {}, levelKeys = Object.keys(LEVELs);
	levelKeys.forEach(function(key){
		levels[key] = debug(pf('%s:%s', key, name));
	});
	levels['unknown'] = debug(pf('unknown:%s', name));
	levels.log = function(level){
		var args = arguments.slice(1);
		if(typeOf(level, 'array')){
			for(var index in level){
				levels.log.apply(null, args.concat(level[index]));
			}
		}
		else if(typeOf(level, 'string') && (level in levelKeys)){
			levels[level].apply(null, args);
		}
		else{
			levels['unknown'].apply(null, args);
		}
	};
	return levels;
};