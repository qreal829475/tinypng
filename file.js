
var fs = require("fs");
var colors = require('colors');
var stat=fs.stat;

// 删除文件夹
var deleteFolder = function(path) {
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

/*
* 读取文件夹 
* 
* 返回文件夹内容信息：文件名和文件夹名
* type :    为空    表示返回的文件地址为绝对地址
*           "r"     表示返回的文件地址为相对地址
*/
var readDir = function(path, type){
    var files = [];

    function read(path){
        if( fs.existsSync(path) ) {
            var allFile = fs.readdirSync(path);
            allFile.forEach(function(file,index){
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) {
                    allFile[index] = {
                        path: type == 'r'? file:curPath,
                        files: readDir(curPath, allFile[index])
                    };
                } else {
                }
            });
            return allFile;
        }else{
            console.log("There doesn't have the folder ----- '"+path+"'.".red);
            return;
        }
    }
    
    files = read(path);
    return files;
}

// 复制文件夹到对应目录
var copy = function(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function(err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function(path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat(_src, function(err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
    fs.exists(dst, function(exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function() {
                callback(src, dst);
            });
        }
    });
};

exports.copy = copy;
exports.deleteFolder = deleteFolder;
exports.readDir = readDir;