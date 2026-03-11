// 数据库模型和关联配置
const sequelize = require('../config/database');
const User = require('./User');
const Activity = require('./Activity');
const ActivitySignup = require('./ActivitySignup');
const Project = require('./Project');
const ProjectLike = require('./ProjectLike');
const ProjectMember = require('./ProjectMember');
const Comment = require('./Comment');
const Follow = require('./Follow');
const Message = require('./Message');

// ==================== 模型关联定义 ====================

// 用户-活动：一对多（创建者）
User.hasMany(Activity, { foreignKey: 'creatorId', as: 'createdActivities' });
Activity.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// 活动-用户：多对多（报名参加）
Activity.belongsToMany(User, { through: ActivitySignup, foreignKey: 'activityId', as: 'participants' });
User.belongsToMany(Activity, { through: ActivitySignup, foreignKey: 'userId', as: 'joinedActivities' });

// 用户-项目：一对多（创建者）
User.hasMany(Project, { foreignKey: 'creatorId', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// 项目-用户：多对多（点赞）
Project.belongsToMany(User, { through: ProjectLike, foreignKey: 'projectId', as: 'likedBy' });
User.belongsToMany(Project, { through: ProjectLike, foreignKey: 'userId', as: 'likedProjects' });

// 项目-用户：多对多（加入成员）
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', as: 'joinedProjects' });

// 项目-评论
Project.hasMany(Comment, { foreignKey: 'projectId', as: 'comments' });
Comment.belongsTo(Project, { foreignKey: 'projectId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'userId' });

// 用户-关注：多对多（自关联）
User.belongsToMany(User, { through: Follow, foreignKey: 'followerId', otherKey: 'followingId', as: 'following' });
User.belongsToMany(User, { through: Follow, foreignKey: 'followingId', otherKey: 'followerId', as: 'followers' });

// 消息关联
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// ==================== 导出所有模型 ====================
module.exports = {
  sequelize,
  User,
  Activity,
  ActivitySignup,
  Project,
  ProjectLike,
  ProjectMember,
  Comment,
  Follow,
  Message,
};
