const express = require('express');
const { Activity, ActivitySignup, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// List all activities
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

// Get activity detail
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

// Create activity (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, location, startTime, endTime, maxParticipants } = req.body;
    const activity = await Activity.create({
      title, description, location, startTime, endTime, maxParticipants,
      creatorId: req.user.id,
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sign up for activity
router.post('/:id/signup', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: '活动不存在' });

    const existing = await ActivitySignup.findOne({
      where: { activityId: activity.id, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ message: '已报名该活动' });

    if (activity.maxParticipants > 0) {
      const count = await ActivitySignup.count({ where: { activityId: activity.id } });
      if (count >= activity.maxParticipants) {
        return res.status(400).json({ message: '报名人数已满' });
      }
    }

    await ActivitySignup.create({ activityId: activity.id, userId: req.user.id });
    // Increment user participation
    await User.increment('participationCount', { where: { id: req.user.id } });
    await User.increment('contributionPoints', { by: 5, where: { id: req.user.id } });
    res.json({ message: '报名成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel signup
router.delete('/:id/signup', authMiddleware, async (req, res) => {
  try {
    const deleted = await ActivitySignup.destroy({
      where: { activityId: req.params.id, userId: req.user.id },
    });
    if (!deleted) return res.status(400).json({ message: '未报名该活动' });
    await User.decrement('participationCount', { where: { id: req.user.id } });
    await User.decrement('contributionPoints', { by: 5, where: { id: req.user.id } });
    res.json({ message: '取消报名成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
