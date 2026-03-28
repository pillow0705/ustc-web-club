<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <router-link to="/" class="nav-brand">
          <span class="brand-name">Vibe Club</span>
        </router-link>

        <!-- Links -->
        <div class="nav-links">
          <router-link to="/" exact>主页</router-link>
          <router-link to="/activities">活动</router-link>
          <router-link to="/projects">项目池</router-link>
          <router-link to="/leaderboard">排行榜</router-link>
          <router-link to="/handbook">手册</router-link>
        </div>

        <!-- Auth -->
        <div class="nav-auth">
          <template v-if="auth.isLoggedIn">
            <router-link v-if="auth.isAdmin" to="/admin" class="btn btn-ghost btn-small admin-btn">
              🛠 管理
            </router-link>
            <router-link to="/messages" class="btn btn-ghost btn-small msg-btn">
              💬 消息
              <span v-if="unreadCount > 0" class="msg-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
            </router-link>
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
        <span style="font-family:Georgia,serif;font-size:16px;color:var(--text-primary)">Vibe Club</span>
        <span style="color:var(--text-muted);font-size:13px">中国科学技术大学 · Vibe Club</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'
import api from './api'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const unreadCount = ref(0)
let pollTimer = null

async function fetchUnread() {
  if (!auth.isLoggedIn) { unreadCount.value = 0; return }
  try {
    const data = await api.get('/messages')
    unreadCount.value = Array.isArray(data) ? data.reduce((sum, c) => sum + (c.unread || 0), 0) : 0
  } catch { unreadCount.value = 0 }
}

function startPolling() {
  fetchUnread()
  pollTimer = setInterval(fetchUnread, 30000)
}
function stopPolling() { clearInterval(pollTimer) }

// 进入消息页时清零（标记已读后刷新）
watch(() => route.path, (p) => {
  if (p.startsWith('/messages')) setTimeout(fetchUnread, 800)
})

watch(() => auth.isLoggedIn, (v) => { v ? startPolling() : stopPolling() })

onMounted(() => { if (auth.isLoggedIn) startPolling() })
onUnmounted(stopPolling)

function handleLogout() {
  auth.logout()
  stopPolling()
  unreadCount.value = 0
  router.push('/login')
}
</script>

<style scoped>
/* ---- Navbar ---- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(245, 244, 237, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(20, 20, 19, 0.08);
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* Brand */
.nav-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}
.brand-name {
  font-family: Georgia, serif;
  font-size: 17px;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

/* Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
}
.nav-links a {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 400;
  padding: 6px 14px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  text-decoration: none;
}
.nav-links a:hover {
  color: var(--text-primary);
  background: rgba(20, 20, 19, 0.05);
}
.nav-links a.router-link-active,
.nav-links a.router-link-exact-active {
  color: var(--accent);
  background: rgba(217, 119, 87, 0.08);
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
  background: transparent;
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
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}
.nav-username {
  font-size: 13px;
  font-weight: 500;
  color: #111111;
}
.msg-btn {
  position: relative;
}
.msg-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  pointer-events: none;
}

.admin-btn {
  border-color: rgba(217, 119, 87, 0.3);
  color: var(--accent) !important;
}
.admin-btn:hover {
  border-color: var(--border-accent);
  background: rgba(217, 119, 87, 0.07) !important;
}

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  margin-top: 64px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
