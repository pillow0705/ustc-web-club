<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">🛠 管理后台</h1>
        <p class="text-gray text-small">仅管理员可见</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row" v-if="stats">
      <div class="stat-card card">
        <div class="stat-num gradient-text">{{ stats.userCount }}</div>
        <div class="stat-label">注册成员</div>
      </div>
      <div class="stat-card card">
        <div class="stat-num gradient-text">{{ stats.projectCount }}</div>
        <div class="stat-label">提交项目</div>
      </div>
      <div class="stat-card card">
        <div class="stat-num gradient-text">{{ stats.activityCount }}</div>
        <div class="stat-label">举办活动</div>
      </div>
      <div class="stat-card card">
        <div class="stat-num gradient-text">{{ stats.commentCount }}</div>
        <div class="stat-label">评论总数</div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-row">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- 成员管理 -->
    <div v-if="activeTab === 'users'" class="card" style="padding:0;overflow:hidden">
      <table class="admin-table">
        <thead>
          <tr>
            <th>成员</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>贡献积分</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>
              <div class="user-cell">
                <div class="u-avatar">{{ u.username?.charAt(0).toUpperCase() }}</div>
                <router-link :to="`/profile/${u.id}`">{{ u.username }}</router-link>
              </div>
            </td>
            <td class="text-secondary text-small">{{ u.email }}</td>
            <td>
              <span class="tag" :class="u.role === 'admin' ? 'tag-cyan' : 'tag-blue'">
                {{ u.role === 'admin' ? '管理员' : '成员' }}
              </span>
            </td>
            <td class="text-secondary">{{ u.contributionPoints }}</td>
            <td class="text-muted text-small">{{ formatDate(u.createdAt) }}</td>
            <td>
              <div class="flex gap-8" v-if="String(u.id) !== String(auth.user?.id)">
                <button
                  v-if="u.role !== 'admin'"
                  class="btn btn-small btn-primary"
                  @click="setRole(u, 'admin')"
                >设为管理员</button>
                <button
                  v-else
                  class="btn btn-small btn-ghost"
                  @click="setRole(u, 'member')"
                >取消管理员</button>
                <button class="btn btn-small btn-danger" @click="deleteUser(u)">删除</button>
              </div>
              <span v-else class="text-muted text-small">（自己）</span>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center text-gray" style="padding:40px">暂无成员</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 近期动态 -->
    <div v-if="activeTab === 'log'">
      <div v-if="log">
        <h3 class="section-title">新注册成员</h3>
        <div class="log-list card">
          <div v-for="u in log.recentUsers" :key="u.id" class="log-item">
            <div class="log-icon user-icon">👤</div>
            <div>
              <strong>{{ u.username }}</strong> 注册了账号
              <span class="text-muted text-small" style="margin-left:8px">{{ formatDate(u.createdAt) }}</span>
            </div>
          </div>
          <div v-if="!log.recentUsers?.length" class="text-gray text-small" style="padding:12px">暂无数据</div>
        </div>

        <h3 class="section-title">最新项目</h3>
        <div class="log-list card">
          <div v-for="p in log.recentProjects" :key="p.id" class="log-item">
            <div class="log-icon project-icon">📦</div>
            <div>
              <router-link :to="`/projects/${p.id}`"><strong>{{ p.title }}</strong></router-link>
              <span class="text-secondary text-small"> 由 {{ p.creator?.username }} 提交</span>
              <span class="text-muted text-small" style="margin-left:8px">{{ formatDate(p.createdAt) }}</span>
            </div>
          </div>
          <div v-if="!log.recentProjects?.length" class="text-gray text-small" style="padding:12px">暂无数据</div>
        </div>

        <h3 class="section-title">最新评论</h3>
        <div class="log-list card">
          <div v-for="c in log.recentComments" :key="c.id" class="log-item">
            <div class="log-icon comment-icon">💬</div>
            <div>
              <strong>{{ c.author?.username }}</strong> 发表了评论：
              <span class="text-secondary text-small">"{{ c.content?.slice(0, 40) }}{{ c.content?.length > 40 ? '...' : '' }}"</span>
              <span class="text-muted text-small" style="margin-left:8px">{{ formatDate(c.createdAt) }}</span>
            </div>
          </div>
          <div v-if="!log.recentComments?.length" class="text-gray text-small" style="padding:12px">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const stats = ref(null)
const users = ref([])
const log = ref(null)
const activeTab = ref('users')

const tabs = [
  { key: 'users', label: '成员管理' },
  { key: 'log',   label: '近期动态' },
]

onMounted(async () => {
  if (!auth.isAdmin) { router.push('/'); return }
  await Promise.all([loadStats(), loadUsers(), loadLog()])
})

async function loadStats() {
  try { stats.value = await api.get('/admin/stats') } catch {}
}
async function loadUsers() {
  try { users.value = await api.get('/admin/users') } catch {}
}
async function loadLog() {
  try { log.value = await api.get('/admin/activity-log') } catch {}
}

async function setRole(user, role) {
  try {
    await api.put(`/admin/users/${user.id}/role`, { role })
    user.role = role
  } catch (e) { alert(e.message || '操作失败') }
}

async function deleteUser(user) {
  if (!confirm(`确定删除用户 ${user.username}？此操作不可撤销。`)) return
  try {
    await api.delete(`/admin/users/${user.id}`)
    users.value = users.value.filter(u => u.id !== user.id)
  } catch (e) { alert(e.message || '删除失败') }
}

function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 800; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.stat-card { text-align: center; padding: 20px; }
.stat-num { font-size: 28px; font-weight: 800; }
.stat-label { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }

/* Tabs */
.tab-row {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0;
}
.tab-btn {
  padding: 8px 20px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}
.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active {
  color: #a5b4fc;
  border-bottom-color: var(--accent);
}

/* Table */
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th {
  padding: 12px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.admin-table td {
  padding: 13px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(99,102,241,0.03); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.u-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--gradient); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}

/* Log */
.section-title { font-size: 16px; font-weight: 700; margin: 20px 0 10px; }
.log-list { padding: 0 !important; }
.log-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.log-item:last-child { border-bottom: none; }
.log-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.user-icon    { background: rgba(99,102,241,0.15); }
.project-icon { background: rgba(6,182,212,0.15); }
.comment-icon { background: rgba(16,185,129,0.15); }
</style>
