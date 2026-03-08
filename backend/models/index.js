const sequelize = require('../config/database');
const User = require('./User');
const Activity = require('./Activity');
const ActivitySignup = require('./ActivitySignup');
const Project = require('./Project');
const ProjectLike = require('./ProjectLike');
const { Vote, VoteOption, UserVote } = require('./Vote');

// User <-> Activity
User.hasMany(Activity, { foreignKey: 'creatorId', as: 'createdActivities' });
Activity.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Activity <-> User (signups)
Activity.belongsToMany(User, { through: ActivitySignup, foreignKey: 'activityId', as: 'participants' });
User.belongsToMany(Activity, { through: ActivitySignup, foreignKey: 'userId', as: 'joinedActivities' });

// User <-> Project
User.hasMany(Project, { foreignKey: 'creatorId', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Project <-> User (likes)
Project.belongsToMany(User, { through: ProjectLike, foreignKey: 'projectId', as: 'likedBy' });
User.belongsToMany(Project, { through: ProjectLike, foreignKey: 'userId', as: 'likedProjects' });

// Vote associations
User.hasMany(Vote, { foreignKey: 'creatorId' });
Vote.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Vote.hasMany(VoteOption, { foreignKey: 'voteId', as: 'options' });
VoteOption.belongsTo(Vote, { foreignKey: 'voteId' });
VoteOption.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
VoteOption.hasMany(UserVote, { foreignKey: 'optionId' });
UserVote.belongsTo(VoteOption, { foreignKey: 'optionId' });

module.exports = {
  sequelize,
  User,
  Activity,
  ActivitySignup,
  Project,
  ProjectLike,
  Vote,
  VoteOption,
  UserVote,
};
