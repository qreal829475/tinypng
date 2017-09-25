var tinify = require("tinify");
var fs = require("fs");

var count = 0;
var successcounter = 0;
var failedcounter = 0;

var srcSize = 0;
var desSize = 0;


function tinifyCompress(files, path) {
    files.forEach(function(file,index){
        if(typeof file == 'object'){
            tinifyCompress(file.files, path+'/'+file.path);
        }else{
            if(!!path) srcFile  = path + "/" + file;
            // console.log('filePath:'+srcFile);
            fs.readFile(srcFile, function(err, sourceData) {
                if (err) console.log("readFile failed. -> "+srcFile);

                tinify.key = global.key;            
                tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                    if (err instanceof tinify.ConnectionError || err instanceof tinify.ServerError){
                        console.log('compress failed ->'+srcFile+', recompress.');

                        return;
                    }
                    else if(err instanceof tinify.ClientError || err instanceof tinify.AccountError){
                        if (err.message.indexOf('Your monthly limit has been exceeded') >= 0){
                            /*该账户数目超过，换下一个key重试*/
                            //查看是否还有可用的账户
                            console.log("key:"+global.key+"       monthly limit has been exceeded".red);
                            
                            global.index++;
                            if(global.index < global.KEYS.key.length){
                                global.key = global.KEYS.key[global.index];
                            }else{
                                console.log('no valide account.');
                                process.exit();
                            }
                        }

                        counter(1);
                        return;
                    }
            
                    // console.log(tinify.compressionCount);
                    fs.writeFileSync(srcFile, resultData);
                    counter(0);
                });
            });
        }
    });
}

function counter(type){
    switch(type){
		case 0:
			successcounter++;
			break;
		case 1:
			failedcounter++;
			break;
		default:
			break;
	}
    
    if((successcounter + failedcounter) == count){
        console.log('all files has conpress.'.green);
    }

}

function compressFilesInfo(files, path){
    var info = {
        "counter": 0,   //文件数量
        "srcSize": 0    //文件大小
    };
    var allFiles = files;

    function filesTraverse(allFiles, path){
        allFiles.forEach(function(file,index){
            if(typeof file == 'object'){
                filesTraverse(file.files, path+'/'+file.path);
            }else{
                info.counter++;
                var statInfo = fs.lstatSync(path+'/'+file);
                info.srcSize += statInfo.size;
            }
        });
    }

    function filesFilter(allFiles){
        allFiles.forEach(function(file,index){
            if(typeof file == 'object'){
                filesCount(file.files, path+'/'+file.path);
            }else{
            }
        });
    }

    // 筛选要压缩的文件
    filesFilter(allFiles);
    // 计算即将压缩的文件数量及大小
    filesTraverse(allFiles, path);
    
    return info;
}

function compressAllFiles(files, path){
    var info = compressFilesInfo(files, path);
    srcSize = info.srcSize;

    tinifyCompress(files, path);


}

exports.compressAllFiles = compressAllFiles;