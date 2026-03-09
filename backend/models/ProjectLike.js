// 项目点赞表 - 存储用户与项目的多对多关系（中间表）
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectLike = sequelize.define('ProjectLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 项目 ID - 外键关联 Project 表
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 用户 ID - 外键关联 User 表
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // 记录点赞时间
});

module.exports = ProjectLike;
