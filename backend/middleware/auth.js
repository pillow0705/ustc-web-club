// JWT 认证中间件
const jwt = require('jsonwebtoken');

// 认证中间件 - 验证请求中的 JWT 令牌
// 从 Authorization header 中提取 Bearer 令牌，并验证其有效性
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 检查是否提供了认证令牌
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  // 从 Bearer token 中提取令牌值
  const token = authHeader.split(' ')[1];
  try {
    // 使用 JWT_SECRET 验证令牌的签名
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 将解码的用户信息附加到请求对象
    next();
  } catch {
    // 令牌无效或已过期
    return res.status(401).json({ message: '令牌无效或已过期' });
  }
}

// 管理员中间件 - 检查用户是否具有管理员权限
// 必须在 authMiddleware 之后使用，以确保 req.user 已被设置
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '需要管理员权限' });
  }
  next();
}

// 导出中间件供路由使用
module.exports = { authMiddleware, adminMiddleware };
