// 活动管理路由 - 处理活动的查看、创建和报名
const express = require('express');
const { Activity, ActivitySignup, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// ==================== 获取所有活动列表 ====================
// GET /api/activities
// 返回所有活动，按开始时间倒序排列，包含创建者信息
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
      order: [['startTime', 'DESC']],
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取单个活动详情 ====================
// GET /api/activities/:id
// 返回活动详情，包含创建者和所有参与者信息
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'participants', attributes: ['id', 'username'], through: { attributes: [] } },
      ],
    });
    if (!activity) return res.status(404).json({ message: '活动不存在' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 创建新活动 ====================
// POST /api/activities
// 仅限管理员创建活动
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, location, startTime, endTime, maxParticipants } = req.body;
    const activity = await Activity.create({
      title, description, location, startTime, endTime, maxParticipants,
      creatorId: req.user.id, // 自动设置创建者为当前用户
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 编辑活动 ====================
// PUT /api/activities/:id - 仅限管理员
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: '活动不存在' });
    const { title, description, location, startTime, endTime, maxParticipants, status } = req.body;
    await activity.update({ title, description, location, startTime, endTime, maxParticipants, status });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 删除活动 ====================
// DELETE /api/activities/:id - 仅限管理员
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: '活动不存在' });
    await activity.destroy();
    res.json({ message: '活动已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 报名参加活动 ====================
// POST /api/activities/:id/signup
// 用户报名参加某个活动（需要身份验证）
// 自动更新用户的参与计数和贡献点数
router.post('/:id/signup', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: '活动不存在' });

    // 检查用户是否已报名
    const existing = await ActivitySignup.findOne({
      where: { activityId: activity.id, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ message: '已报名该活动' });

    // 检查活动人数是否已满（maxParticipants > 0 表示有限制）
    if (activity.maxParticipants > 0) {
      const count = await ActivitySignup.count({ where: { activityId: activity.id } });
      if (count >= activity.maxParticipants) {
        return res.status(400).json({ message: '报名人数已满' });
      }
    }

    // 创建报名记录
    await ActivitySignup.create({ activityId: activity.id, userId: req.user.id });

    // 更新用户统计数据：参与次数 +1，贡献点数 +5
    await User.increment('participationCount', { where: { id: req.user.id } });
    await User.increment('contributionPoints', { by: 5, where: { id: req.user.id } });

    res.json({ message: '报名成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 取消活动报名 ====================
// DELETE /api/activities/:id/signup
// 取消用户对某个活动的报名
// 自动更新用户的参与计数和贡献点数
router.delete('/:id/signup', authMiddleware, async (req, res) => {
  try {
    // 删除报名记录
    const deleted = await ActivitySignup.destroy({
      where: { activityId: req.params.id, userId: req.user.id },
    });

    if (!deleted) return res.status(400).json({ message: '未报名该活动' });

    // 更新用户统计数据：参与次数 -1，贡献点数 -5
    await User.decrement('participationCount', { where: { id: req.user.id } });
    await User.decrement('contributionPoints', { by: 5, where: { id: req.user.id } });

    res.json({ message: '取消报名成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 导出路由
module.exports = router;
