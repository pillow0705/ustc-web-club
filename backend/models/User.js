// 用户数据模型
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // 用于密码加密

// 定义 User 表结构
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // 用户名 - 唯一、必填
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  // 邮箱 - 必须是科大邮箱、唯一、必填
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      // 自定义验证：只允许科大邮箱
      isUstcEmail(value) {
        if (!value.endsWith('@mail.ustc.edu.cn')) {
          throw new Error('必须使用科大邮箱 (@mail.ustc.edu.cn) 注册');
        }
      },
    },
  },
  // 密码 - 加密存储、必填
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // 角色 - 普通成员或管理员
  role: {
    type: DataTypes.ENUM('member', 'admin'),
    defaultValue: 'member',
  },
  // 个人资料
  avatar: {
    type: DataTypes.STRING(255),
    defaultValue: '', // 头像 URL
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: '', // 个人简介
  },
  techStack: {
    type: DataTypes.STRING(500),
    defaultValue: '', // 技术栈
  },
  githubLink: {
    type: DataTypes.STRING(255),
    defaultValue: '', // GitHub 链接
  },
  // 统计数据
  contributionPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // 贡献点数
  },
  participationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // 参与活动计数
  },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  hooks: {
    // 创建用户前，对密码进行 bcrypt 加密（盐轮数为 10）
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

// 实例方法：验证密码是否匹配
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// 导出 User 模型
module.exports = User;
