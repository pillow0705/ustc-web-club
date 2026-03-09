// 路由配置文件 - 定义应用的所有路由
import { createRouter, createWebHistory } from 'vue-router'

// ==================== 路由配置 ====================
const routes = [
  // 首页
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },

  // 认证页面
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },

  // 活动相关页面
  { path: '/activities', name: 'Activities', component: () => import('../views/Activities.vue') },
  { path: '/activities/:id', name: 'ActivityDetail', component: () => import('../views/ActivityDetail.vue') },

  // 项目相关页面
  { path: '/projects', name: 'Projects', component: () => import('../views/Projects.vue') },

  // 介绍页面
  { path: '/about', name: 'About', component: () => import('../views/About.vue') },

  // 用户相关页面
  { path: '/profile/:id', name: 'Profile', component: () => import('../views/Profile.vue') },
  { path: '/leaderboard', name: 'Leaderboard', component: () => import('../views/Leaderboard.vue') },
]

// 创建路由实例
// createWebHistory：使用浏览器原生的 History API，URL 更简洁（不带 #）
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 导出路由实例
export default router
