// 导入数据库操作模块
const db = require("../db/index");

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
  console.log("req.body", req.body); // 文本类型的数据
  console.log("--------分割线----------");
  console.log("req.file", req.file); // 文本类型的胡数据

  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("文章封面是必选参数");
  // 导入处理路径的path 核心模块
  const path = require("path");

  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join("/uploads", req.file.fieldname),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  };

  // 定义发布文章的 sql 语句
  const sql = "insert into ev_articles set ?";

  db.query(sql, articleInfo, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err);
    // 执行 sql 语句成功，但影响行数不为 1
    if (results.affectedRows !== 1) return res.cc("发布文章失败！");

    // 发布文章成功
    res.cc("发布文章成功", 0);
  });
};
