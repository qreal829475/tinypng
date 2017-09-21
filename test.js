const tinify = require("tinify");
tinify.key = "IjqA2OiiCvagv3PMWDISZtCznthd7VRi";
// tinify.key = "FEHxz-jingj3jm5EsYNZdBdrn_ZLbK_4";

tinify.fromFile("abc.jpg").toFile("optimized.jpg");