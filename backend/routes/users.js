// 用户管理路由 - 处理用户资料查看、编辑和排行榜功能
const express = require('express');
const { User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// ==================== 获取用户排行榜 ====================
// GET /api/users
// 获取所有用户列表，按贡献点数倒序排列（排行榜）
// 不包含密码信息
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // 隐藏密码字段
      order: [['contributionPoints', 'DESC']], // 按贡献点数从高到低排序
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取用户资料 ====================
// GET /api/users/:id
// 获取指定用户的详细资料信息（不包含密码）
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }, // 隐藏密码字段
    });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 更新用户资料 ====================
// PUT /api/users/profile
// 需要身份验证，允许用户编辑自己的资料
// 可以编辑：个人简介、技术栈、GitHub 链接、头像
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, techStack, githubLink, avatar } = req.body;

    // 更新当前用户的资料
    await User.update(
      { bio, techStack, githubLink, avatar },
      { where: { id: req.user.id } }
    );

    // 返回更新后的用户信息（不包含密码）
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 导出路由
module.exports = router;
