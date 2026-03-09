// API 请求配置 - 创建 Axios 实例并配置拦截器
import axios from 'axios'

// ==================== 创建 Axios 实例 ====================
// baseURL: API 基础路径（所有请求都会添加这个前缀）
// timeout: 请求超时时间（10 秒）
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// ==================== 请求拦截器 ====================
// 在每个请求发送前，自动添加 JWT 令牌到 Authorization header
api.interceptors.request.use((config) => {
  // 从 localStorage 获取保存的 token
  const token = localStorage.getItem('token')

  // 如果存在 token，将其添加到请求头
  // 格式：Authorization: Bearer <token>
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ==================== 响应拦截器 ====================
// 处理响应数据和错误
api.interceptors.response.use(
  // 成功响应：直接返回响应数据（去掉 axios 的包装）
  (res) => res.data,

  // 错误响应：处理异常情况
  (err) => {
    // 401 Unauthorized：令牌无效或已过期
    if (err.response?.status === 401) {
      // 清除本地存储的令牌和用户信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // 重定向到登录页面
      window.location.href = '/login'
    }

    // 返回错误信息（优先返回响应数据中的错误信息）
    return Promise.reject(err.response?.data || err)
  }
)

// 导出配置好的 API 实例，供其他模块使用
export default api
