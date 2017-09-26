var compress = require("./compress.js");
var fs = require("fs");

var srcSize = 0;
var desSize = 0;
var allCompressFilesMap=[];
var srcPath = '';

// 遍历用户压缩的文件对象
function filesTraverse(files, path){
    var  result = {
        "size": 0,
        "counter": 0
    }
    files.forEach(function(file,index){
        if(typeof file == 'object'){
            var data = filesTraverse(file.files, path+'/'+file.path);
            result.size += data.size;
            result.counter += data.counter;
        }else{
            result.counter++;
            var statInfo = fs.lstatSync(path+'/'+file);
            result.size += statInfo.size;
        }
    });
    return result;
}

// 删除用户过滤的文件
function deleteFile(file){
    if(global.COMPRESS.undoDelete){
        // 删除用户过滤的文件
        console.log("delete:"+file);
        fs.unlinkSync(file);
    }
}

function getFileName(file){
    var fileArr = file.split(".");
    var result = {
        "name":'',
        "type":''
    }
    for(var i = 0; i < fileArr.length-1; i++){
        result.name += (fileArr[i]+'.')
    }
    result.name.substr(0,result.name.length-1);
    result.type = fileArr[fileArr.length-1];
    return result;
}

function compressFilesInfo(files, path){
    var info = {
        "counter": 0,   //文件数量
        "size": 0,   //文件大小
        "allFiles":[],  //所有需要压缩的文件
    };
    var allFiles = files;

    function filesFilter(files, path){
        for(var i=files.length-1;i>=0;i--){
            if(typeof files[i] != 'object'){
                var fileName = getFileName(files[i]);
                var type = fileName.type.toLowerCase();
                // 仅对图片进行处理png, jpeg, jpg
                if(type == 'png'||type == 'jpg'||type == 'jpeg'){
                    files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                    files.splice(index,1);
                }
                // 过滤掉用户指定的文件名称
                if(fileName.name == global.COMPRESS.undoFileName){
                    files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                    files.splice(index,1);
                }
                // 过滤掉用户指定的文件类型
                if(type == global.COMPRESS.undoFileType.toLowerCase()){
                    files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                    files.splice(index,1);
                }
            }else{
                filesFilter(files[i].files, path+'/'+files[i].path);
            }
        }
    }

    function filesMap(files, path){
        files.forEach(function(file,index){
            if(typeof file == 'object'){
                filesMap(file.files, path+'/'+file.path);
            }else{
                var fileName = getFileName(file);
                info.allFiles.push(path+'/'+file);
            }
        });
    }

    // 筛选要压缩的文件
    filesFilter(allFiles, path);
    // 计算即将压缩的文件数量及大小
    var fileData = filesTraverse(allFiles, path);
    // 获取压缩的文件对列信息
    filesMap(allFiles, path);

    info.size = fileData.size;
    info.counter = fileData.counter;
    // info.allFiles = allFiles;
    return info;
}

function compressAllFiles(files, path){
    srcPath = path;
    var info = compressFilesInfo(files, path);
    srcSize = info.size;
    global.tinifyCounter = info.counter;
    allCompressFilesMap = info.allFiles;

    // console.log(allCompressFilesMap);
    compress.tinifyCompress(allCompressFilesMap);
}

global.eventCompress.on("FinishAll",function(){
    allCompressFilesMap.forEach(function(element, index) {
		var fs = require('fs');
		desSize += fs.lstatSync(element).size;
	});

    var msg = 'before:'+(srcSize/1024).toFixed(2)+'KB, after:'+(desSize/1024).toFixed(2)+'KB, compressed:'+((1-desSize/srcSize)*100).toFixed(1)+'%';
    console.log(msg.green);
})

exports.compressAllFiles = compressAllFiles;