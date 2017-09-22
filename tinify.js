var tinify = require("tinify");
var fs = require("fs");

function tinifyCompress(files, path) {
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
                tinify.key = global.key;
                // tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                //     if (err) throw err;
                //     // ...
                // });
            });
            console.log(file);
        }
    });
}

// console.log("compressionCount:"+ tinify.compressionCount);