<template>
  <div>
    <div v-if="loading" class="text-center text-gray" style="padding:60px">加载中...</div>
    <div v-else-if="!project" class="card text-center" style="padding:60px">
      <p style="font-size:32px;margin-bottom:12px">🔍</p>
      <p class="text-gray">项目不存在或加载失败</p>
      <router-link to="/projects" class="btn btn-ghost btn-small" style="margin-top:16px">返回项目池</router-link>
    </div>

    <template v-else>
      <router-link to="/projects" class="back-link">← 返回项目池</router-link>

      <!-- 项目主信息 -->
      <div class="card project-hero">
        <div class="flex-between mb-8">
          <div class="flex gap-8">
            <span class="tag" :class="difficultyTagClass(project.difficulty)">{{ difficultyText(project.difficulty) }}</span>
            <span class="tag" :class="statusTagClass(project.status)">{{ statusText(project.status) }}</span>
          </div>
          <span class="text-muted text-small">{{ formatDate(project.createdAt) }}</span>
        </div>

        <h1 class="project-title">{{ project.title }}</h1>
        <p class="project-desc">{{ project.description }}</p>

        <!-- Meta 信息 -->
        <div class="project-meta">
          <div class="meta-item">
            <span class="meta-label">发起人</span>
            <router-link :to="`/profile/${project.creator?.id}`" class="meta-val link">
              {{ project.creator?.username }}
            </router-link>
          </div>
          <div class="meta-item">
            <span class="meta-label">所需人数</span>
            <span class="meta-val">{{ project.requiredMembers }} 人</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">当前成员</span>
            <span class="meta-val">{{ memberCount }} 人</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">点赞</span>
            <span class="meta-val">{{ project.likes }}</span>
          </div>
        </div>

        <!-- 技术栈 -->
        <div v-if="techTags.length" class="mt-16 flex gap-8 flex-wrap">
          <span v-for="tag in techTags" :key="tag" class="tag tag-blue">{{ tag }}</span>
        </div>

        <!-- GitHub 链接 -->
        <a v-if="project.githubLink" :href="project.githubLink" target="_blank" class="github-link mt-16">
          <span>⌨</span> 查看 GitHub 仓库
        </a>

        <!-- 操作按钮区 -->
        <div class="action-row mt-16" v-if="auth.isLoggedIn">
          <!-- 点赞 -->
          <button class="btn" :class="project._liked ? 'btn-danger' : 'btn-ghost'" @click="toggleLike">
            {{ project._liked ? '取消赞' : '👍 点赞' }} ({{ project.likes }})
          </button>

          <!-- 加入/退出（非创建者） -->
          <template v-if="!isCreator">
            <button v-if="!hasJoined" class="btn btn-primary" @click="joinProject">
              加入项目
            </button>
            <button v-else class="btn btn-ghost" @click="leaveProject">
              退出项目
            </button>
          </template>
          <span v-else class="creator-badge">你是创建者</span>

          <!-- 编辑/删除（创建者或管理员） -->
          <template v-if="isCreator || auth.isAdmin">
            <button class="btn btn-ghost" @click="showEditForm = !showEditForm">编辑</button>
            <button class="btn btn-danger" @click="deleteProject">删除</button>
          </template>
        </div>

        <!-- 编辑表单 -->
        <div v-if="showEditForm" class="edit-form mt-16">
          <h4 class="mb-16">编辑项目</h4>
          <div class="form-group">
            <label>项目名称</label>
            <input v-model="editData.title" />
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editData.description" rows="3"></textarea>
          </div>
          <div class="flex gap-16">
            <div class="form-group" style="flex:1">
              <label>难度</label>
              <select v-model="editData.difficulty">
                <option value="beginner">入门</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label>状态</label>
              <select v-model="editData.status">
                <option value="open">开放招募</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label>所需人数</label>
              <input v-model.number="editData.requiredMembers" type="number" min="1" />
            </div>
          </div>
          <div class="form-group">
            <label>技术栈 (逗号分隔)</label>
            <input v-model="editData.techStack" placeholder="Vue, Node.js, Python" />
          </div>
          <div class="form-group">
            <label>GitHub 链接</label>
            <input v-model="editData.githubLink" placeholder="https://github.com/..." />
          </div>
          <div class="flex gap-8">
            <button class="btn btn-primary btn-small" @click="saveProject">保存</button>
            <button class="btn btn-ghost btn-small" @click="showEditForm = false">取消</button>
          </div>
        </div>
      </div>

      <!-- 成员列表 -->
      <div class="card">
        <h3 class="section-title">
          项目成员
          <span class="count-badge">{{ memberCount }}</span>
        </h3>

        <div class="members-grid">
          <!-- 创建者 -->
          <div class="member-card creator">
            <UserAvatar :user="project.creator" :size="48" style="margin: 0 auto 8px" />
            <div class="member-name">{{ project.creator?.username }}</div>
            <div class="member-role">创建者</div>
          </div>
          <!-- 成员 -->
          <div v-for="m in project.members" :key="m.id" class="member-card">
            <UserAvatar :user="m" :size="48" style="margin: 0 auto 8px" />
            <div class="member-name">{{ m.username }}</div>
            <div class="member-role">成员</div>
          </div>

          <!-- 空位 -->
          <div
            v-for="i in emptySlots"
            :key="`empty-${i}`"
            class="member-card empty"
          >
            <div class="member-avatar empty-avatar">+</div>
            <div class="member-role">待加入</div>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="card">
        <h3 class="section-title">
          评论
          <span class="count-badge">{{ comments.length }}</span>
        </h3>

        <div v-if="auth.isLoggedIn" class="comment-input-row mb-16">
          <div class="commenter-avatar">{{ auth.user?.username?.charAt(0).toUpperCase() }}</div>
          <input v-model="newComment" class="comment-input" placeholder="写下你的想法..." @keyup.enter="postComment" />
          <button class="btn btn-primary btn-small" @click="postComment">发送</button>
        </div>
        <div v-else class="text-gray text-small mb-16">
          <router-link to="/login">登录</router-link> 后发表评论
        </div>

        <div v-if="comments.length === 0" class="empty-state">暂无评论，来抢沙发吧！</div>
        <div v-for="c in comments" :key="c.id" class="comment-item">
          <div class="comment-header">
            <div class="flex gap-8" style="align-items:center">
              <UserAvatar v-if="c.author" :user="c.author" :size="28" />
              <strong class="text-small">{{ c.author?.username }}</strong>
              <span class="text-muted text-small">{{ formatDate(c.createdAt) }}</span>
            </div>
            <button v-if="auth.user?.id === c.userId || auth.isAdmin" class="btn btn-small btn-danger" @click="deleteComment(c.id)">删除</button>
          </div>
          <p class="comment-body">{{ c.content }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import UserAvatar from '../components/UserAvatar.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const project = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const showEditForm = ref(false)
const editData = ref({})

const isCreator = computed(() => auth.user && project.value && String(auth.user.id) === String(project.value.creatorId))
const hasJoined = computed(() => project.value?.members?.some(m => String(m.id) === String(auth.user?.id)))
const techTags = computed(() => project.value?.techStack ? project.value.techStack.split(',').map(s => s.trim()).filter(Boolean) : [])
const memberCount = computed(() => 1 + (project.value?.members?.length || 0)) // 创建者 + 成员
const emptySlots = computed(() => {
  const filled = memberCount.value
  const needed = project.value?.requiredMembers || 0
  return Math.max(0, needed - filled)
})

onMounted(async () => {
  loading.value = true
  try {
    project.value = await api.get(`/projects/${route.params.id}`)
    comments.value = await api.get(`/comments/${route.params.id}`)
    editData.value = { ...project.value }
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

async function joinProject() {
  try {
    await api.post(`/projects/${project.value.id}/join`)
    project.value = await api.get(`/projects/${project.value.id}`)
  } catch (e) { alert(e.message || '加入失败') }
}

async function leaveProject() {
  try {
    await api.delete(`/projects/${project.value.id}/join`)
    project.value = await api.get(`/projects/${project.value.id}`)
  } catch (e) { alert(e.message || '退出失败') }
}

async function saveProject() {
  try {
    await api.put(`/projects/${project.value.id}`, editData.value)
    project.value = await api.get(`/projects/${project.value.id}`)
    showEditForm.value = false
  } catch (e) { alert(e.message || '保存失败') }
}

async function deleteProject() {
  if (!confirm(`确定删除项目「${project.value.title}」？`)) return
  try {
    await api.delete(`/projects/${project.value.id}`)
    router.push('/projects')
  } catch (e) { alert(e.message || '删除失败') }
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

function difficultyText(d) { return { beginner: '入门', intermediate: '中级', advanced: '高级' }[d] || d }
function difficultyTagClass(d) { return { beginner: 'tag-green', intermediate: 'tag-orange', advanced: 'tag-red' }[d] }
function statusText(s) { return { open: '开放招募', in_progress: '进行中', completed: '已完成' }[s] || s }
function statusTagClass(s) { return { open: 'tag-blue', in_progress: 'tag-green', completed: 'tag-orange' }[s] }
function formatDate(d) { return new Date(d).toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }
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
.project-title { font-size: 28px; font-family: Georgia, serif; font-weight: 400; margin: 12px 0; }
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
.meta-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.meta-val { font-size: 15px; font-weight: 600; }
.meta-val.link { color: var(--accent); }
.meta-val.link:hover { color: var(--accent); }

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: 4px 14px;
  transition: border-color 0.2s, color 0.2s;
}
.github-link:hover { border-color: var(--accent); color: var(--accent); }

.action-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.creator-badge {
  font-size: 13px;
  color: var(--text-muted);
  padding: 4px 12px;
  border: 1px dashed var(--border);
  border-radius: 9999px;
}

.edit-form {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 20px;
  border-radius: 12px;
}
.edit-form h4 { font-size: 15px; font-weight: 600; }

/* Members */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
}
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: rgba(217, 119, 87, 0.15);
  color: var(--accent);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}
.members-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  min-width: 88px;
  transition: border-color 0.2s;
  text-decoration: none;
  cursor: pointer;
}
.member-card:hover { border-color: var(--border-accent); }
.member-card.creator { border-color: rgba(245, 158, 11, 0.3); }
.member-card.empty { cursor: default; opacity: 0.4; }
.member-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700;
}
.empty-avatar { background: var(--bg-card); color: var(--text-muted); border: 2px dashed var(--border); }
.member-avatar-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.member-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.member-role { font-size: 11px; color: var(--text-muted); }

/* Comments */
.comment-input-row { display: flex; gap: 10px; align-items: center; }
.commenter-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.comment-input { flex: 1; margin-bottom: 0; }
.empty-state { text-align: center; padding: 32px; color: var(--text-muted); font-size: 14px; }
.comment-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
.comment-item:last-child { border-bottom: none; }
.comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.comment-body { font-size: 14px; color: var(--text-secondary); line-height: 1.6; padding-left: 40px; }
.c-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.c-avatar-placeholder {
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}
</style>
