
var tinify = require("tinify");
var fs = require("fs");
var colors = require('colors');

var KEY = 'ljqA2OiiCvagv3PMWDISZtCzntl';
if(!KEY){
    console.log('If you wanna do something.  Please give us your KEY!'.red);
    return;
}else{
    tinify.key = KEY;
}
var files = readDir('source', []);
console.log('all files pushed.'.green);

deleteFolder("target");
fs.mkdir("target", function(){
    console.log('create "target" success.'.green);
});


fs.readFile("unoptimized.jpg", function(err, sourceData) {
    if (err) throw err;
    tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
        if (err) throw err;
        // ...
    });
});


/*公共方法*/
function deleteFolder(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function readDir(path, arr){
    var files = arr;
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                files[index] = {
                    path: curPath,
                    files: readDir(curPath, files[index])
                };
            } else {
            }
        });
    }
    return files;
}