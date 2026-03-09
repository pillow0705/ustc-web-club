<template>
  <div v-if="profile">
    <!-- 用户信息卡片 -->
    <div class="card">
      <div class="flex gap-16">
        <!-- 头像区域 -->
        <div class="avatar-wrap">
          <img v-if="profile.avatar" :src="profile.avatar" class="avatar-img" />
          <div v-else class="avatar">{{ profile.username?.charAt(0).toUpperCase() }}</div>
          <!-- 仅本人可更换头像 -->
          <label v-if="isOwnProfile" class="avatar-upload-btn" title="更换头像">
            📷
            <input type="file" accept="image/*" @change="uploadAvatar" hidden />
          </label>
        </div>
        <div style="flex:1">
          <h2>{{ profile.username }}</h2>
          <p class="text-gray text-small">{{ profile.email }}</p>
          <p class="mt-16" v-if="profile.bio">{{ profile.bio }}</p>
          <div class="mt-16 flex gap-8" v-if="profile.techStack">
            <span v-for="tag in techTags(profile.techStack)" :key="tag" class="tag tag-blue">{{ tag }}</span>
          </div>
          <a v-if="profile.githubLink" :href="profile.githubLink" target="_blank" class="mt-16" style="display:inline-block">
            GitHub
          </a>
        </div>
        <div class="stats-box">
          <div><strong>{{ profile.contributionPoints }}</strong><br><span class="text-small text-gray">贡献</span></div>
          <div><strong>{{ profile.participationCount }}</strong><br><span class="text-small text-gray">参与</span></div>
        </div>
      </div>
    </div>

    <!-- 编辑资料（仅本人） -->
    <div v-if="isOwnProfile" class="card mt-16">
      <h3 class="mb-16">编辑资料</h3>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label>个人简介</label>
          <textarea v-model="editForm.bio" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>技术栈 (逗号分隔)</label>
          <input v-model="editForm.techStack" placeholder="Vue, React, Python" />
        </div>
        <div class="form-group">
          <label>GitHub 链接</label>
          <input v-model="editForm.githubLink" placeholder="https://github.com/..." />
        </div>
        <button type="submit" class="btn btn-primary">保存</button>
      </form>
    </div>

    <!-- 我的项目（仅本人） -->
    <div v-if="isOwnProfile" class="card mt-16">
      <h3 class="mb-16">我的项目</h3>
      <div v-if="myProjects.length === 0" class="text-gray text-small">暂无项目</div>
      <div v-for="proj in myProjects" :key="proj.id" class="project-item">
        <div class="flex-between">
          <div>
            <strong>{{ proj.title }}</strong>
            <span class="tag ml-8" :class="difficultyTagClass(proj.difficulty)">{{ difficultyText(proj.difficulty) }}</span>
            <span class="tag ml-8" :class="statusTagClass(proj.status)">{{ statusText(proj.status) }}</span>
          </div>
          <button class="btn btn-small btn-primary" @click="startEdit(proj)">编辑</button>
        </div>
        <p class="text-small text-gray mt-8">{{ proj.description }}</p>

        <!-- 编辑表单 -->
        <div v-if="editingProject && editingProject.id === proj.id" class="edit-form mt-8">
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
            <input v-model="editingProject.techStack" />
          </div>
          <div class="flex gap-8">
            <button class="btn btn-primary btn-small" @click="saveProject">保存</button>
            <button class="btn btn-small" @click="editingProject = null">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()
const profile = ref(null)
const myProjects = ref([])
const editingProject = ref(null)
const editForm = ref({ bio: '', techStack: '', githubLink: '' })

const isOwnProfile = computed(() => auth.user && String(auth.user.id) === String(route.params.id))

async function loadProfile() {
  try {
    profile.value = await api.get(`/users/${route.params.id}`)
    if (isOwnProfile.value) {
      editForm.value = {
        bio: profile.value.bio || '',
        techStack: profile.value.techStack || '',
        githubLink: profile.value.githubLink || '',
      }
      // 加载我的项目
      myProjects.value = await api.get(`/users/${route.params.id}/projects`)
    }
  } catch {}
}

async function updateProfile() {
  try {
    await api.put('/users/profile', editForm.value)
    await loadProfile()
    alert('保存成功')
  } catch (e) { alert(e.message || '保存失败') }
}

// 上传头像
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

// 开始编辑项目
function startEdit(proj) {
  editingProject.value = { ...proj }
}

// 保存项目编辑
async function saveProject() {
  try {
    await api.put(`/projects/${editingProject.value.id}`, {
      title: editingProject.value.title,
      description: editingProject.value.description,
      difficulty: editingProject.value.difficulty,
      status: editingProject.value.status,
      techStack: editingProject.value.techStack,
    })
    editingProject.value = null
    await loadProfile()
    alert('项目更新成功')
  } catch (e) { alert(e.message || '更新失败') }
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
function statusText(s) {
  return { open: '开放', in_progress: '进行中', completed: '已完成' }[s] || s
}
function statusTagClass(s) {
  return { open: 'tag-blue', in_progress: 'tag-green', completed: 'tag-orange' }[s]
}

onMounted(loadProfile)
watch(() => route.params.id, loadProfile)
</script>

<style scoped>
.avatar-wrap { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
.avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: #409eff; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700;
}
.avatar-img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
.avatar-upload-btn {
  position: absolute; bottom: 0; right: 0;
  background: #fff; border-radius: 50%;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.stats-box { display: flex; gap: 24px; text-align: center; }
.project-item {
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}
.project-item:last-child { border-bottom: none; }
.edit-form { background: #f9f9f9; padding: 12px; border-radius: 8px; }
.ml-8 { margin-left: 8px; }
</style>
