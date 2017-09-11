
var tinify = require("tinify");
var fs = require("fs");
var colors = require('colors');

var KEY = 'ljqA2OiiCvagv3PMWDISZtCzntl';
if(!KEY){
    console.log('If you wanna do something.  Please give us your KEY!'.red);
    return;
}


tinify.key = KEY;
// tinify.proxy = "http://user:pass@192.168.0.1:8080";

var files = readDir('source', []);
console.log('all files pushed.'.green);

deleteFolder("target");
fs.mkdir("target", function(){
    console.log('create "target" success.'.green);
});

tinypngFile(files, 'source');


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


function tinypngFile(files, path) {
    files.forEach(function(file,index){
        if(typeof file == 'object'){
            tinypngFile(file.files, file.path);
        }else{
            if(!!path) file  = path + "/" + file;
            fs.readFile(file, function(err, sourceData) {
                if (err) throw err;
                tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                    if (err) throw err;
                    // ...
                });
            });
            console.log(file);
        }
    });
}