// 私信消息路由
const express = require('express');
const { Op } = require('sequelize');
const { Message, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// 所有路由都需要登录
router.use(authMiddleware);

// ==================== 获取收件箱（按对话分组） ====================
// GET /api/messages
router.get('/', async (req, res) => {
  try {
    const myId = req.user.id;

    // 获取所有与我相关的消息
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: myId }, { receiverId: myId }],
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    // 按对话对象分组，取每个对话最近一条消息
    const conversationMap = new Map();
    for (const msg of messages) {
      const partnerId = msg.senderId === myId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        const partner = msg.senderId === myId ? msg.receiver : msg.sender;
        conversationMap.set(partnerId, { partner, lastMessage: msg, unreadCount: 0 });
      }
      // 统计未读数（对方发给我且未读）
      if (msg.receiverId === myId && !msg.read) {
        conversationMap.get(partnerId).unreadCount += 1;
      }
    }

    const inbox = Array.from(conversationMap.values());
    res.json(inbox);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 获取与某用户的对话历史 ====================
// GET /api/messages/:userId
router.get('/:userId', async (req, res) => {
  try {
    const myId = req.user.id;
    const partnerId = parseInt(req.params.userId);

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: partnerId },
          { senderId: partnerId, receiverId: myId },
        ],
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'avatar'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 向某用户发送消息 ====================
// POST /api/messages/:userId
router.post('/:userId', async (req, res) => {
  try {
    const myId = req.user.id;
    const receiverId = parseInt(req.params.userId);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: '消息内容不能为空' });
    }
    if (receiverId === myId) {
      return res.status(400).json({ message: '不能给自己发消息' });
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) return res.status(404).json({ message: '用户不存在' });

    const message = await Message.create({
      senderId: myId,
      receiverId,
      content: content.trim(),
    });

    const result = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'avatar'] },
      ],
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== 标记对话消息为已读 ====================
// PUT /api/messages/:userId/read
router.put('/:userId/read', async (req, res) => {
  try {
    const myId = req.user.id;
    const partnerId = parseInt(req.params.userId);

    await Message.update(
      { read: true },
      { where: { senderId: partnerId, receiverId: myId, read: false } }
    );

    res.json({ message: '已标记为已读' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
