// 投票数据模型 - 包含投票、投票选项和用户投票记录
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ==================== 投票表 ====================
const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 投票标题 - 必填
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // 投票描述
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  // 投票截止时间 - 必填
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // 投票是否活跃
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // 投票创建者 ID
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// ==================== 投票选项表 ====================
const VoteOption = sequelize.define('VoteOption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 投票 ID - 外键关联 Vote 表
  voteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 关联项目 ID（可选，用于项目相关投票）
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // 选项文本内容 - 必填
  optionText: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // 该选项的投票数
  voteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// ==================== 用户投票记录表 ====================
const UserVote = sequelize.define('UserVote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 投票 ID - 外键关联 Vote 表
  voteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 选项 ID - 外键关联 VoteOption 表
  optionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 用户 ID - 外键关联 User 表
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// 导出所有投票相关模型
module.exports = { Vote, VoteOption, UserVote };
