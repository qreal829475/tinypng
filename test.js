const tinify = require("tinify");
tinify.key = "IjqA2OiiCvagv3PMWDISZtCznthd7VRi";
// tinify.key = "FEHxz-jingj3jm5EsYNZdBdrn_ZLbK_4";

tinify.fromFile("./target/abc.jpg").toFile("./target/optimized.jpg");

// tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
//     if (err) throw err;
//     // ...
// });