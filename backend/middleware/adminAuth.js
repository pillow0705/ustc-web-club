// 管理员权限中间件 - 必须先经过 authMiddleware 验证身份
const { authMiddleware } = require('./auth');

// 管理员验证：角色必须是 admin
function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: '需要管理员权限' });
  }
  next();
}

// 组合中间件：先验证登录，再验证管理员
const adminAuth = [authMiddleware, adminMiddleware];

module.exports = { adminMiddleware, adminAuth };
