# tinypng
基于tinify的nodeJs小程序。

用于图片压缩。

说明：只能对jpg和png图片进行压缩。图片文件格式：png/jpg/jpeg


# 关于[TinyPNG](https://tinypng.com)

	Smart PNG and JPEG compression

	Optimize your images with a perfect balance in quality and file size.

如果你想进一步了解TinyPNG压缩图片请移步官网[TinyPNG](https://tinypng.com)查看。


![tinypngPanda](http://7xox5k.com1.z0.glb.clouddn.com/tinypngPanda.png)


# 使用

1. 安装NodeJS环境（不懂的请百度）；
2. 将即将压缩的文件放在source文件夹中，压缩成功后会保留在当前文件路径。压缩成功后源文件将备份在backup文件夹中；
3. 修改配置文件：
	* 申请API KEY，填写到key.json中 ；
	* 将压缩参数填写到compress.json；
4. 启动执行压缩：
	* cd到工程目录
	* node build或者执行start.bat，具体的参数参考下面的使用方法。



# 配置说明

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


# 申请TinyPNG的KEY
https://tinypng.com/developers/subscription

![getapikey](http://7xox5k.com1.z0.glb.clouddn.com/tinypnggetapikey.png)


# 使用方法
方法1. 在终端的该工程目录下输入node build即可，如果需要指定资源路径或者输出路径时，需要增加参数

	资源路径： from-xxx(指定文件夹)
	结果输出路径： to-xxx(指定文件夹)
	ps:文件夹不要跨磁盘，否则系统容易报错：需要管理员权限

方法2. 双击start.bat文件，自动使用到默认默认


# 测试

目前windows测试可用
