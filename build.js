var file = require("./lib/file.js");
var colors = require("colors");
var fs = require("fs");
var tinify = require("./lib/tinify.js");

// console.log("Start get keys.");
var data_key = fs.readFileSync( "./key.json" , "utf-8");
global.KEYS = JSON.parse(data_key);
global.index = global.KEYS.index -1;
global.key = global.KEYS.key[global.index];
if(!global.key){
    console.log('If you wanna do something.  Please give us your KEY!'.red);
    return;
}else{
    console.log("Get keys.");
}

var data_compress = fs.readFileSync( "./compress.json" , "utf-8");
global.COMPRESS = JSON.parse(data_compress);
global.sourceFilder = 'source';
global.outputFilder = 'output';

function handleArgv(param){
    var theParam = param;
    theParam.splice(0,2);
    if(theParam.length == 0) return;

    for(var i = 0; i < theParam.length; i++){
        var reg1 = /^to\-.*/;
        var reg1 = /^from\-.*/;
        if(reg1.test(theParam[i])){
            global.outputFilder = theParam[i].substring(3);
            // console.log(theParam[i].substring(3));
        }else if(reg2.test(theParam[i])) {
            global.sourceFilder = theParam[i].substring(5);
        }
    }
}

handleArgv(process.argv);

file.deleteFolderSync(global.outputFilder);
fs.mkdir(global.outputFilder);
file.copySync(global.sourceFilder,global.outputFilder);
var files = file.readDirSync(global.sourceFilder, "r");
console.log("Done preparation work.");

tinify.compressAllFiles(files, global.sourceFilder);