<template>
  <div>
    <div v-if="loading" class="text-center text-gray" style="padding:60px">加载中...</div>
    <div v-else-if="!project" class="card text-center" style="padding:60px">
      <p style="font-size:32px;margin-bottom:12px">🔍</p>
      <p class="text-gray">项目不存在或加载失败</p>
      <router-link to="/projects" class="btn btn-ghost btn-small" style="margin-top:16px">返回项目池</router-link>
    </div>

    <template v-else>
      <!-- 返回 -->
      <router-link to="/projects" class="back-link">← 返回项目池</router-link>

      <!-- 项目主信息 -->
      <div class="card project-hero">
        <div class="flex-between">
          <div class="flex gap-8">
            <span class="tag" :class="difficultyTagClass(project.difficulty)">{{ difficultyText(project.difficulty) }}</span>
            <span class="tag" :class="statusTagClass(project.status)">{{ statusText(project.status) }}</span>
          </div>
          <span class="text-muted text-small">{{ formatDate(project.createdAt) }}</span>
        </div>

        <h1 class="project-title">{{ project.title }}</h1>

        <p class="project-desc">{{ project.description }}</p>

        <div class="project-meta">
          <div class="meta-item">
            <span class="meta-label">提交者</span>
            <router-link :to="`/profile/${project.creator?.id}`" class="meta-val link">
              {{ project.creator?.username }}
            </router-link>
          </div>
          <div class="meta-item">
            <span class="meta-label">所需人数</span>
            <span class="meta-val">{{ project.requiredMembers }} 人</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">点赞数</span>
            <span class="meta-val">{{ project.likes }}</span>
          </div>
        </div>

        <!-- 技术栈 -->
        <div v-if="techTags.length" class="mt-16 flex gap-8 flex-wrap">
          <span v-for="tag in techTags" :key="tag" class="tag tag-blue">{{ tag }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-16 flex gap-8">
          <button
            v-if="auth.isLoggedIn"
            class="btn"
            :class="project._liked ? 'btn-danger' : 'btn-primary'"
            @click="toggleLike"
          >
            {{ project._liked ? '取消赞' : '👍 点赞' }} ({{ project.likes }})
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="card">
        <h3 class="mb-16">评论 <span class="comment-count">{{ comments.length }}</span></h3>

        <!-- 发表评论 -->
        <div v-if="auth.isLoggedIn" class="comment-input-row mb-16">
          <div class="commenter-avatar">{{ auth.user?.username?.charAt(0).toUpperCase() }}</div>
          <input
            v-model="newComment"
            class="comment-input"
            placeholder="写下你的想法..."
            @keyup.enter="postComment"
          />
          <button class="btn btn-primary btn-small" @click="postComment">发送</button>
        </div>
        <div v-else class="text-gray text-small mb-16">
          <router-link to="/login">登录</router-link> 后发表评论
        </div>

        <!-- 评论列表 -->
        <div v-if="comments.length === 0" class="empty-comments">暂无评论，来抢沙发吧！</div>
        <div v-for="c in comments" :key="c.id" class="comment-item">
          <div class="comment-header">
            <div class="flex gap-8" style="align-items:center">
              <img v-if="c.author?.avatar" :src="c.author.avatar" class="c-avatar" />
              <div v-else class="c-avatar c-avatar-placeholder">{{ c.author?.username?.charAt(0).toUpperCase() }}</div>
              <strong class="text-small">{{ c.author?.username }}</strong>
              <span class="text-muted text-small">{{ formatDate(c.createdAt) }}</span>
            </div>
            <button
              v-if="auth.user?.id === c.userId || auth.isAdmin"
              class="btn btn-small btn-danger"
              @click="deleteComment(c.id)"
            >删除</button>
          </div>
          <p class="comment-body">{{ c.content }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()
const project = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)

const techTags = computed(() => {
  if (!project.value?.techStack) return []
  return project.value.techStack.split(',').map(s => s.trim()).filter(Boolean)
})

onMounted(async () => {
  loading.value = true
  try {
    project.value = await api.get(`/projects/${route.params.id}`)
    comments.value = await api.get(`/comments/${route.params.id}`)
  } catch {}
  loading.value = false
})

async function toggleLike() {
  try {
    const res = await api.post(`/projects/${project.value.id}/like`)
    project.value._liked = res.liked
    project.value.likes += res.liked ? 1 : -1
  } catch (e) { alert(e.message || '操作失败') }
}

async function postComment() {
  if (!newComment.value?.trim()) return
  try {
    const c = await api.post(`/comments/${route.params.id}`, { content: newComment.value })
    comments.value = [c, ...comments.value]
    newComment.value = ''
  } catch (e) { alert(e.message || '评论失败') }
}

async function deleteComment(commentId) {
  try {
    await api.delete(`/comments/${commentId}`)
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (e) { alert(e.message || '删除失败') }
}

function difficultyText(d) {
  return { beginner: '入门', intermediate: '中级', advanced: '高级' }[d] || d
}
function difficultyTagClass(d) {
  return { beginner: 'tag-green', intermediate: 'tag-orange', advanced: 'tag-red' }[d]
}
function statusText(s) {
  return { open: '开放招募', in_progress: '进行中', completed: '已完成' }[s] || s
}
function statusTagClass(s) {
  return { open: 'tag-blue', in_progress: 'tag-green', completed: 'tag-orange' }[s]
}
function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 20px;
  transition: color 0.2s;
}
.back-link:hover { color: var(--text-primary); }

.project-hero { padding: 32px; }
.project-title { font-size: 28px; font-weight: 800; margin: 16px 0 12px; }
.project-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.7; }

.project-meta {
  display: flex;
  gap: 32px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
.meta-item { display: flex; flex-direction: column; gap: 4px; }
.meta-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.meta-val { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.meta-val.link { color: var(--accent); }
.meta-val.link:hover { color: #a5b4fc; }

/* Comment */
.comment-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: rgba(99,102,241,0.15);
  color: #a5b4fc;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 6px;
}

.comment-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.commenter-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.comment-input {
  flex: 1;
  margin-bottom: 0;
}

.empty-comments {
  text-align: center;
  padding: 32px;
  color: var(--text-muted);
  font-size: 14px;
}

.comment-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.comment-item:last-child { border-bottom: none; }
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.comment-body {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 40px;
}
.c-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.c-avatar-placeholder {
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}
</style>
