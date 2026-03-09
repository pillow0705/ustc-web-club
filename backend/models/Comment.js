// 项目评论模型
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // 评论内容
  content: { type: DataTypes.TEXT, allowNull: false },
  // 所属项目
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  // 评论作者
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Comment;
