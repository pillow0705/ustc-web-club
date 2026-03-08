<template>
  <div>
    <div class="hero card">
      <h1>USTC Web Club</h1>
      <p class="text-gray mt-16">中国科学技术大学 Web 开发俱乐部 - 一起编码，一起成长</p>
      <div class="mt-16 flex gap-8">
        <router-link to="/activities" class="btn btn-primary">查看活动</router-link>
        <router-link to="/projects" class="btn btn-success">浏览项目</router-link>
      </div>
    </div>

    <div class="stats flex gap-16 mt-16">
      <div class="card stat-card">
        <h3>{{ activities.length }}</h3>
        <p class="text-gray text-small">活动</p>
      </div>
      <div class="card stat-card">
        <h3>{{ projects.length }}</h3>
        <p class="text-gray text-small">项目</p>
      </div>
      <div class="card stat-card">
        <h3>{{ members.length }}</h3>
        <p class="text-gray text-small">成员</p>
      </div>
    </div>

    <h2 class="mt-16 mb-16">近期活动</h2>
    <div v-if="activities.length === 0" class="card text-gray">暂无活动</div>
    <div v-for="act in activities.slice(0, 3)" :key="act.id" class="card">
      <div class="flex-between">
        <h3>{{ act.title }}</h3>
        <span class="tag" :class="statusTagClass(act.status)">{{ statusText(act.status) }}</span>
      </div>
      <p class="text-gray text-small mt-16">{{ act.location }} | {{ formatDate(act.startTime) }}</p>
      <router-link :to="`/activities/${act.id}`" class="btn btn-small btn-primary mt-16">查看详情</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const activities = ref([])
const projects = ref([])
const members = ref([])

onMounted(async () => {
  try {
    const [a, p, m] = await Promise.all([
      api.get('/activities'),
      api.get('/projects'),
      api.get('/users'),
    ])
    activities.value = a
    projects.value = p
    members.value = m
  } catch (e) {
    // silently fail on home page
  }
})

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
.hero { text-align: center; padding: 48px 24px; }
.hero h1 { font-size: 36px; color: #409eff; }
.stat-card { flex: 1; text-align: center; }
.stat-card h3 { font-size: 32px; color: #409eff; }
</style>
