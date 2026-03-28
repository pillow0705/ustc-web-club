<template>
  <div class="home">
    <!-- Hero -->
    <div class="hero-wrap">
      <section class="hero">
        <div class="hero-badge">✦ Vibe Coding · USTC</div>
        <h1 class="hero-title">USTC Vibe Club</h1>
        <p class="hero-sub">
          我们是科大刚刚建立的 Vibe Coding 俱乐部。<br />
          每周协作开发，用 Cursor、Claude Code、MCP 等工具把想法真正落地。<br />
          即将迎来 AI 大基建时代，期待聚合全校力量，为世界贡献一份科大力量。
        </p>
        <div class="hero-actions">
          <router-link to="/register" class="btn hero-btn-primary">立即加入</router-link>
          <router-link to="/handbook" class="btn hero-btn-ghost">阅读成员手册 →</router-link>
        </div>

        <!-- 数据 -->
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-num">{{ activities.length || '–' }}</div>
            <div class="stat-label">场活动</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ projects.length || '–' }}</div>
            <div class="stat-label">个项目</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ members.length || '–' }}</div>
            <div class="stat-label">位成员</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">2</div>
            <div class="stat-label">次 / 周</div>
          </div>
        </div>
      </section>
    </div>

    <!-- 活动流程 -->
    <section class="section">
      <div class="section-header">
        <h1>每次活动怎么玩</h1>
        <router-link to="/activities" class="btn btn-ghost btn-small">查看活动 →</router-link>
      </div>
      <div class="flow-grid">
        <div class="flow-card">
          <div class="flow-num">01</div>
          <div class="flow-icon">📡</div>
          <h3>主持人分享一些干货信息</h3>
          <p class="flow-time">约 15 分钟</p>
          <p>技术基础、进阶内容或前沿动态，满满的干货。</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-card">
          <div class="flow-num">02</div>
          <div class="flow-icon">💡</div>
          <h3>成员信息分享</h3>
          <p class="flow-time">每人 2–5 分钟</p>
          <p>分享最近用 AI 的技巧、隐藏网站、或有价值的信息差。</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-card highlight-card">
          <div class="flow-num">03</div>
          <div class="flow-icon">⚡</div>
          <h3>组队开发</h3>
          <p class="flow-time">主场</p>
          <p>按网站报名或现场自由组队，当场写代码，当场出成果。</p>
        </div>
      </div>
      <p class="flow-note">📍 西区图书馆研讨室 & 高新区研讨室 · 每次约 10 人</p>
    </section>

    <!-- 为什么参加 -->
    <section class="section">
      <h2 class="section-header-plain">为什么要参加</h2>
      <div class="why-grid">
        <div class="why-card card">
          <div class="why-icon">🤖</div>
          <h3>真正用上 AI 工具</h3>
          <p>从 Cursor 到 Claude Code、MCP，主持人提供服务器，手把手带你超越「网页对话」阶段。</p>
        </div>
        <div class="why-card card">
          <div class="why-icon">🤝</div>
          <h3>协作能力 > 单打独斗</h3>
          <p>个人用 AI 已经很强，但团队用 AI 协作开发的效率是指数级的。这正是我们在练习的事。</p>
        </div>
        <div class="why-card card">
          <div class="why-icon">🌍</div>
          <h3>做有价值的东西</h3>
          <p>不是课程作业，不是玩具项目。俱乐部的目标是做出对真实用户有价值的工具和服务。</p>
        </div>
        <div class="why-card card">
          <div class="why-icon">🎓</div>
          <h3>全校开放，零门槛</h3>
          <p>无专业限制，零基础也欢迎。AI 工具会帮你补足技术短板，你只需要带来想法和热情。</p>
        </div>
      </div>
    </section>

    <!-- 工具栈 -->
    <section class="section">
      <h2 class="section-header-plain">我们用的工具</h2>
      <div class="tools-row">
        <div class="tool-pill" v-for="t in tools" :key="t.name">
          <span class="tool-emoji">{{ t.icon }}</span>
          <span class="tool-name">{{ t.name }}</span>
        </div>
      </div>
    </section>

    <!-- 近期活动 -->
    <section class="section" v-if="activities.length">
      <div class="section-header">
        <h2>近期活动</h2>
        <router-link to="/activities" class="btn btn-ghost btn-small">查看全部 →</router-link>
      </div>
      <div class="activity-list">
        <div v-for="act in activities.slice(0, 3)" :key="act.id" class="activity-card card">
          <div class="act-row">
            <div class="act-info">
              <span class="tag" :class="statusTagClass(act.status)">{{ statusText(act.status) }}</span>
              <h3 class="act-title">{{ act.title }}</h3>
              <p class="text-secondary text-small mt-8">📍 {{ act.location }}</p>
            </div>
            <div class="act-time-badge">
              <div class="act-time-label">开始时间</div>
              <div class="act-time-val">{{ formatDate(act.startTime) }}</div>
            </div>
          </div>
          <router-link :to="`/activities/${act.id}`" class="btn btn-ghost btn-small mt-16">查看详情 →</router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-glow"></div>
      <h2>一起来 Vibe！</h2>
      <p class="text-secondary mt-8">全校开放，无专业限制。带上你的笔记本，我们在研讨室等你。</p>
      <div class="flex gap-8 mt-16" style="justify-content:center;flex-wrap:wrap">
        <router-link to="/register" class="btn btn-primary">立即注册</router-link>
        <router-link to="/handbook" class="btn btn-ghost">阅读成员手册</router-link>
        <router-link to="/projects" class="btn btn-ghost">浏览项目池</router-link>
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

