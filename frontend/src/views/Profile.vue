<template>
  <div v-if="profile">
    <div class="card">
      <div class="flex gap-16">
        <div class="avatar">{{ profile.username?.charAt(0).toUpperCase() }}</div>
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

function techTags(str) {
  return str ? str.split(',').map(s => s.trim()).filter(Boolean) : []
}

onMounted(loadProfile)
watch(() => route.params.id, loadProfile)
</script>

<style scoped>
.avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: #409eff; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700;
}
.stats-box {
  display: flex; gap: 24px; text-align: center;
}
</style>
