# tinypng
基于tinify的nodeJs小程序。

用于图片压缩。

说明：只能对jpg和png图片进行压缩。图片文件格式：png/jpg/jpeg

#配置说明

将key API放置在key.json中。

{

    "key": [],      //存放你的key API，  string
    
    "index": 1      //默认从第几个开始读取key， int
    
}

将压缩配置参数放在compress.json中。

{

    "undoFile": "",            // 不压缩的文件全名   eg:1.jpg
    
    "undoFileName": "",        // 不压缩的文件名称，不限制类型  eg:demo
    
    "undoFileType": "",        // 不压缩的文件类型     eg:jpg
    
    "undoFolder": "",          // 不压缩的文件夹(所有文件加名为配置参数的)   eg: _demo
    
    "undoDelete": false        // 是否删除掉不压缩的文件(Boolean)，值只能为true或者false
    
}

