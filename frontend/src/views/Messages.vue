<template>
  <div class="messages-layout">
    <!-- 左侧：对话列表 -->
    <div class="conversations-panel">
      <div class="panel-header">
        <h3>私信</h3>
      </div>
      <div v-if="conversations.length === 0" class="empty-conv">暂无对话</div>
      <div
        v-for="conv in conversations"
        :key="conv.userId"
        class="conv-item"
        :class="{ active: String(currentUserId) === String(conv.userId) }"
        @click="openConversation(conv.userId)"
      >
        <div class="conv-avatar">
          <img v-if="conv.avatar" :src="conv.avatar" class="conv-avatar-img" />
          <div v-else class="conv-avatar-placeholder">{{ conv.username?.charAt(0).toUpperCase() }}</div>
          <span v-if="conv.unread > 0" class="unread-badge">{{ conv.unread }}</span>
        </div>
        <div class="conv-info">
          <div class="conv-name">{{ conv.username }}</div>
          <div class="conv-preview">{{ conv.lastMessage }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧：消息内容 -->
    <div class="thread-panel">
      <template v-if="currentUserId">
        <!-- 顶部信息栏 -->
        <div class="thread-header">
          <span class="thread-name">{{ currentUsername }}</span>
        </div>

        <!-- 消息列表 -->
        <div class="messages-list" ref="messagesListRef">
          <div v-if="messages.length === 0" class="empty-thread">暂无消息，发一条吧</div>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="msg-row"
            :class="{ 'msg-self': String(msg.senderId) === String(auth.user?.id) }"
          >
            <div class="msg-bubble">{{ msg.content }}</div>
            <div class="msg-time">{{ formatTime(msg.createdAt) }}</div>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="input-area">
          <input
            v-model="inputText"
            placeholder="输入消息..."
            @keydown.enter.prevent="sendMessage"
          />
          <button class="btn btn-primary btn-small send-btn" @click="sendMessage">发送</button>
        </div>
      </template>

      <div v-else class="no-conv-selected">
        <div class="no-conv-icon">💬</div>
        <p>选择一个对话开始聊天</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const conversations = ref([])
const messages = ref([])
const inputText = ref('')
const messagesListRef = ref(null)

const currentUserId = computed(() => route.params.userId || null)
const currentUsername = computed(() => {
  const conv = conversations.value.find(c => String(c.userId) === String(currentUserId.value))
  return conv?.username || '对话'
})

async function loadConversations() {
  try {
    const data = await api.get('/messages')
    conversations.value = Array.isArray(data) ? data : []
  } catch {}
}

async function loadMessages(userId) {
  try {
    const data = await api.get(`/messages/${userId}`)
    messages.value = Array.isArray(data) ? data : []
    await nextTick()
    scrollToBottom()
    api.put(`/messages/${userId}/read`).then(() => loadConversations()).catch(() => {})
  } catch {}
}

function scrollToBottom() {
  if (messagesListRef.value) {
    messagesListRef.value.scrollTop = messagesListRef.value.scrollHeight
  }
}

async function sendMessage() {
  const content = inputText.value.trim()
  if (!content || !currentUserId.value) return
  try {
    await api.post(`/messages/${currentUserId.value}`, { content })
    inputText.value = ''
    await loadMessages(currentUserId.value)
    await loadConversations()
  } catch (e) { alert(e.message || '发送失败') }
}

function openConversation(userId) {
  router.push(`/messages/${userId}`)
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

onMounted(async () => {
  await loadConversations()
  if (currentUserId.value) {
    await loadMessages(currentUserId.value)
  }
})

watch(currentUserId, async (newId) => {
  if (newId) {
    await loadMessages(newId)
  } else {
    messages.value = []
  }
})
</script>

<style scoped>
.messages-layout {
  display: flex;
  height: calc(100vh - 64px);
  margin: -32px -24px;
  overflow: hidden;
}

/* 左侧对话列表 */
.conversations-panel {
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.panel-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-conv {
  padding: 32px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.conv-item:hover { background: var(--bg-card-hover); }
.conv-item.active { background: rgba(217, 119, 87, 0.06); border-left: 2px solid var(--accent); }

.conv-avatar { position: relative; flex-shrink: 0; }
.conv-avatar-img {
  width: 40px; height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.conv-avatar-placeholder {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: #fff;
}
.unread-badge {
  position: absolute;
  top: -2px; right: -4px;
  background: var(--accent-red);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
}

.conv-info { flex: 1; min-width: 0; }
.conv-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.conv-preview {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

/* 右侧消息区域 */
.thread-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
}

.thread-header {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}
.thread-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-thread {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  margin: auto;
}

.msg-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 70%;
}
.msg-row.msg-self {
  align-items: flex-end;
  align-self: flex-end;
}

.msg-bubble {
  padding: 9px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  background: #f0f0f0;
  color: #111111;
  border: 1px solid #e5e7eb;
}
.msg-row.msg-self .msg-bubble {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
}

.msg-time {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
  padding: 0 4px;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-surface);
}
.input-area input {
  flex: 1;
  margin-bottom: 0;
}
.send-btn { flex-shrink: 0; }

/* 未选中状态 */
.no-conv-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 12px;
}
.no-conv-icon { font-size: 48px; opacity: 0.4; }
.no-conv-selected p { font-size: 15px; }
</style>
