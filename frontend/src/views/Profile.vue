<template>
  <div v-if="profile">
    <!-- 用户信息卡片 -->
    <div class="card profile-card">
      <div class="flex gap-16">
        <!-- 头像 -->
        <div class="avatar-wrap">
          <img v-if="profile.avatar" :src="profile.avatar" class="avatar-img" />
          <div v-else class="avatar">{{ profile.username?.charAt(0).toUpperCase() }}</div>
          <label v-if="isOwnProfile" class="avatar-upload-btn" title="更换头像">
            📷
            <input type="file" accept="image/*" @change="uploadAvatar" hidden />
          </label>
        </div>
        <div style="flex:1">
          <div class="flex-between">
            <div>
              <h2 class="profile-name">{{ profile.username }}</h2>
              <p class="text-gray text-small">{{ profile.email }}</p>
            </div>
            <div class="flex gap-8" style="align-items:center">
              <span v-if="profile.role === 'admin'" class="tag tag-cyan">管理员</span>
              <template v-if="!isOwnProfile && auth.isLoggedIn">
                <button
                  class="btn btn-small"
                  :class="followStatus ? 'btn-ghost' : 'btn-primary'"
                  @click="toggleFollow"
                >{{ followStatus ? '已关注' : '关注' }}</button>
                <button class="btn btn-small btn-ghost" @click="goToMessage">💬 私信</button>
              </template>
            </div>
          </div>
          <!-- 关注数 / 粉丝数 -->
          <div class="follow-stats mt-8">
            <span class="follow-stat-item">
              <strong>{{ followingCount }}</strong> 关注
            </span>
            <span class="follow-stat-sep">|</span>
            <span class="follow-stat-item">
              <strong>{{ followerCount }}</strong> 粉丝
            </span>
          </div>
          <p class="mt-8 text-secondary" v-if="profile.bio">{{ profile.bio }}</p>
          <a v-if="profile.githubLink" :href="profile.githubLink" target="_blank" class="github-link mt-8">
            <span>⌨</span> GitHub
          </a>
        </div>
        <div class="stats-box">
          <div class="stat-item">
            <strong>{{ profile.contributionPoints }}</strong>
            <span class="text-small text-gray">贡献</span>
          </div>
          <div class="stat-item">
            <strong>{{ profile.participationCount }}</strong>
            <span class="text-small text-gray">参与</span>
          </div>
          <div class="stat-item">
            <strong>{{ myProjects.length }}</strong>
            <span class="text-small text-gray">项目</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料（仅本人） -->
    <div v-if="isOwnProfile" class="card">
      <h3 class="mb-16">编辑资料</h3>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label>个人简介</label>
          <textarea v-model="editForm.bio" rows="2" placeholder="介绍一下你自己..."></textarea>
        </div>
        <div class="form-group">
          <label>GitHub 链接</label>
          <input v-model="editForm.githubLink" placeholder="https://github.com/yourname" />
        </div>
        <button type="submit" class="btn btn-primary">保存</button>
      </form>
    </div>

    <!-- 我创建的项目 -->
    <div class="card">
      <h3 class="section-title">
        {{ isOwnProfile ? '我创建的项目' : `${profile.username} 的项目` }}
        <span class="count-badge">{{ myProjects.length }}</span>
      </h3>
      <div v-if="myProjects.length === 0" class="empty-state">暂无项目</div>
      <div v-for="proj in myProjects" :key="proj.id" class="project-item">
        <div class="flex-between">
          <div class="flex gap-8" style="align-items:center; flex-wrap:wrap">
            <router-link :to="`/projects/${proj.id}`" class="proj-title">{{ proj.title }}</router-link>
            <span class="tag" :class="difficultyTagClass(proj.difficulty)">{{ difficultyText(proj.difficulty) }}</span>
            <span class="tag" :class="statusTagClass(proj.status)">{{ statusText(proj.status) }}</span>
          </div>
          <div v-if="isOwnProfile" class="flex gap-8">
            <button class="btn btn-small btn-ghost" @click="startEdit(proj)">编辑</button>
            <button class="btn btn-small btn-danger" @click="deleteProject(proj)">删除</button>
          </div>
        </div>
        <p class="text-small text-gray mt-8">{{ proj.description }}</p>

        <!-- 编辑表单 -->
        <div v-if="editingProject?.id === proj.id" class="edit-form">
          <div class="form-group">
            <label>项目名称</label>
            <input v-model="editingProject.title" required />
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editingProject.description" rows="2"></textarea>
          </div>
          <div class="flex gap-16">
            <div class="form-group" style="flex:1">
              <label>难度</label>
              <select v-model="editingProject.difficulty">
                <option value="beginner">入门</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label>状态</label>
              <select v-model="editingProject.status">
                <option value="open">开放</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>技术栈 (逗号分隔)</label>
            <input v-model="editingProject.techStack" placeholder="Vue, Node.js, Python" />
          </div>
          <div class="form-group">
            <label>GitHub 链接</label>
            <input v-model="editingProject.githubLink" placeholder="https://github.com/..." />
          </div>
          <div class="flex gap-8">
            <button class="btn btn-primary btn-small" @click="saveProject">保存</button>
            <button class="btn btn-ghost btn-small" @click="editingProject = null">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 我加入的项目 -->
    <div class="card">
      <h3 class="section-title">
        {{ isOwnProfile ? '我加入的项目' : '参与的项目' }}
        <span class="count-badge">{{ joinedProjects.length }}</span>
      </h3>
      <div v-if="joinedProjects.length === 0" class="empty-state">暂未加入任何项目</div>
      <div v-for="proj in joinedProjects" :key="proj.id" class="project-item">
        <div class="flex-between">
          <div class="flex gap-8" style="align-items:center; flex-wrap:wrap">
            <router-link :to="`/projects/${proj.id}`" class="proj-title">{{ proj.title }}</router-link>
            <span class="tag tag-cyan">参与中</span>
          </div>
          <span class="text-muted text-small">by {{ proj.creator?.username }}</span>
        </div>
        <p class="text-small text-gray mt-8">{{ proj.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const profile = ref(null)
const myProjects = ref([])
const joinedProjects = ref([])
const editingProject = ref(null)
const editForm = ref({ bio: '', githubLink: '' })
const followStatus = ref(false)
const followerCount = ref(0)
const followingCount = ref(0)

const isOwnProfile = computed(() => auth.user && String(auth.user.id) === String(route.params.id))

async function loadProfile() {
  try {
    const userId = route.params.id
    profile.value = await api.get(`/users/${userId}`)
    editForm.value = { bio: profile.value.bio || '', githubLink: profile.value.githubLink || '' }
    myProjects.value = await api.get(`/users/${userId}/projects`)
    joinedProjects.value = await api.get(`/users/${userId}/joined-projects`)

    // 获取粉丝列表，同时判断当前用户是否已关注
    try {
      const followers = await api.get(`/users/${userId}/followers`)
      followerCount.value = Array.isArray(followers) ? followers.length : 0
      if (auth.isLoggedIn && auth.user) {
        followStatus.value = Array.isArray(followers) && followers.some(u => String(u.id) === String(auth.user.id))
      }
    } catch {}

    // 获取关注列表
    try {
      const following = await api.get(`/users/${userId}/following`)
      followingCount.value = Array.isArray(following) ? following.length : 0
    } catch {}
  } catch {}
}

async function toggleFollow() {
  const userId = route.params.id
  try {
    if (followStatus.value) {
      await api.delete(`/users/${userId}/follow`)
      followerCount.value = Math.max(0, followerCount.value - 1)
      followStatus.value = false
    } else {
      await api.post(`/users/${userId}/follow`)
      followerCount.value += 1
      followStatus.value = true
    }
  } catch (e) { alert(e.message || '操作失败') }
}

function goToMessage() {
  router.push(`/messages/${route.params.id}`)
}

async function updateProfile() {
  try {
    await api.put('/users/profile', editForm.value)
    await loadProfile()
    alert('保存成功')
  } catch (e) { alert(e.message || '保存失败') }
}

async function uploadAvatar(e) {
  const file = e.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('avatar', file)
  try {
    const res = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    profile.value.avatar = res.avatar
    alert('头像更新成功')
  } catch (e) { alert(e.message || '上传失败') }
}

function startEdit(proj) {
  editingProject.value = { ...proj }
}

async function saveProject() {
  try {
    await api.put(`/projects/${editingProject.value.id}`, {
      title: editingProject.value.title,
      description: editingProject.value.description,
      difficulty: editingProject.value.difficulty,
      status: editingProject.value.status,
      techStack: editingProject.value.techStack,
      githubLink: editingProject.value.githubLink,
    })
    editingProject.value = null
    await loadProfile()
  } catch (e) { alert(e.message || '更新失败') }
}

async function deleteProject(proj) {
  if (!confirm(`确定删除项目「${proj.title}」？`)) return
  try {
    await api.delete(`/projects/${proj.id}`)
    myProjects.value = myProjects.value.filter(p => p.id !== proj.id)
  } catch (e) { alert(e.message || '删除失败') }
}

function difficultyText(d) { return { beginner: '入门', intermediate: '中级', advanced: '高级' }[d] || d }
function difficultyTagClass(d) { return { beginner: 'tag-green', intermediate: 'tag-orange', advanced: 'tag-red' }[d] }
function statusText(s) { return { open: '开放', in_progress: '进行中', completed: '已完成' }[s] || s }
function statusTagClass(s) { return { open: 'tag-blue', in_progress: 'tag-green', completed: 'tag-orange' }[s] }

onMounted(loadProfile)
watch(() => route.params.id, loadProfile)
</script>

<style scoped>
.profile-name { font-size: 22px; font-family: Georgia, serif; font-weight: 400; }
.follow-stats { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); }
.follow-stat-item strong { color: var(--text-primary); font-weight: 700; margin-right: 3px; }
.follow-stat-sep { color: var(--border); }
.github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: 3px 12px;
  transition: border-color 0.2s, color 0.2s;
}
.github-link:hover { border-color: var(--accent); color: var(--accent); }

.stats-box { display: flex; gap: 20px; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-item strong { font-size: 20px; font-weight: 800; }

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
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
.empty-state { text-align: center; padding: 24px; color: var(--text-muted); font-size: 14px; }

.project-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
.project-item:last-child { border-bottom: none; }
.proj-title {
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.2s;
}
.proj-title:hover { color: var(--accent); }

.edit-form {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: 10px;
  margin-top: 12px;
}

.avatar-wrap { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
.avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 700;
}
.avatar-img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; }
.avatar-upload-btn {
  position: absolute; bottom: 0; right: 0;
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: 50%; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; cursor: pointer;
  transition: border-color 0.2s;
}
.avatar-upload-btn:hover { border-color: var(--accent); }
</style>
