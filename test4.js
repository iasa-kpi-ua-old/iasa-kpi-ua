
var y;
var x = new Promise(function(resolve, reject){
	if(y>10) resolve(111);
	else reject(222);
})

y = 10;
x.then(function(v){
	console.log(v);
}, function(v){
	console.log(v);
	throw 'Xxxx';
});

console.log('xxxxx');