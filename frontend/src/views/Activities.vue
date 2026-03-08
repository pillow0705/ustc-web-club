<template>
  <div>
    <div class="flex-between mb-16">
      <h2>活动列表</h2>
      <button v-if="auth.isAdmin" class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? '取消' : '发布活动' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-16">
      <h3 class="mb-16">发布新活动</h3>
      <form @submit.prevent="createActivity">
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" required />
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>地点</label>
          <input v-model="form.location" />
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
          <label>最大人数 (0=不限)</label>
          <input v-model.number="form.maxParticipants" type="number" min="0" />
        </div>
        <button type="submit" class="btn btn-primary">发布</button>
      </form>
    </div>

    <div v-if="activities.length === 0" class="card text-gray">暂无活动</div>
    <div v-for="act in activities" :key="act.id" class="card">
      <div class="flex-between">
        <h3>{{ act.title }}</h3>
        <span class="tag" :class="statusTagClass(act.status)">{{ statusText(act.status) }}</span>
      </div>
      <p class="text-small text-gray mt-16">{{ act.location }} | {{ formatDate(act.startTime) }} - {{ formatDate(act.endTime) }}</p>
      <p class="mt-16">{{ act.description }}</p>
      <div class="mt-16">
        <router-link :to="`/activities/${act.id}`" class="btn btn-small btn-primary">详情</router-link>
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
