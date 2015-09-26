function xxx (){
    this.y = 8;
    this.x = 10;
}

function yyy (){
    this.y = 11;
}

yyy.prototype = new xxx();

var Y = new yyy();

console.log(Y.__proto__.y);
