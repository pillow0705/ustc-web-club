// 用户管理路由 - 处理用户资料查看、编辑和排行榜功能
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User, Follow } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// 配置头像上传目录
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    // 用 userId + 时间戳命名，避免重名
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 限制 2MB
  fileFilter: (req, file, cb) => {
    // 只允许图片
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('只能上传图片文件'));
  },
});

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
// 获取指定用户的详细资料信息（不包含密码），含关注数/粉丝数
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ message: '用户不存在' });

    const followingCount = await Follow.count({ where: { followerId: user.id } });
    const followersCount = await Follow.count({ where: { followingId: user.id } });

    res.json({ ...user.toJSON(), followingCount, followersCount });
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

// ==================== 上传头像 ====================
// POST /api/users/avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: '请选择图片' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await User.update({ avatar: avatarUrl }, { where: { id: req.user.id } });
    res.json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取用户创建的项目 ====================
router.get('/:id/projects', async (req, res) => {
  try {
    const { Project } = require('../models');
    const projects = await Project.findAll({
      where: { creatorId: req.params.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取用户加入的项目 ====================
router.get('/:id/joined-projects', async (req, res) => {
  try {
    const { Project, User } = require('../models');
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Project,
        as: 'joinedProjects',
        include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
        through: { attributes: [] },
      }],
    });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json(user.joinedProjects || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 关注用户 ====================
// POST /api/users/:id/follow
router.post('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    if (targetId === req.user.id) return res.status(400).json({ message: '不能关注自己' });
    const target = await User.findByPk(targetId);
    if (!target) return res.status(404).json({ message: '用户不存在' });
    const [, created] = await Follow.findOrCreate({
      where: { followerId: req.user.id, followingId: targetId },
    });
    if (!created) return res.status(400).json({ message: '已经关注了该用户' });
    res.json({ message: '关注成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 取关用户 ====================
// DELETE /api/users/:id/follow
router.delete('/:id/follow', authMiddleware, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);
    const deleted = await Follow.destroy({
      where: { followerId: req.user.id, followingId: targetId },
    });
    if (!deleted) return res.status(400).json({ message: '未关注该用户' });
    res.json({ message: '取关成功' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取粉丝列表 ====================
// GET /api/users/:id/followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'followers',
        attributes: ['id', 'username', 'avatar'],
        through: { attributes: [] },
      }],
    });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json(user.followers || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取关注列表 ====================
// GET /api/users/:id/following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'avatar'],
        through: { attributes: [] },
      }],
    });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json(user.following || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 导出路由
module.exports = router;
