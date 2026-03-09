// 评论路由 - 处理项目评论的增删查
const express = require('express');
const { Comment, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/comments/:projectId - 获取某项目的所有评论
router.get('/:projectId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/:projectId - 发表评论（需要登录）
router.post('/:projectId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }
    const comment = await Comment.create({
      content: content.trim(),
      projectId: req.params.projectId,
      userId: req.user.id,
    });
    // 返回包含作者信息的评论
    const result = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:id - 删除自己的评论（需要登录）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: '评论不存在' });
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: '只能删除自己的评论' });
    }
    await comment.destroy();
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
