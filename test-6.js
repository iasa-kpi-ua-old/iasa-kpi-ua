var util = require('util');

var o = {
	a:11,
	b:22,
	c:{
		c1:8,
		c2:9,
	},
	d:44
};

var o2 = {
	e:55,
	f:66,
	d:77,
	c:{c3:10}
};

var o3 = Object.assign(o, o2);

Object.keys(o3).forEach(function(index){
	console.log('k:' + index, 'v:' + o3[index]);
});
console.log(o3);