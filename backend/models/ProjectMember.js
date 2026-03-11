// 项目成员关联表 - 记录用户加入的项目
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define('ProjectMember', {
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  userId:    { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

module.exports = ProjectMember;
