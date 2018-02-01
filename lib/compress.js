var tinify = require("tinify");
var fs = require("fs");
var events = require("events");
var async = require("async");
var queue = require("async/queue");

var successcounter = 0;
var failedcounter = 0;

var failFile = {};

global.eventCompress = new events.EventEmitter();

var q = async.queue(function(task, callback) {
    // console.log('task_name: ' + task.name);
    fs.readFile(task.file, function(err, sourceData) {
        if (err) console.log("readFile failed. -> "+task.file);

        tinify.key = global.key;
        tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
            if (err instanceof tinify.ConnectionError || err instanceof tinify.ServerError){
                // throw err;
                //同一个文件压缩失败3次以上就不再进入压缩队列了
                var theReArray = [task.file];
                if(!!failFile[task.file]){
                    failFile[task.file]++;
                    if(failFile[task.file] < 4){
                        tinifyCompress(theReArray);
                        console.log('compress failed ->'+task.file+', recompress.');
                    }else{
                        console.log('compress failed ->'+task.file+', failed 3 times, uncompress.');
                    }
                }else{
                    failFile[task.file] = 1;
                    tinifyCompress(theReArray);
                    console.log('compress failed ->'+task.file+', recompress.');
                }
                return;
            }else if(err instanceof tinify.ClientError || err instanceof tinify.AccountError){
                if (err.message.indexOf('Your monthly limit has been exceeded') >= 0){
                    /*该账户数目超过，换下一个key重试*/
                    //查看是否还有可用的账户
                    console.log("key:"+global.key+" -->  "+"monthly limit has been exceeded".red);
                    
                    global.index++;
                    if(global.index < global.KEYS.key.length){
                        global.key = global.KEYS.key[global.index];
                        console.log("use the ".yellow+Number(global.index+1)+"th account key.".yellow);
                        var theReArray = [task.file];
                        tinifyCompress(theReArray);
                    }else{
                        console.log('no valide account.'.red);
                        console.log('exit'.red);
                        process.exit();
                    }
                    return;
                }

                console.log('compressed failed:'+task.file);
                counter(1);
                return;
            }
    
            // console.log(tinify.compressionCount);
            // console.log('filePath:'+file);
            if(!!resultData){
                if(global.sourceFilder != global.outputFilder){
                    var theOutputPath = task.file.substring(global.sourceFilder.length);
                    theOutputPath = global.outputFilder + theOutputPath;
                    fs.writeFileSync(theOutputPath, resultData);
                }else{
                    fs.writeFileSync(task.file, resultData);
                }
                // console.log('run:'.green + task.file);
                counter(0);
            }else if(!!err){
                console.log(err);
            }
            callback();            
        });
    });
    // callback('error', 'arg');
}, 20);

// 当所有任务都执行完以后，将调用该函数
q.drain = function() {
    console.log('all tasks have been processed'.red);
}

function tinifyCompress(files) {
    files.forEach(function(file,index){
        // if(typeof file == 'object'){
        //     tinifyCompress(file.files, path+'/'+file.path);
        // }else{
            // if(!!path) srcFile  = path + "/" + file;
            // console.log('filePath:'+srcFile);
            // tinifyFile(file);
            q.push({
                name: file,
                file: file
              },function() {
            });
            // console.log("task.length: " + q.length());
        // }
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
    
    if((successcounter + failedcounter) == global.tinifyCounter){
        global.eventCompress.emit('FinishAll');
        var result = "result：  success:"+successcounter+"/"+global.tinifyCounter+"        failed:"+failedcounter+"/"+global.tinifyCounter;
        if(failedcounter>0){
            console.log(result.red);
        }else{
            console.log(result.green);
        }
    }
}

exports.tinifyCompress = tinifyCompress;