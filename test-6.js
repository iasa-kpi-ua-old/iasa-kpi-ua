var o = {
	a:11,
	b:22,
	c:33,
	d:44
}

Object.keys(o).forEach(function(index){
	console.log('k:' + index, 'v:' + o[index]);
});
console.log(o);