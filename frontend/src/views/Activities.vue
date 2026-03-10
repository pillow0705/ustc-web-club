<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">活动</h1>
        <p class="text-gray text-small">在西图研讨室 & 高新区研讨室相聚，一起 Vibe</p>
      </div>
      <button v-if="auth.isAdmin" class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? '取消' : '+ 发布活动' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-16">
      <h3 class="mb-16">发布新活动</h3>
      <form @submit.prevent="createActivity">
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" required placeholder="例：第 3 期 Vibe Session" />
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" rows="3" required placeholder="本次活动内容..."></textarea>
        </div>
        <div class="form-group">
          <label>地点</label>
          <input v-model="form.location" placeholder="西区图书馆研讨室 / 高新区研讨室" />
        </div>
        <div class="flex gap-16">
          <div class="form-group" style="flex:1">
            <label>开始时间</label>
            <input v-model="form.startTime" type="datetime-local" required />
          </div>
          <div class="form-group" style="flex:1">
            <label>结束时间</label>
            <input v-model="form.endTime" type="datetime-local" required />
          </div>
        </div>
        <div class="form-group">
          <label>最大人数 (0 = 不限)</label>
          <input v-model.number="form.maxParticipants" type="number" min="0" />
        </div>
        <button type="submit" class="btn btn-primary">发布</button>
      </form>
    </div>

    <div v-if="activities.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <p>暂无活动，敬请期待</p>
    </div>

    <div class="activities-grid">
      <div v-for="act in activities" :key="act.id" class="activity-card card">
        <div class="card-header">
          <span class="tag" :class="statusTagClass(act.status)">{{ statusText(act.status) }}</span>
          <span class="text-muted text-small">{{ formatDate(act.startTime) }}</span>
        </div>
        <h3 class="act-title">{{ act.title }}</h3>
        <p class="text-secondary text-small mt-8">📍 {{ act.location }}</p>
        <p class="act-desc mt-16">{{ act.description }}</p>
        <div class="card-footer mt-16">
          <span class="text-muted text-small">
            结束：{{ formatDate(act.endTime) }}
          </span>
          <router-link :to="`/activities/${act.id}`" class="btn btn-ghost btn-small">详情 →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const activities = ref([])
const showForm = ref(false)
const form = ref({ title: '', description: '', location: '', startTime: '', endTime: '', maxParticipants: 0 })

onMounted(loadActivities)

async function loadActivities() {
  try { activities.value = await api.get('/activities') } catch {}
}

async function createActivity() {
  try {
    await api.post('/activities', form.value)
    showForm.value = false
    form.value = { title: '', description: '', location: '', startTime: '', endTime: '', maxParticipants: 0 }
    await loadActivities()
  } catch (e) {
    alert(e.message || '创建失败')
  }
}

function statusText(s) {
  return { upcoming: '即将开始', ongoing: '进行中', completed: '已结束' }[s] || s
}
function statusTagClass(s) {
  return { upcoming: 'tag-blue', ongoing: 'tag-green', completed: 'tag-orange' }[s]
}
function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 800; }

.empty-state {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
}
.empty-icon { font-size: 40px; margin-bottom: 12px; }

.activities-grid { display: flex; flex-direction: column; gap: 12px; }
.activity-card { margin-bottom: 0; }
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.act-title { font-size: 18px; font-weight: 700; }
.act-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
</style>
