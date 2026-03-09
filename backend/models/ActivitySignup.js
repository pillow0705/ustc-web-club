// 活动报名表 - 存储用户与活动的多对多关系（中间表）
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivitySignup = sequelize.define('ActivitySignup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 活动 ID - 外键关联 Activity 表
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // 用户 ID - 外键关联 User 表
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // 记录报名时间
});

module.exports = ActivitySignup;
