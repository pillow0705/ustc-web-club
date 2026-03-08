const express = require('express');
const { Vote, VoteOption, UserVote, Project, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// List all votes
router.get('/', async (req, res) => {
  try {
    const votes = await Vote.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: VoteOption, as: 'options', include: [{ model: Project, as: 'project', attributes: ['id', 'title'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vote detail
router.get('/:id', async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: VoteOption, as: 'options', include: [{ model: Project, as: 'project', attributes: ['id', 'title'] }] },
      ],
    });
    if (!vote) return res.status(404).json({ message: '投票不存在' });
    res.json(vote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create vote (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, deadline, options } = req.body;
    const vote = await Vote.create({
      title, description, deadline, creatorId: req.user.id,
    });
    if (options && options.length > 0) {
      for (const opt of options) {
        await VoteOption.create({
          voteId: vote.id,
          projectId: opt.projectId || null,
          optionText: opt.text,
        });
      }
    }
    const result = await Vote.findByPk(vote.id, {
      include: [{ model: VoteOption, as: 'options' }],
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cast vote
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { optionId } = req.body;
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) return res.status(404).json({ message: '投票不存在' });
    if (!vote.isActive || new Date() > new Date(vote.deadline)) {
      return res.status(400).json({ message: '投票已结束' });
    }

    const existing = await UserVote.findOne({
      where: { voteId: vote.id, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ message: '已投过票' });

    const option = await VoteOption.findOne({ where: { id: optionId, voteId: vote.id } });
    if (!option) return res.status(400).json({ message: '选项无效' });

    await UserVote.create({ voteId: vote.id, optionId, userId: req.user.id });
    await VoteOption.increment('voteCount', { where: { id: optionId } });
    await User.increment('contributionPoints', { by: 2, where: { id: req.user.id } });
    res.json({ message: '投票成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
