// 导入 express 模块
const express = require("express");

// 创建 express 的服务示例
const app = express();

// 导入 cors 中间件
const cors = require("cors");
// 将 cors 注册为全局中间件
app.use(cors());

// 导入并注册用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);

// 配置解析表单数据的中间件 解析 applocation/x-www/form-urlencoded
app.use(express.urlencoded({ extened: false }));

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log("api server running at http://127.0.0.1:3007");
});
