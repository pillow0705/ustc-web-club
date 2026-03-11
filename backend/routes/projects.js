// 项目管理路由
const express = require('express');
const { Project, ProjectLike, ProjectMember, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// 公共 include：获取项目时附带创建者和成员信息
const projectIncludes = [
  { model: User, as: 'creator', attributes: ['id', 'username', 'avatar'] },
  { model: User, as: 'members', attributes: ['id', 'username', 'avatar'], through: { attributes: [] } },
];

// ==================== 获取项目列表 ====================
router.get('/', async (req, res) => {
  try {
    const { difficulty, techStack, status } = req.query;
    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    if (techStack) where.techStack = { [Op.like]: `%${techStack}%` };

    const projects = await Project.findAll({
      where,
      include: projectIncludes,
      order: [['likes', 'DESC'], ['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取单个项目详情 ====================
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, { include: projectIncludes });
    if (!project) return res.status(404).json({ message: '项目不存在' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 创建新项目 ====================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, techStack, requiredMembers, githubLink } = req.body;
    const project = await Project.create({
      title, description, difficulty, techStack, requiredMembers,
      githubLink: githubLink || '',
      creatorId: req.user.id,
    });
    await User.increment('contributionPoints', { by: 10, where: { id: req.user.id } });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 编辑项目（创建者/管理员） ====================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: '项目不存在' });
    if (project.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限编辑此项目' });
    }
    const { title, description, difficulty, status, techStack, requiredMembers, githubLink } = req.body;
    await project.update({ title, description, difficulty, status, techStack, requiredMembers, githubLink });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 删除项目（创建者/管理员） ====================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: '项目不存在' });
    if (project.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权限删除此项目' });
    }
    await project.destroy();
    // 扣除创建积分
    await User.decrement('contributionPoints', { by: 10, where: { id: project.creatorId } });
    res.json({ message: '项目已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 点赞/取消点赞 ====================
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: '项目不存在' });

    const existing = await ProjectLike.findOne({
      where: { projectId: project.id, userId: req.user.id },
    });
    if (existing) {
      await existing.destroy();
      await Project.decrement('likes', { where: { id: project.id } });
      res.json({ liked: false });
    } else {
      await ProjectLike.create({ projectId: project.id, userId: req.user.id });
      await Project.increment('likes', { where: { id: project.id } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 加入项目 ====================
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: '项目不存在' });
    if (project.creatorId === req.user.id) {
      return res.status(400).json({ message: '你是项目创建者，无需加入' });
    }
    const existing = await ProjectMember.findOne({
      where: { projectId: project.id, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ message: '你已经加入了这个项目' });

    await ProjectMember.create({ projectId: project.id, userId: req.user.id });
    res.json({ message: '成功加入项目', joined: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 退出项目 ====================
router.delete('/:id/join', authMiddleware, async (req, res) => {
  try {
    const member = await ProjectMember.findOne({
      where: { projectId: req.params.id, userId: req.user.id },
    });
    if (!member) return res.status(400).json({ message: '你未加入此项目' });
    await member.destroy();
    res.json({ message: '已退出项目', joined: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
