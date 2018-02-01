var compress = require("./compress.js");
var fileOperation = require('./file.js');
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
        debugger;
        if(typeof file == 'object'){
            debugger;
            var data = filesTraverse(file.files, path+'/'+file.path);
            result.size += data.size;
            result.counter += data.counter;
        }else{
            debugger;
            result.counter++;
            var statInfo = fs.lstatSync(path+'/'+file);
            result.size += statInfo.size;
        }
    });
    return result;
}

// 删除用户过滤的文件
function deleteFile(filePath){
    if(global.COMPRESS.undoDelete){
        // 删除用户过滤的文件
        console.log("delete:"+filePath);
        fs.unlinkSync(filePath);
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
                if(type!='png'&&type!='jpg'&&type!='jpeg'){
                    files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                    files.splice(i,1);
                }
                // 过滤掉用户指定的文件名称
                if(!!global.COMPRESS.undoFileName){
                    if(fileName.name == global.COMPRESS.undoFileName){
                        files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                        files.splice(i,1);
                    }
                }
                // 过滤掉用户指定的文件类型
                if(!!global.COMPRESS.undoFileType){
                    if(type == global.COMPRESS.undoFileType.toLowerCase()){
                        files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                        files.splice(i,1);
                    }
                }
                // 过滤掉用户指定的文件全称
                if(!!global.COMPRESS.undoFile){
                    if(files[i] == global.COMPRESS.undoFile){
                        files[i].path? deleteFile(path+'/'+files[i].path+'/'+files[i]) : deleteFile(path+'/'+files[i]);
                        files.splice(i,1);
                    }
                }
            }else{
                if(files[i].path == global.COMPRESS.undoFolder){
                    var deletePath = '';
                    files[i].path? deletePath=path+'/'+files[i].path : deletePath=path;
                    if(global.COMPRESS.undoDelete){
                        fileOperation.deleteFolderSync(deletePath);
                    }
                    files.splice(i,1);
                }else{
                    filesFilter(files[i].files, path+'/'+files[i].path);
                }
            }
        }
    }

    function filesMap(files, path){
        files.forEach(function(element,index){
            if(typeof element == 'object'){
                filesMap(element.files, path+'/'+element.path);
            }else{
                var fileName = getFileName(element);
                info.allFiles.push(path+'/'+element);
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
    debugger;
    srcPath = path;
    var info = compressFilesInfo(files, path);
    srcSize = info.size;
    global.tinifyCounter = info.counter;
    allCompressFilesMap = info.allFiles;

    // console.log(allCompressFilesMap);
    if(!(allCompressFilesMap.length>0)){
        console.log("It's nothing in folder('source'). End of operation.".red);
    }
    compress.tinifyCompress(allCompressFilesMap);
}

global.eventCompress.on("FinishAll",function(){
    allCompressFilesMap.forEach(function(element, index) {
        var fs = require('fs');
        var desFile = '';
        if(global.sourceFilder != global.outputFilder){
            desFile = element.substring(global.sourceFilder.length);
            desFile = global.outputFilder + desFile;
        }else{
            desFile = element;
        }
		desSize += fs.lstatSync(desFile).size;
	});

    var msg = 'before:'+(srcSize/1024).toFixed(2)+'KB, after:'+(desSize/1024).toFixed(2)+'KB, compressed:'+((1-desSize/srcSize)*100).toFixed(1)+'%';
    console.log(msg.green);
})

exports.compressAllFiles = compressAllFiles;