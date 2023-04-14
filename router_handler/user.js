/**
 *
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 *
 */

// 导入数据库操作模块
const db = require("../db/index");

// 定义 sql 语句
const sql = "select * from ev_users where username=?";

// 定义插入用户 sql 语句
const sqlInsert = "insert into ev_users set ?";

// 导入 bcrypt.js 对用户密码进行加密
const bcrypt = require("bcryptjs");

// 这个包用来生成 Token 字符串
const jwt = require("jsonwebtoken");

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接受表单数据
  const userinfo = req.body;

  // 判断数据是否合法
  if (!userinfo.username || !userinfo.password) {
    return res.send({ status: 1, message: "用户名或密码不能为空！" });
  }
  // 执行 sql 语句并根据结果判断用户名是否被占用
  db.query(sql, [userinfo.username], function (err, results) {
    // 执行 sql 语句失败
    if (err) {
      return res.send({
        status: 2,
        message: err.message,
      });
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.send({ status: 1, message: "用户名被占用，请更换其他用户名" });
    }

    // 调用 ncrypt.hashSync 方法，对用户的密码进行加密处理
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    // 调用db.query() 执行 sql 语句，插入新用户
    db.query(
      sqlInsert,
      {
        username: userinfo.username,
        password: userinfo.password,
      },
      (err, results) => {
        // 执行 sql 语句失败
        if (err) return res.send({ status: 1, message: err.message });
        // sql 语句执行成功，但影响行数不为1
        if (results.affectedRows !== 1) {
          return res.send({ status: 1, message: "注册用户失败，请稍后重试！" });
        }
        // 注册成功
        res.send({ status: 0, message: "注册成功！" });
      }
    );
  });
  // res.send("reguser OK");
};

// 登录的处理函数
exports.login = (req, res) => {
  // 接受表单的数据
  const userinfo = req.body;

  // 执行 sql 语句 查询用户的数据
  db.query(sql, userinfo.username, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err);
    // 执行 sql 语句成功，但是查询到数据条数不等于1
    if (results.length !== 1) return res.cc("登录失败！");

    // 拿着用户输入的密码，和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );

    // 如果对比的结果等于 false，则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc("登录失败！");
    }

    const user = { ...results[0], password: "", user_pic: "" };

    // 导入配置文件
    const config = require("../config");

    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: "10h", // token 有效期为 10 个小时
    });

    // 将生成的 Token 字符串响应给客户端

    res.send({
      status: 0,
      message: "登录成功！",
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: "Bearer " + tokenStr,
    });
  });
  // res.send("login OK");
};
