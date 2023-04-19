// 导入 express
const express = require("express");

// 创建路由对象
const router = express.Router();

// 导入解析 formdata 格式表单数据的包
const multer = require("multer");
// 导入处理路径的核心模块
const path = require("path");

// 创建 multer 的实力对象，通过dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入文章的验证模块
const { add_article_schema } = require("../schems/article");

// 导入文章的路由处理函数模块
const artice_handler = require("../router_handler/article");

// 发布新文章的路由
// upload.single()是一个局部生效的中间件，用来解析 FormData 合适的表单数据
// 将文件类型的数据，解析并挂载到req.file 属性中
// 将文本类型的数据，解析并挂载到req.body 属性中
router.post(
  "/add",
  upload.single("cover_img"),
  expressJoi(add_article_schema),
  artice_handler.addArticle
);

// 向外共享路由对象
module.exports = router;
