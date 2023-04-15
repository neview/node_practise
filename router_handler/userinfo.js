// 导入数据库操作模块
const db = require("../db/index");

// 根据用户的 id，查询用户的基本信息
// 注意：为了防止用户的密码泄露，需要排除 password 字段
const sql =
  "select id,username,nickname,email,user_pic from ev_users where id=?";

// 根据用户的 id 更新用户的基本信息
const updateSql = "update ev_users set ? where id=?";

// 定义根据 id 查询用户数据的 sql 语句
const resetSql = "select * from ev_users where id=?";

// 根据用户的 id 更新用户的密码
const updatePwdSql = "update ev_users set password=? where id=?";

// 根据用户的 id 更新用户头像的 sql 语句
const updateAvatarSql = "update ev_users set user_pic=? where id=?";

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 注意：req 对象上的 user 属性。是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(resetSql, req.user.id, (err, results) => {
    // 1、执行 sql 语句失败
    if (err) return res.cc(err);

    // 2、执行 sql 语句成功，但是查询到的数据条数不等于 1
    if (results.length !== 1) return res.cc("获取用户信息失败！");

    // 3、将用户信息响应给客户端
    res.send({
      status: 0,
      message: "获取用户基本信息成功！",
      data: results[0],
    });
  });
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  db.query(updateSql, [req.body, req.user.id], (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err);

    // 执行 sql 语句成功，但影响行数不为1
    if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败！");

    // 修改用户信息成功
    return res.cc("修改用户基本信息成功！", 0);
  });
};

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
  db.query(resetSql, req.user.id, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err);

    // 检查指定 id 的用户是否存在
    if (results.length !== 1) return res.cc("用户不存在！");

    // 在头部区域导入 bcrtptjs 后
    // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
    // comparSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
    const bcrypt = require("bcryptjs");

    // 判断提交的密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("原始密码错误！");

    // 走到这代表密码符合验证规则

    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    console.log("newPwd", newPwd);
    db.query(updatePwdSql, [newPwd, req.user.id], (err, results) => {
      // sql 语句执行失败
      if (err) return res.cc(err);
      console.log("results", results);

      // sql 语句执行成功，但是影响行数不等于 1
      if (results.length !== 1) return res.send("更新密码失败！");

      // 更新密码成功
      res.cc("更新密码成功！", 0);
    });
  });
};

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  db.query(updateAvatarSql, [req.body.avatar, req.user.id], (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err);

    // 执行 sql 成功，但影响行数不等于 1
    if (results.length !== 1) return res.cc("更新头像失败！");

    // 更新头像成功
    return res.send("更新头像成功！", 0);
  });
};