const tools = [
  { icon: '🤖', name: 'Cursor' },
  { icon: '⚡', name: 'Claude Code' },
  { icon: '🐙', name: 'GitHub Copilot' },
  { icon: '🔗', name: 'MCP' },
  { icon: '🐧', name: 'Linux 服务器' },
  { icon: '📦', name: 'Vue / React' },
  { icon: '🟢', name: 'Node.js' },
  { icon: '🐍', name: 'Python' },
]

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

function statusText(s) { return { upcoming: '即将开始', ongoing: '进行中', completed: '已结束' }[s] || s }
function statusTagClass(s) { return { upcoming: 'tag-blue', ongoing: 'tag-green', completed: 'tag-orange' }[s] }
function formatDate(d) {
  return new Date(d).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* ── Hero Wrap ── */
.hero-wrap {
  margin: -40px -24px 0;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  padding-bottom: 56px;
}

/* Hero 内容 */
.hero {
  text-align: center;
  padding: 80px 24px 0;
  max-width: 720px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 16px;
  background: transparent;
  border: 1px solid var(--border-accent);
  border-radius: 9999px;
  font-size: 12px; font-weight: 400;
  color: var(--accent);
  margin-bottom: 28px;
  letter-spacing: 0.04em;
  animation: fade-up 0.5s ease both;
}

.hero-title {
  font-family: Georgia, serif;
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 400;
  line-height: 1.15;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  animation: fade-up 0.5s ease 0.1s both;
}

.hero-sub {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 40px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  animation: fade-up 0.5s ease 0.2s both;
}

.hero-actions {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  margin-bottom: 52px;
  animation: fade-up 0.5s ease 0.25s both;
}

.hero-btn-primary {
  padding: 11px 26px; font-size: 14px; font-weight: 500;
  background: var(--accent); color: #fff;
  border-radius: 6px; border: none;
  transition: background 0.2s, transform 0.2s;
}
.hero-btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  color: #fff;
}

.hero-btn-ghost {
  padding: 11px 26px; font-size: 14px; font-weight: 400;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: border-color 0.2s, color 0.2s;
}
.hero-btn-ghost:hover {
  border-color: var(--border-accent);
  color: var(--text-primary);
}

/* 数据统计条 */
.hero-stats {
  display: inline-flex; align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 36px;
  animation: fade-up 0.5s ease 0.3s both;
}
.stat-item { text-align: center; padding: 0 24px; }
.stat-num {
  font-family: Georgia, serif;
  font-size: 30px; font-weight: 400;
  color: var(--accent);
}
.stat-label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.stat-divider { width: 1px; height: 36px; background: var(--border); }

/* 入场动画 */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Sections */
.section { margin: 60px 0; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.section-header h1,
.section-header h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 400; }
.section-header-plain { font-family: Georgia, serif; font-size: 22px; font-weight: 400; margin-bottom: 24px; }

/* Activity flow */
.flow-grid {
  display: flex; align-items: center; gap: 12px;
}
.flow-card {
  flex: 1; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px 20px;
  transition: border-color 0.2s;
}
.flow-card:hover { border-color: var(--border-accent); }
.highlight-card {
  border-color: var(--border-accent);
  background: rgba(217, 119, 87, 0.04);
}
.flow-num { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 8px; }
.flow-icon { font-size: 28px; margin-bottom: 10px; }
.flow-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.flow-time { font-size: 12px; color: var(--accent); margin-bottom: 8px; }
.flow-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.flow-arrow { font-size: 20px; color: var(--text-muted); flex-shrink: 0; }
.flow-note { text-align: center; font-size: 23px; color: var(--text-secondary); margin-top: 16px; }

/* Why grid */
.why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.why-card { padding: 24px; }
.why-icon { font-size: 28px; margin-bottom: 12px; }
.why-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
.why-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

/* Tools */
.tools-row { display: flex; flex-wrap: wrap; gap: 10px; }
.tool-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: 9999px;
  font-size: 14px; transition: border-color 0.2s;
}
.tool-pill:hover { border-color: var(--border-accent); }
.tool-emoji { font-size: 16px; }
.tool-name { font-weight: 500; color: var(--text-secondary); }

/* Activities */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-card { margin-bottom: 0; }
.act-row { display: flex; gap: 20px; align-items: flex-start; }
.act-info { flex: 1; min-width: 0; }
.act-title { font-size: 17px; font-weight: 600; margin-top: 10px; }
.act-time-badge {
  flex-shrink: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  padding: 10px 16px;
  text-align: right;
  min-width: 140px;
}
.act-time-label { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
.act-time-val { font-size: 14px; font-weight: 500; color: var(--accent); }

/* CTA */
.cta-section {
  text-align: center; padding: 60px 24px; margin-top: 48px;
  background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px;
}
.cta-glow { display: none; }
.cta-section h2 { font-family: Georgia, serif; font-size: 28px; font-weight: 400; }

@media (max-width: 768px) {
  .flow-grid { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); }
  .why-grid { grid-template-columns: 1fr; }
  .hero-stats { padding: 16px 20px; }
  .stat-item { padding: 0 16px; }
}
</style>
