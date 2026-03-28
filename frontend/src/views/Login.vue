<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h2>欢迎回来</h2>
      <p class="sub">登录你的 Vibe Club 账号</p>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="email" type="email" placeholder="your@mail.ustc.edu.cn" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">登录</button>
      </form>
      <p class="mt-16 text-small text-gray">
        没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || '登录失败'
  }
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; padding-top: 60px; }
.auth-card { width: 400px; }
.auth-card h2 { margin-bottom: 8px; font-family: Georgia, serif; font-size: 24px; font-weight: 400; }
.auth-card .sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 28px; }
.error-msg {
  background: rgba(230, 57, 70, 0.07);
  border: 1px solid rgba(230, 57, 70, 0.2);
  color: var(--accent-red);
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
