// 活动数据模型 - 存储俱乐部组织的各类活动
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 活动标题 - 必填
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // 活动描述 - 必填
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // 活动地点
  location: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  // 活动开始时间 - 必填
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // 活动结束时间 - 必填
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // 最大参与人数 - 0 表示无限制
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // 活动状态：即将进行、进行中、已完成
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
    defaultValue: 'upcoming',
  },
  // 活动创建者 ID
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt
});

module.exports = Activity;
