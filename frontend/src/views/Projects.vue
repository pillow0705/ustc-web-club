<template>
  <div>
    <div class="flex-between mb-16">
      <h2 class="page-title-serif">项目池</h2>
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
          <label>GitHub 链接（可选）</label>
          <input v-model="form.githubLink" placeholder="https://github.com/..." />
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
        <div class="flex gap-8">
          <router-link :to="`/projects/${proj.id}`" class="btn btn-ghost btn-small">详情 →</router-link>
          <button class="btn btn-small btn-ghost" @click="toggleComments(proj)">
            💬 {{ commentCounts[proj.id] || 0 }}
          </button>
          <button v-if="auth.isLoggedIn" class="btn btn-small" :class="proj._liked ? 'btn-danger' : 'btn-primary'" @click="toggleLike(proj)">
            {{ proj._liked ? '取消赞' : '点赞' }} ({{ proj.likes }})
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div v-if="openComments[proj.id]" class="comment-section mt-16">
        <!-- 发表评论 -->
        <div v-if="auth.isLoggedIn" class="flex gap-8 mb-16">
          <input v-model="newComment[proj.id]" placeholder="写下你的评论..." style="flex:1" @keyup.enter="postComment(proj.id)" />
          <button class="btn btn-small btn-primary" @click="postComment(proj.id)">发送</button>
        </div>
        <!-- 评论列表 -->
        <div v-if="comments[proj.id]?.length === 0" class="text-gray text-small">暂无评论</div>
        <div v-for="c in comments[proj.id]" :key="c.id" class="comment-item">
          <div class="flex-between">
            <div class="flex gap-8" style="align-items:center">
              <img v-if="c.author?.avatar" :src="c.author.avatar" class="comment-avatar" />
              <div v-else class="comment-avatar-placeholder">{{ c.author?.username?.charAt(0).toUpperCase() }}</div>
              <strong class="text-small">{{ c.author?.username }}</strong>
              <span class="text-gray text-small">{{ formatDate(c.createdAt) }}</span>
            </div>
            <button v-if="auth.user?.id === c.userId" class="btn btn-small btn-danger" @click="deleteComment(proj.id, c.id)">删除</button>
          </div>
          <p class="text-small mt-8" style="padding-left:36px">{{ c.content }}</p>
        </div>
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
const form = ref({ title: '', description: '', difficulty: 'intermediate', githubLink: '', requiredMembers: 2 })
const filter = ref({ difficulty: '', status: '' })
const comments = ref({})
const openComments = ref({})
const newComment = ref({})
const commentCounts = ref({})

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    if (filter.value.difficulty && p.difficulty !== filter.value.difficulty) return false
    if (filter.value.status && p.status !== filter.value.status) return false
    return true
  })
})

onMounted(loadProjects)

async function loadProjects() {
  try {
    projects.value = await api.get('/projects')
    // 加载每个项目的评论数
    for (const proj of projects.value) {
      try {
        const cs = await api.get(`/comments/${proj.id}`)
        commentCounts.value[proj.id] = cs.length
      } catch {}
    }
  } catch {}
}

async function toggleComments(proj) {
  openComments.value[proj.id] = !openComments.value[proj.id]
  if (openComments.value[proj.id] && !comments.value[proj.id]) {
    try {
      comments.value[proj.id] = await api.get(`/comments/${proj.id}`)
    } catch {}
  }
}

async function postComment(projectId) {
  const content = newComment.value[projectId]
  if (!content?.trim()) return
  try {
    const c = await api.post(`/comments/${projectId}`, { content })
    comments.value[projectId] = [c, ...(comments.value[projectId] || [])]
    commentCounts.value[projectId] = (commentCounts.value[projectId] || 0) + 1
    newComment.value[projectId] = ''
  } catch (e) { alert(e.message || '评论失败') }
}

async function deleteComment(projectId, commentId) {
  try {
    await api.delete(`/comments/${commentId}`)
    comments.value[projectId] = comments.value[projectId].filter(c => c.id !== commentId)
    commentCounts.value[projectId]--
  } catch (e) { alert(e.message || '删除失败') }
}

function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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

<style scoped>
.page-title-serif { font-family: Georgia, serif; font-size: 24px; font-weight: 400; }
.comment-section { border-top: 1px solid var(--border); padding-top: 16px; }
.comment-item { padding: 10px 0; border-bottom: 1px solid var(--border); }
.comment-item:last-child { border-bottom: none; }
.comment-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.comment-avatar-placeholder {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600;
}
</style>
