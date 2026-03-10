<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge">🚀 USTC · 氛围编程</div>
      <h1 class="hero-title">
        在科大，用 AI 工具<br />
        <span class="gradient-text">构建改变世界的产品</span>
      </h1>
      <p class="hero-sub">
        Vibe Club 是中科大的开放编程社区，无论你是零基础还是资深开发者，<br />
        我们用 Cursor、Copilot 等 AI 工具一起做出真实可用的 Agent 系统和软件产品。
      </p>
      <div class="hero-actions">
        <router-link to="/register" class="btn btn-primary hero-btn">加入俱乐部</router-link>
        <router-link to="/projects" class="btn btn-ghost hero-btn">浏览项目池 →</router-link>
      </div>

      <!-- 数据统计 -->
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-num gradient-text">{{ activities.length }}</div>
          <div class="stat-label">场活动</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num gradient-text">{{ projects.length }}</div>
          <div class="stat-label">个项目</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num gradient-text">{{ members.length }}</div>
          <div class="stat-label">位成员</div>
        </div>
      </div>
    </section>

    <!-- 特色模块 -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon" style="background: linear-gradient(135deg,#6366f1,#8b5cf6)">📡</div>
        <h3>分享 & 交流</h3>
        <p>每次活动前进行知识分享，聊最新 AI 动态、工具技巧和项目经验。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background: linear-gradient(135deg,#06b6d4,#6366f1)">🤝</div>
        <h3>组队开发</h3>
        <p>从项目池中认领想法，组队用 AI 工具快速构建，在西图或高新区研讨室一起 coding。</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon" style="background: linear-gradient(135deg,#10b981,#06b6d4)">🌍</div>
        <h3>真实贡献</h3>
        <p>目标是产出对世界有价值的 Agent 系统、AI 应用和开源软件，代表科大发声。</p>
      </div>
    </section>

    <!-- 近期活动 -->
    <section>
      <div class="section-header">
        <h2>近期活动</h2>
        <router-link to="/activities" class="btn btn-ghost btn-small">查看全部 →</router-link>
      </div>

      <div v-if="activities.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <p>暂无活动，敬请期待</p>
      </div>

      <div class="activity-list">
        <div v-for="act in activities.slice(0, 3)" :key="act.id" class="activity-card card">
          <div class="flex-between">
            <div>
              <span :class="['status-dot', statusDotClass(act.status)]"></span>
              <span class="tag" :class="statusTagClass(act.status)">{{ statusText(act.status) }}</span>
            </div>
            <span class="text-muted text-small">{{ formatDate(act.startTime) }}</span>
          </div>
          <h3 class="activity-title">{{ act.title }}</h3>
          <p class="text-secondary text-small mt-8">📍 {{ act.location }}</p>
          <router-link :to="`/activities/${act.id}`" class="btn btn-ghost btn-small mt-16">查看详情 →</router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-glow"></div>
      <h2>准备好开始了吗？</h2>
      <p class="text-secondary mt-8">全校开放，无专业限制，用 AI 工具让编程变得轻松有趣。</p>
      <div class="flex gap-8 mt-16" style="justify-content:center">
        <router-link to="/register" class="btn btn-primary">立即注册</router-link>
        <router-link to="/about" class="btn btn-ghost">了解更多</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const activities = ref([])
const projects = ref([])
const members = ref([])

onMounted(async () => {
  try {
    const [a, p, m] = await Promise.all([
      api.get('/activities'),
      api.get('/projects'),
      api.get('/users'),
    ])
    activities.value = a
    projects.value = p
    members.value = m
  } catch {}
})

function statusText(s) {
  return { upcoming: '即将开始', ongoing: '进行中', completed: '已结束' }[s] || s
}
function statusTagClass(s) {
  return { upcoming: 'tag-blue', ongoing: 'tag-green', completed: 'tag-orange' }[s]
}
function statusDotClass(s) {
  return { upcoming: 'dot-blue', ongoing: 'dot-green', completed: 'dot-gray' }[s]
}
function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* Hero */
.hero {
  text-align: center;
  padding: 72px 0 48px;
  position: relative;
}
/* Hero 中心光晕 */
.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 400px;
  background: radial-gradient(ellipse at center top, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 28px;
}
.hero-title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}
.hero-sub {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 580px;
  margin-left: auto;
  margin-right: auto;
}
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 52px;
}
.hero-btn { padding: 12px 28px; font-size: 15px; }

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 40px;
  display: inline-flex;
}
.stat-item { text-align: center; padding: 0 28px; }
.stat-num { font-size: 32px; font-weight: 800; }
.stat-label { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 48px 0;
}
.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: border-color 0.2s, transform 0.2s;
}
.feature-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
}
.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
}
.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}
.feature-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Section header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-header h2 { font-size: 20px; font-weight: 700; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
.empty-icon { font-size: 36px; margin-bottom: 8px; }

/* Activity cards */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-card { margin-bottom: 0; }
.activity-title {
  font-size: 17px;
  font-weight: 600;
  margin-top: 12px;
  color: var(--text-primary);
}
.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.dot-green { background: #10b981; box-shadow: 0 0 6px #10b981; }
.dot-blue  { background: #6366f1; }
.dot-gray  { background: var(--text-muted); }

/* CTA */
.cta-section {
  position: relative;
  text-align: center;
  padding: 60px 24px;
  margin-top: 48px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
}
.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.15), transparent 70%);
  pointer-events: none;
}
.cta-section h2 { font-size: 28px; font-weight: 800; }

@media (max-width: 768px) {
  .features { grid-template-columns: 1fr; }
  .hero-stats { padding: 16px 20px; }
  .stat-item { padding: 0 16px; }
}
</style>
