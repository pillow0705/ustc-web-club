<template>
  <div>
    <div class="flex-between mb-16">
      <h2>投票</h2>
      <button v-if="auth.isAdmin" class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? '取消' : '发起投票' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-16">
      <h3 class="mb-16">发起新投票</h3>
      <form @submit.prevent="createVote">
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" required />
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>截止时间</label>
          <input v-model="form.deadline" type="datetime-local" required />
        </div>
        <div class="form-group">
          <label>选项 (每行一个)</label>
          <textarea v-model="optionsText" rows="4" placeholder="选项1&#10;选项2&#10;选项3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">发起</button>
      </form>
    </div>

    <div v-if="votes.length === 0" class="card text-gray">暂无投票</div>
    <div v-for="vote in votes" :key="vote.id" class="card">
      <div class="flex-between">
        <h3>{{ vote.title }}</h3>
        <span class="tag" :class="vote.isActive && new Date(vote.deadline) > new Date() ? 'tag-green' : 'tag-orange'">
          {{ vote.isActive && new Date(vote.deadline) > new Date() ? '进行中' : '已结束' }}
        </span>
      </div>
      <p v-if="vote.description" class="text-small text-gray mt-16">{{ vote.description }}</p>
      <p class="text-small text-gray">截止：{{ formatDate(vote.deadline) }}</p>

      <div class="mt-16">
        <div v-for="opt in vote.options" :key="opt.id" class="vote-option" @click="castVote(vote, opt.id)">
          <div class="vote-bar" :style="{ width: barWidth(vote, opt) }"></div>
          <div class="vote-option-content">
            <span>{{ opt.optionText }}{{ opt.project ? ` (${opt.project.title})` : '' }}</span>
            <span class="text-small">{{ opt.voteCount }} 票</span>
          </div>
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
const votes = ref([])
const showForm = ref(false)
const form = ref({ title: '', description: '', deadline: '' })
const optionsText = ref('')

onMounted(loadVotes)

async function loadVotes() {
  try { votes.value = await api.get('/votes') } catch {}
}

async function createVote() {
  try {
    const options = optionsText.value.split('\n').filter(Boolean).map(text => ({ text: text.trim() }))
    await api.post('/votes', { ...form.value, options })
    showForm.value = false
    form.value = { title: '', description: '', deadline: '' }
    optionsText.value = ''
    await loadVotes()
  } catch (e) { alert(e.message || '创建失败') }
}

async function castVote(vote, optionId) {
  if (!auth.isLoggedIn) return alert('请先登录')
  try {
    await api.post(`/votes/${vote.id}/vote`, { optionId })
    await loadVotes()
  } catch (e) { alert(e.message || '投票失败') }
}

function barWidth(vote, opt) {
  const total = vote.options.reduce((s, o) => s + o.voteCount, 0)
  return total > 0 ? `${(opt.voteCount / total * 100).toFixed(1)}%` : '0%'
}

function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN')
}
</script>

<style scoped>
.vote-option {
  position: relative;
  padding: 10px 14px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
}
.vote-option:hover { border-color: #409eff; }
.vote-bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: #ecf5ff;
  transition: width 0.3s;
  z-index: 0;
}
.vote-option-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
}
</style>
