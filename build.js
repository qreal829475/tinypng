var file = require("./file.js");
var colors = require("colors");
var fs = require("fs");
var tinify = require("./tinify.js");

console.log("Start get keys.");
var data = fs.readFileSync( "./key.json" , "utf-8");
global.KEYS = JSON.parse(data);
global.index = global.KEYS.index -1;
global.key = global.KEYS.key[global.index];
if(!global.key){
    console.log('If you wanna do something.  Please give us your KEY!'.red);
    return;
}else{
    console.log("Get keys.".green);
}

console.log("Start do preparation work.");
file.deleteFolder("backup");
fs.mkdir("backup");
file.copy('source', 'backup');
var files = file.readDir("source", "r");
// console.log(files);
console.log("Done preparation work.".green);

tinify.compressAllFiles(files, 'source');
