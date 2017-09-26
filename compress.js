var tinify = require("tinify");
var fs = require("fs");
var events = require("events");

var successcounter = 0;
var failedcounter = 0;

global.eventCompress = new events.EventEmitter();

function tinifyCompress(files) {
    files.forEach(function(file,index){
        // if(typeof file == 'object'){
        //     tinifyCompress(file.files, path+'/'+file.path);
        // }else{
            // if(!!path) srcFile  = path + "/" + file;
            // console.log('filePath:'+srcFile);
        fs.readFile(file, function(err, sourceData) {
            if (err) console.log("readFile failed. -> "+file);

            tinify.key = global.key;            
            tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                if (err instanceof tinify.ConnectionError || err instanceof tinify.ServerError){
                    console.log('compress failed ->'+file+', recompress.');
                    // throw err;
                    tinifyCompress(file);
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
                            console.log("use the "+global.index+1+"th account key.".yellow);
                            tinifyCompress(file);
                        }else{
                            console.log('no valide account.');
                            process.exit();
                        }
                        return;
                    }

                    console.log('comressed failed:'+file);
                    counter(1);
                    return;
                }
        
                // console.log(tinify.compressionCount);
                // console.log('filePath:'+file);
                fs.writeFileSync(file, resultData);
                counter(0);
            });
        });
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