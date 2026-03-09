// 数据库模型和关联配置
// 定义所有数据表及其之间的关系
const sequelize = require('../config/database');
const User = require('./User');
const Activity = require('./Activity');
const ActivitySignup = require('./ActivitySignup');
const Project = require('./Project');
const ProjectLike = require('./ProjectLike');
const Comment = require('./Comment');

// ==================== 模型关联定义 ====================

// 用户-活动关系：一个用户可以创建多个活动
User.hasMany(Activity, { foreignKey: 'creatorId', as: 'createdActivities' });
Activity.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// 活动-用户关系：多对多（用户参加活动）
Activity.belongsToMany(User, { through: ActivitySignup, foreignKey: 'activityId', as: 'participants' });
User.belongsToMany(Activity, { through: ActivitySignup, foreignKey: 'userId', as: 'joinedActivities' });

// 用户-项目关系：一个用户可以创建多个项目
User.hasMany(Project, { foreignKey: 'creatorId', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// 项目-用户关系：多对多（用户点赞项目）
Project.belongsToMany(User, { through: ProjectLike, foreignKey: 'projectId', as: 'likedBy' });
User.belongsToMany(Project, { through: ProjectLike, foreignKey: 'userId', as: 'likedProjects' });

// 项目-评论关系
Project.hasMany(Comment, { foreignKey: 'projectId', as: 'comments' });
Comment.belongsTo(Project, { foreignKey: 'projectId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Comment, { foreignKey: 'userId' });

// ==================== 导出所有模型和数据库连接 ====================
module.exports = {
  sequelize,
  User,
  Activity,
  ActivitySignup,
  Project,
  ProjectLike,
  Comment,
};
