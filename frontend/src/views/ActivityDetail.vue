<template>
  <div v-if="loading" class="text-center text-gray" style="padding:60px">加载中...</div>
  <div v-else-if="!activity" class="card text-center text-gray" style="padding:60px">
    <p style="font-size:32px;margin-bottom:12px">🔍</p>
    <p>活动不存在或加载失败</p>
    <router-link to="/activities" class="btn btn-ghost btn-small" style="margin-top:16px">返回活动列表</router-link>
  </div>
  <div v-else>
    <div class="card">
      <div class="flex-between">
        <h2>{{ activity.title }}</h2>
        <span class="tag" :class="statusTagClass(activity.status)">{{ statusText(activity.status) }}</span>
      </div>
      <p class="text-gray text-small mt-16">
        发起人：{{ activity.creator?.username }} |
        {{ activity.location }} |
        {{ formatDate(activity.startTime) }} - {{ formatDate(activity.endTime) }}
      </p>
      <p class="mt-16">{{ activity.description }}</p>

      <div class="mt-16" v-if="auth.isLoggedIn">
        <button v-if="!hasSignedUp" class="btn btn-success" @click="signup">报名参加</button>
        <button v-else class="btn btn-danger" @click="cancelSignup">取消报名</button>
      </div>
    </div>

    <div class="card mt-16">
      <h3>参与者 ({{ activity.participants?.length || 0 }}{{ activity.maxParticipants > 0 ? `/${activity.maxParticipants}` : '' }})</h3>
      <div class="mt-16 flex gap-8" style="flex-wrap:wrap">
        <router-link v-for="p in activity.participants" :key="p.id" :to="`/profile/${p.id}`" class="tag tag-blue">
          {{ p.username }}
        </router-link>
        <span v-if="!activity.participants?.length" class="text-gray text-small">暂无报名</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()
const activity = ref(null)
const loading = ref(true)

const hasSignedUp = computed(() => {
  if (!auth.user || !activity.value?.participants) return false
  return activity.value.participants.some(p => p.id === auth.user.id)
})

onMounted(loadActivity)

async function loadActivity() {
  loading.value = true
  try { activity.value = await api.get(`/activities/${route.params.id}`) } catch {}
  loading.value = false
}

async function signup() {
  try {
    await api.post(`/activities/${route.params.id}/signup`)
    await loadActivity()
  } catch (e) { alert(e.message || '报名失败') }
}

async function cancelSignup() {
  try {
    await api.delete(`/activities/${route.params.id}/signup`)
    await loadActivity()
  } catch (e) { alert(e.message || '取消失败') }
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
