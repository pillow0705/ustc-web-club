// 项目管理路由 - 处理项目的查看、创建和点赞功能
const express = require('express');
const { Project, ProjectLike, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { Op } = require('sequelize'); // Sequelize 操作符
const router = express.Router();

// ==================== 获取项目列表（支持筛选） ====================
// GET /api/projects?difficulty=beginner&techStack=JavaScript&status=open
// 支持按难度、技术栈、状态筛选，按点赞数和创建时间排序
router.get('/', async (req, res) => {
  try {
    const { difficulty, techStack, status } = req.query;
    const where = {}; // 构建 WHERE 条件

    // 添加筛选条件
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    // 使用模糊查询搜索技术栈
    if (techStack) where.techStack = { [Op.like]: `%${techStack}%` };

    const projects = await Project.findAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
      order: [['likes', 'DESC'], ['createdAt', 'DESC']], // 先按点赞数倒序，再按创建时间倒序
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取单个项目详情 ====================
// GET /api/projects/:id
// 返回项目详情，包含创建者信息
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
    });
    if (!project) return res.status(404).json({ message: '项目不存在' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 创建新项目 ====================
// POST /api/projects
// 需要身份验证，自动获得 10 点贡献值
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, techStack, requiredMembers } = req.body;

    // 创建项目
    const project = await Project.create({
      title, description, difficulty, techStack, requiredMembers,
      creatorId: req.user.id, // 自动设置创建者
    });

    // 创建项目奖励 10 点贡献值
    await User.increment('contributionPoints', { by: 10, where: { id: req.user.id } });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 项目点赞/取消点赞 ====================
// POST /api/projects/:id/like
// 切换点赞状态：未点赞 -> 点赞，已点赞 -> 取消点赞
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    // 查找项目
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: '项目不存在' });

    // 检查用户是否已点赞
    const existing = await ProjectLike.findOne({
      where: { projectId: project.id, userId: req.user.id },
    });

    if (existing) {
      // 已点赞 -> 取消点赞
      await existing.destroy();
      await Project.decrement('likes', { where: { id: project.id } });
      res.json({ message: '取消点赞', liked: false });
    } else {
      // 未点赞 -> 点赞
      await ProjectLike.create({ projectId: project.id, userId: req.user.id });
      await Project.increment('likes', { where: { id: project.id } });
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 编辑项目 ====================
// PUT /api/projects/:id - 只有创建者可以编辑
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: '项目不存在' });
    if (project.creatorId !== req.user.id) {
      return res.status(403).json({ message: '只能编辑自己的项目' });
    }
    const { title, description, difficulty, status, techStack, requiredMembers } = req.body;
    await project.update({ title, description, difficulty, status, techStack, requiredMembers });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 导出路由
module.exports = router;
