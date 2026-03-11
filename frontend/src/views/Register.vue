<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h2>加入 Vibe Club</h2>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名（随意起一个自己喜欢的名字吧~）</label>
          <input v-model="username" placeholder="请输入用户名" required />
        </div>
        <div class="form-group">
          <label>科大邮箱</label>
          <input v-model="email" type="email" placeholder="your@mail.ustc.edu.cn" required />
        </div>
        <div class="form-group">
          <label>密码（设置一个自己的密码）</label>
          <input v-model="password" type="password" placeholder="至少6位" required minlength="6" />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">注册</button>
      </form>
      <p class="mt-16 text-small text-gray">
        已有账号？<router-link to="/login">立即登录</router-link>
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
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function handleRegister() {
  try {
    error.value = ''
    if (!email.value.endsWith('@mail.ustc.edu.cn')) {
      error.value = '必须使用科大邮箱 (@mail.ustc.edu.cn)'
      return
    }
    await auth.register(username.value, email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || '注册失败'
  }
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; padding-top: 60px; }
.auth-card { width: 400px; }
.auth-card h2 { margin-bottom: 8px; font-size: 24px; font-weight: 800; }
.auth-card .sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 28px; }
.error-msg {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.25);
  color: #fda4af;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
