-- 查询users表里所有的数据
 SELECT * FROM my_db_01.ev_users;

-- 查询users表里所有的username,password两列的数据
-- SELECT username,password FROM musersy_db_01.users;
 
-- users表里新增用户名和密码为tony stark和098123
-- INSERT INTO users(username,password) values ('tony stark','098123')

-- users表里设置 id=3 的数据的密码为 888888
-- update users set password='888888' where id=3

-- 更新users表中，id为2的数据，密码为888888，状态为1
-- UPDATE users SET password=888888,status=1 where id=2

-- 删除 users 表中，id为3的这条数据
-- delete from users where id=3

-- 使用AND显示所有状态为1，并且id<3的数据
-- select * from users where status=1 AND id<3

-- 使用OR 显示username为zs 或者status 为1
-- select * from users where status=1 OR username='zs'

-- 对users表中的数据，安装status字段进行升序降序, DESC 是降序 ASC 是升序 ， 默认是升序
-- select * from users ORDER BY status
-- select * from users ORDER BY status DESC

-- 对users表中的数据，先id升序，在安招status降序
-- select * from users order by id ASC,status DESC

-- 统计users表中 状态为0 用户的总数量
-- select count(*) from users where status=0

-- 使用 AS关键字给列起别名
-- select count(*) as total from users where status=0
