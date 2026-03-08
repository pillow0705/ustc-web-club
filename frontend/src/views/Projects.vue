<template>
  <div>
    <div class="flex-between mb-16">
      <h2>项目池</h2>
      <button v-if="auth.isLoggedIn" class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? '取消' : '提交项目' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-16">
      <h3 class="mb-16">提交新项目</h3>
      <form @submit.prevent="createProject">
        <div class="form-group">
          <label>项目名称</label>
          <input v-model="form.title" required />
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" rows="3" required></textarea>
        </div>
        <div class="flex gap-16">
          <div class="form-group" style="flex:1">
            <label>难度</label>
            <select v-model="form.difficulty">
              <option value="beginner">入门</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label>所需人数</label>
            <input v-model.number="form.requiredMembers" type="number" min="1" />
          </div>
        </div>
        <div class="form-group">
          <label>技术栈 (逗号分隔)</label>
          <input v-model="form.techStack" placeholder="Vue, Node.js, MySQL" />
        </div>
        <button type="submit" class="btn btn-primary">提交</button>
      </form>
    </div>

    <div class="flex gap-8 mb-16">
      <select v-model="filter.difficulty" style="width:auto">
        <option value="">全部难度</option>
        <option value="beginner">入门</option>
        <option value="intermediate">中级</option>
        <option value="advanced">高级</option>
      </select>
      <select v-model="filter.status" style="width:auto">
        <option value="">全部状态</option>
        <option value="open">开放</option>
        <option value="in_progress">进行中</option>
        <option value="completed">已完成</option>
      </select>
    </div>

    <div v-if="filteredProjects.length === 0" class="card text-gray">暂无项目</div>
    <div v-for="proj in filteredProjects" :key="proj.id" class="card">
      <div class="flex-between">
        <h3>{{ proj.title }}</h3>
        <span class="tag" :class="difficultyTagClass(proj.difficulty)">{{ difficultyText(proj.difficulty) }}</span>
      </div>
      <p class="text-small text-gray mt-16">
        提交者：{{ proj.creator?.username }} | 需要 {{ proj.requiredMembers }} 人
      </p>
      <p class="mt-16">{{ proj.description }}</p>
      <div class="mt-16 flex-between">
        <div class="flex gap-8">
          <span v-for="tag in techTags(proj.techStack)" :key="tag" class="tag tag-blue">{{ tag }}</span>
        </div>
        <button v-if="auth.isLoggedIn" class="btn btn-small" :class="proj._liked ? 'btn-danger' : 'btn-primary'" @click="toggleLike(proj)">
          {{ proj._liked ? '取消赞' : '点赞' }} ({{ proj.likes }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const projects = ref([])
const showForm = ref(false)
const form = ref({ title: '', description: '', difficulty: 'intermediate', techStack: '', requiredMembers: 2 })
const filter = ref({ difficulty: '', status: '' })

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    if (filter.value.difficulty && p.difficulty !== filter.value.difficulty) return false
    if (filter.value.status && p.status !== filter.value.status) return false
    return true
  })
})

onMounted(loadProjects)

async function loadProjects() {
  try { projects.value = await api.get('/projects') } catch {}
}

async function createProject() {
  try {
    await api.post('/projects', form.value)
    showForm.value = false
    form.value = { title: '', description: '', difficulty: 'intermediate', techStack: '', requiredMembers: 2 }
    await loadProjects()
  } catch (e) { alert(e.message || '创建失败') }
}

async function toggleLike(proj) {
  try {
    const res = await api.post(`/projects/${proj.id}/like`)
    proj._liked = res.liked
    proj.likes += res.liked ? 1 : -1
  } catch (e) { alert(e.message || '操作失败') }
}

function techTags(str) {
  return str ? str.split(',').map(s => s.trim()).filter(Boolean) : []
}
function difficultyText(d) {
  return { beginner: '入门', intermediate: '中级', advanced: '高级' }[d] || d
}
function difficultyTagClass(d) {
  return { beginner: 'tag-green', intermediate: 'tag-orange', advanced: 'tag-red' }[d]
}
</script>
