// 认证路由 - 处理用户注册、登录和身份验证
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// ==================== 用户注册 ====================
// POST /api/auth/register
// 注册新用户，必须使用科大邮箱
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    // 验证邮箱格式（只允许科大邮箱）
    if (!email.endsWith('@mail.ustc.edu.cn')) {
      return res.status(400).json({ message: '必须使用科大邮箱 (@mail.ustc.edu.cn) 注册' });
    }

    // 检查邮箱是否已注册
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: '该邮箱已注册' });
    }

    // 创建新用户（密码会自动加密）
    const user = await User.create({ username, email, password });

    // 生成 JWT 令牌，有效期 7 天
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回令牌和用户信息（不包括密码）
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 用户登录 ====================
// POST /api/auth/login
// 验证邮箱和密码，返回 JWT 令牌
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 根据邮箱查找用户
    const user = await User.findOne({ where: { email } });

    // 验证用户存在且密码正确
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成 JWT 令牌，有效期 7 天
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回令牌和用户信息
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取当前用户信息 ====================
// GET /api/auth/me
// 需要提供有效的 JWT 令牌
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // 从 JWT 中获取用户 ID，查询完整用户信息（排除密码）
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
