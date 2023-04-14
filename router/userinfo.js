// 导入 express
const express = require("express");

// 导入验证数据合法性的中间件
const expressJoi = require("@escook/express-joi");

// 导入需要的验证规则对象
const { update_userinfo_schema } = require("../schems/user");

// 创建路由对象
const router = express.Router();

// 导入用户信息的处理函数模块
const userinfo_handler = require("../router_handler/userinfo");

// 获取用户的基本信息，让 userinfo_handler.getUserInfo 方法来处理用户信息
router.get("/userinfo", userinfo_handler.getUserInfo);

// 更新用户的基本信息
router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  userinfo_handler.updateUserInfo
);

// 向外共享路由对象
module.exports = router;
