
var tinify = require("tinify");
var fs = require("fs");

var KEY = 'ljqA2OiiCvagv3PMWDISZtCzntl';
if(!KEY){
    console.log('If you wanna do something.  Please give us your KEY!');
    return;
}else{
    tinify.key = KEY;
}

fs.readFile("unoptimized.jpg", function(err, sourceData) {
    if (err) throw err;
    tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
        if (err) throw err;
        // ...
    });
});