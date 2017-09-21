var tinify = require("tinify");
var fs = require("fs");
var colors = require('colors');

var KEY = 'IjqA2OiiCvagv3PMWDISZtCznthd7VRi';
if(!KEY){
    console.log('If you wanna do something.  Please give us your KEY!'.red);
    return;
}

tinify.key = KEY;

// var files = readDir('source', []);
// console.log('all files pushed.'.green);

// deleteFolder("target");
// fs.mkdir("target", function(){
//     console.log('create "target" success.'.green);
// });

console.log("compressionCount:"+ tinify.compressionCount);



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

                 if (err instanceof tinify.ConnectionError ||
                    err instanceof tinify.ServerError){
                    console.log('compress failed.'+srcfile+', recompress.');
                }
                tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                    if (err) throw err;
                    // ...
                });
            });
            console.log(file);
        }
    });
}