import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/activities', name: 'Activities', component: () => import('../views/Activities.vue') },
  { path: '/activities/:id', name: 'ActivityDetail', component: () => import('../views/ActivityDetail.vue') },
  { path: '/projects', name: 'Projects', component: () => import('../views/Projects.vue') },
  { path: '/vote', name: 'Vote', component: () => import('../views/VotePage.vue') },
  { path: '/profile/:id', name: 'Profile', component: () => import('../views/Profile.vue') },
  { path: '/leaderboard', name: 'Leaderboard', component: () => import('../views/Leaderboard.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
