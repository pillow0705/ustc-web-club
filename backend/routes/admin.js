// 管理员路由 - 仅管理员可访问
const express = require('express');
const { User, Project, Activity, Comment } = require('../models');
const { adminAuth } = require('../middleware/adminAuth');
const router = express.Router();

// ==================== 站点统计概览 ====================
// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [userCount, projectCount, activityCount, commentCount] = await Promise.all([
      User.count(),
      Project.count(),
      Activity.count(),
      Comment.count(),
    ]);
    res.json({ userCount, projectCount, activityCount, commentCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取所有用户（含详细信息） ====================
// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 设置/取消管理员 ====================
// PUT /api/admin/users/:id/role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body; // 'admin' 或 'member'
    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: '无效的角色' });
    }
    // 不能修改自己
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ message: '不能修改自己的角色' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: '用户不存在' });
    await user.update({ role });
    res.json({ message: `已将 ${user.username} 设为 ${role}`, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取近期动态 ====================
// GET /api/admin/activity-log
router.get('/activity-log', adminAuth, async (req, res) => {
  try {
    const [recentUsers, recentProjects, recentComments] = await Promise.all([
      User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        limit: 10,
      }),
      Project.findAll({
        include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
        order: [['createdAt', 'DESC']],
        limit: 10,
      }),
      Comment.findAll({
        include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
        order: [['createdAt', 'DESC']],
        limit: 10,
      }),
    ]);
    res.json({ recentUsers, recentProjects, recentComments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 删除用户 ====================
// DELETE /api/admin/users/:id
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ message: '不能删除自己' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: '用户不存在' });
    await user.destroy();
    res.json({ message: '用户已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
