const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivitySignup = sequelize.define('ActivitySignup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = ActivitySignup;
