<template>
  <span class="ua-wrap" ref="triggerRef" @click.stop="toggle">
    <img v-if="user.avatar" :src="user.avatar" class="ua-img" :style="sizeStyle" />
    <span v-else class="ua-init" :style="sizeStyle">{{ initial }}</span>
  </span>

  <Teleport to="body">
    <div v-if="open" class="ua-backdrop" @click="close" />
    <div v-if="open" class="ua-popover" :style="popStyle">
      <div class="ua-pop-top">
        <img v-if="user.avatar" :src="user.avatar" class="ua-pop-avatar" />
        <div v-else class="ua-pop-avatar-init">{{ initial }}</div>
        <div class="ua-pop-name">{{ user.username }}</div>
      </div>
      <div class="ua-pop-actions">
        <router-link :to="`/profile/${user.id}`" class="ua-pop-btn" @click="close">查看主页</router-link>
        <template v-if="authStore.isLoggedIn && !isOwn">
          <button
            class="ua-pop-btn"
            :class="{ 'ua-pop-btn-active': isFollowing }"
            :disabled="followLoading"
            @click="toggleFollow"
          >{{ isFollowing ? '已关注' : '关注' }}</button>
          <button class="ua-pop-btn" @click="goMessage">私信</button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const props = defineProps({
  user: { type: Object, required: true },
  size: { type: Number, default: 32 },
})

const authStore = useAuthStore()
const router = useRouter()
const triggerRef = ref(null)
const open = ref(false)
const popStyle = ref({})
const isFollowing = ref(false)
const followLoading = ref(false)

const initial = computed(() => props.user.username?.charAt(0).toUpperCase() || '?')
const isOwn = computed(() => authStore.user && String(props.user.id) === String(authStore.user.id))

const sizeStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
  fontSize: Math.round(props.size * 0.38) + 'px',
}))

async function loadFollowStatus() {
  if (!authStore.isLoggedIn || isOwn.value) return
  try {
    const followers = await api.get(`/users/${props.user.id}/followers`)
    isFollowing.value = Array.isArray(followers) &&
      followers.some(u => String(u.id) === String(authStore.user.id))
  } catch {}
}

function toggle() {
  if (open.value) { close(); return }
  const rect = triggerRef.value.getBoundingClientRect()
  const popW = 200, popH = 140
  let top = rect.bottom + 8
  let left = rect.left

  if (left + popW > window.innerWidth - 12) left = window.innerWidth - popW - 12
  if (left < 12) left = 12
  if (top + popH > window.innerHeight - 12) top = rect.top - popH - 8

  popStyle.value = { top: top + 'px', left: left + 'px' }
  open.value = true
  loadFollowStatus()
}

function close() { open.value = false }

async function toggleFollow() {
  if (followLoading.value) return
  followLoading.value = true
  try {
    if (isFollowing.value) {
      await api.delete(`/users/${props.user.id}/follow`)
      isFollowing.value = false
    } else {
      await api.post(`/users/${props.user.id}/follow`)
      isFollowing.value = true
    }
  } catch (e) { alert(e.message || '操作失败') }
  followLoading.value = false
}

function goMessage() {
  close()
  router.push(`/messages/${props.user.id}`)
}
</script>

<style scoped>
.ua-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
}

.ua-img {
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.ua-init {
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>

<style>
.ua-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
}

.ua-popover {
  position: fixed;
  z-index: 9999;
  width: 200px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: ua-in 0.12s ease;
}

@keyframes ua-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.ua-pop-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ua-pop-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.ua-pop-avatar-init {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ua-pop-name {
  font-size: 14px;
  font-weight: 600;
  color: #111111;
  word-break: break-all;
}

.ua-pop-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ua-pop-btn {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: rgba(0, 0, 0, 0.03);
  color: #555555;
  border: 1px solid #e5e7eb;
  text-decoration: none;
}

.ua-pop-btn:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.2);
}

.ua-pop-btn-active {
  background: rgba(99, 102, 241, 0.1) !important;
  color: #6366f1 !important;
  border-color: rgba(99, 102, 241, 0.25) !important;
}

.ua-pop-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
