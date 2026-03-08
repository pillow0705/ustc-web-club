const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      isUstcEmail(value) {
        if (!value.endsWith('@mail.ustc.edu.cn')) {
          throw new Error('必须使用科大邮箱 (@mail.ustc.edu.cn) 注册');
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('member', 'admin'),
    defaultValue: 'member',
  },
  avatar: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  techStack: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  githubLink: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  contributionPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  participationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
