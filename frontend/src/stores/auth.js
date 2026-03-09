// 认证状态管理 - 使用 Pinia 管理用户认证相关的全局状态
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

// 定义认证存储
export const useAuthStore = defineStore('auth', () => {
  // ==================== 状态 ====================
  // 从 localStorage 中恢复用户信息（用于页面刷新后保持登录状态）
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // JWT 令牌（从 localStorage 恢复）
  const token = ref(localStorage.getItem('token') || '')

  // ==================== 计算属性 ====================
  // 是否已登录：有有效 token 即为已登录
  const isLoggedIn = computed(() => !!token.value)

  // 是否是管理员：根据用户角色判断
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ==================== 方法 ====================
  // 登录方法
  async function login(email, password) {
    // 调用后端登录 API
    const data = await api.post('/auth/login', { email, password })

    // 保存响应的 token 和 user 信息
    token.value = data.token
    user.value = data.user

    // 将认证信息持久化到 localStorage（便于页面刷新后恢复）
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  // 注册方法
  async function register(username, email, password) {
    // 调用后端注册 API
    const data = await api.post('/auth/register', { username, email, password })

    // 保存响应的 token 和 user 信息（注册后自动登录）
    token.value = data.token
    user.value = data.user

    // 将认证信息持久化到 localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  // 登出方法
  function logout() {
    // 清空内存中的用户信息
    token.value = ''
    user.value = null

    // 清除 localStorage 中的数据
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 导出状态和方法供组件使用
  return { user, token, isLoggedIn, isAdmin, login, register, logout }
})
