// 数据库配置文件 - 使用 Sequelize ORM 管理 SQLite 数据库
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config(); // 加载环境变量

// 创建 Sequelize 实例，配置 SQLite 数据库
const sequelize = new Sequelize({
  dialect: 'sqlite', // 使用 SQLite 作为数据库引擎
  storage: path.join(__dirname, '..', 'club.db'), // 数据库文件路径
  logging: false, // 禁用 SQL 日志输出
});

// 导出数据库连接实例供其他模块使用
module.exports = sequelize;
