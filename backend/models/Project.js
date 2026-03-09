// 项目数据模型 - 存储俱乐部成员发起的项目信息
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 项目标题 - 必填
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // 项目描述 - 必填
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // 项目难度：初级、中级、高级
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'intermediate',
  },
  // 项目所需技术栈
  techStack: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  // 项目所需人数
  requiredMembers: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  // 项目获赞数
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // 项目状态：开放、进行中、已完成
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed'),
    defaultValue: 'open',
  },
  // 项目创建者 ID
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt
});

module.exports = Project;
