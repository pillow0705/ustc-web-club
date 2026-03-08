<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">USTC Web Club</router-link>
        <div class="nav-links">
          <router-link to="/activities">活动</router-link>
          <router-link to="/projects">项目池</router-link>
          <router-link to="/vote">投票</router-link>
          <router-link to="/leaderboard">排行榜</router-link>
          <template v-if="auth.isLoggedIn">
            <router-link :to="`/profile/${auth.user.id}`">我的</router-link>
            <button class="btn btn-small btn-danger" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="btn btn-small btn-primary">注册</router-link>
          </template>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-brand {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-links a {
  color: #606266;
  font-size: 14px;
}
.nav-links a.router-link-active {
  color: #409eff;
  font-weight: 600;
}
</style>
