// async


var async = require('async');

async.waterfall(
    [
        function (cb){
            console.log("1: %s", null);
            cb(null, 1, 2, 3);
        },
        function (a, b, c, cb){
            console.log("2: %s, %s, %s", a, b, c);
            cb('xx', a+b+c);
        },
        function (d, cb){
            console.log("3: %s", d);
            cb(null, d*d);
        }
    ],
    function (err, a){
        if (err) console.log('Error', err);
        else console.log("9: %s", a);
    }
);
