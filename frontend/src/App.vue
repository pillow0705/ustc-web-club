<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <router-link to="/" class="nav-brand">
          <div class="brand-icon">V</div>
          <span>Vibe Club</span>
        </router-link>

        <!-- Links -->
        <div class="nav-links">
          <router-link to="/about">介绍</router-link>
          <router-link to="/activities">活动</router-link>
          <router-link to="/projects">项目池</router-link>
          <router-link to="/leaderboard">排行榜</router-link>
        </div>

        <!-- Auth -->
        <div class="nav-auth">
          <template v-if="auth.isLoggedIn">
            <router-link :to="`/profile/${auth.user.id}`" class="nav-avatar-btn">
              <img v-if="auth.user.avatar" :src="auth.user.avatar" class="nav-avatar" />
              <div v-else class="nav-avatar-placeholder">{{ auth.user.username?.charAt(0).toUpperCase() }}</div>
              <span class="nav-username">{{ auth.user.username }}</span>
            </router-link>
            <button class="btn btn-ghost btn-small" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-small">登录</router-link>
            <router-link to="/register" class="btn btn-primary btn-small">加入俱乐部</router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="container">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <span class="gradient-text" style="font-weight:600">USTC Vibe Club</span>
        <span style="color:var(--text-muted); font-size:13px">中国科学技术大学 · 氛围编程俱乐部</span>
      </div>
    </footer>
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
/* ---- Navbar ---- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(8, 12, 20, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* Brand */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary) !important;
  text-decoration: none;
  flex-shrink: 0;
}
.brand-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
}

/* Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}
.nav-links a {
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
  padding: 7px 16px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  text-decoration: none;
}
.nav-links a:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.05);
}
.nav-links a.router-link-active {
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.12);
}

/* Auth */
.nav-auth {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav-avatar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  transition: border-color 0.2s;
  text-decoration: none;
}
.nav-avatar-btn:hover { border-color: var(--border-accent); }

.nav-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}
.nav-avatar-placeholder {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}
.nav-username {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  margin-top: 48px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
