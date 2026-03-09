// 导入必要的模块
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // 加载环境变量

// 导入数据库和路由
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');

// 创建 Express 应用实例
const app = express();

// 中间件配置
app.use(cors()); // 跨域资源共享
app.use(express.json()); // 解析 JSON 请求体

// API 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
// 提供上传文件的静态访问
app.use('/uploads', require('express').static('uploads'));

// 健康检查端点 (用于监控服务是否正常运行)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 从环境变量读取端口，默认为 3000
const PORT = process.env.PORT || 3000;

// 异步启动函数
async function start() {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('Database connected.');

    // 同步数据库表结构
    await sequelize.sync();
    console.log('Tables synced.');

    // 启动服务器，监听 0.0.0.0:PORT (允许公网访问)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
