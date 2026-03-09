// 投票管理路由 - 处理投票的创建、查看和投票功能
const express = require('express');
const { Vote, VoteOption, UserVote, Project, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// ==================== 获取所有投票列表 ====================
// GET /api/votes
// 返回所有投票，包含创建者信息、所有选项及关联项目信息
// 按创建时间倒序排列
router.get('/', async (req, res) => {
  try {
    const votes = await Vote.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        // 投票选项中包含关联的项目信息
        { model: VoteOption, as: 'options', include: [{ model: Project, as: 'project', attributes: ['id', 'title'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取单个投票详情 ====================
// GET /api/votes/:id
// 返回投票详情，包含所有选项和当前投票统计
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

// ==================== 创建新投票 ====================
// POST /api/votes
// 仅限管理员创建投票
// 支持批量创建投票选项
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, deadline, options } = req.body;

    // 创建投票
    const vote = await Vote.create({
      title, description, deadline,
      creatorId: req.user.id, // 自动设置创建者
    });

    // 创建投票选项
    if (options && options.length > 0) {
      for (const opt of options) {
        await VoteOption.create({
          voteId: vote.id,
          projectId: opt.projectId || null, // 可选关联项目
          optionText: opt.text, // 选项文本
        });
      }
    }

    // 返回创建的投票及其选项
    const result = await Vote.findByPk(vote.id, {
      include: [{ model: VoteOption, as: 'options' }],
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 投票 ====================
// POST /api/votes/:id/vote
// 用户投票选择一个选项，自动获得 2 点贡献值
// 每个用户只能投票一次
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { optionId } = req.body;

    // 检查投票是否存在
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) return res.status(404).json({ message: '投票不存在' });

    // 检查投票是否仍在进行中
    if (!vote.isActive || new Date() > new Date(vote.deadline)) {
      return res.status(400).json({ message: '投票已结束' });
    }

    // 检查用户是否已投过票
    const existing = await UserVote.findOne({
      where: { voteId: vote.id, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ message: '已投过票' });

    // 验证选项是否有效
    const option = await VoteOption.findOne({
      where: { id: optionId, voteId: vote.id },
    });
    if (!option) return res.status(400).json({ message: '选项无效' });

    // 记录投票
    await UserVote.create({
      voteId: vote.id,
      optionId,
      userId: req.user.id,
    });

    // 更新选项的投票数
    await VoteOption.increment('voteCount', { where: { id: optionId } });

    // 为用户增加 2 点贡献值
    await User.increment('contributionPoints', { by: 2, where: { id: req.user.id } });

    res.json({ message: '投票成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 导出路由
module.exports = router;
