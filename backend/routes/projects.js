const express = require('express');
const { Project, ProjectLike, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// List projects with optional filters
router.get('/', async (req, res) => {
  try {
    const { difficulty, techStack, status } = req.query;
    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    if (techStack) where.techStack = { [Op.like]: `%${techStack}%` };

    const projects = await Project.findAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
      order: [['likes', 'DESC'], ['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get project detail
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

// Create project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, techStack, requiredMembers } = req.body;
    const project = await Project.create({
      title, description, difficulty, techStack, requiredMembers,
      creatorId: req.user.id,
    });
    await User.increment('contributionPoints', { by: 10, where: { id: req.user.id } });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like / unlike project
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
      res.json({ message: '取消点赞', liked: false });
    } else {
      await ProjectLike.create({ projectId: project.id, userId: req.user.id });
      await Project.increment('likes', { where: { id: project.id } });
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
