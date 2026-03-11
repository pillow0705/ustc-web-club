<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <h1 class="hero-title">
        <span class="gradient-text">USTC Vibe Club</span>
      </h1>
      <p class="hero-sub">
        USTC Vibe Club 是刚刚建立的Vibe-coding俱乐部。<br />
        热爱AI tools，每周在西区和高新区各举行一次活动，用 Cursor、Claude Code、Codex、openclaw 等工具协作开发可以落地的项目<br />
        我们探究怎么用最短的时间落地高质量的代码，我们尝试让AI去接管一切<br />
        即将迎来AI大基建的时代，俱乐部期待聚合全校力量，为世界贡献一份科大力量<br />
        俱乐部融合教学和实践两个功能，如果你和AI的互动还停留在网页对话上，欢迎加入俱乐部学习
      </p>
      <div class="hero-actions">
        <router-link to="/register" class="btn btn-primary hero-btn">立即加入</router-link>
        <router-link to="/handbook" class="btn btn-ghost hero-btn">阅读成员手册 →</router-link>
      </div>

      <!-- 数据 -->
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-num gradient-text">{{ activities.length || '∞'  }}</div>
          <div class="stat-label">场活动</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num gradient-text">{{ projects.length || '∞' }}</div>
          <div class="stat-label">个项目</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num gradient-text">{{ members.length || '∞' }}</div>
          <div class="stat-label">位成员</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num gradient-text">2</div>
          <div class="stat-label">次 / 周</div>
        </div>
      </div>
    </section>

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
/* Hero */
.hero { text-align: center; padding: 72px 0 48px; position: relative; }
.hero::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 700px; height: 400px;
  background: radial-gradient(ellipse at center top, rgba(99,102,241,0.22) 0%, transparent 70%);
  pointer-events: none; z-index: -1;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 16px; background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25); border-radius: 9999px;
  font-size: 13px; color: #a5b4fc; margin-bottom: 28px;
}
.hero-title {
  font-size: clamp(28px, 5vw, 52px); font-weight: 800;
  line-height: 1.2; margin-bottom: 30px; letter-spacing: -0.5px;
}
.hero-sub { font-size: 23px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 36px; }
.hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 52px; }
.hero-btn { padding: 12px 28px; font-size: 15px; }

.hero-stats {
  display: inline-flex; align-items: center;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 16px; padding: 20px 40px;
}
.stat-item { text-align: center; padding: 0 28px; }
.stat-num { font-size: 32px; font-weight: 800; }
.stat-label { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.stat-divider { width: 1px; height: 40px; background: var(--border); }

/* Sections */
.section { margin: 56px 0; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.section-header h2 { font-size: 20px; font-weight: 700; }
.section-header-plain { font-size: 20px; font-weight: 700; margin-bottom: 20px; }

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
  border-color: rgba(99,102,241,0.35);
  background: rgba(99,102,241,0.05);
}
.flow-num { font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 8px; }
.flow-icon { font-size: 28px; margin-bottom: 10px; }
.flow-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.flow-time { font-size: 12px; color: #a5b4fc; margin-bottom: 8px; }
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
.act-time-val { font-size: 14px; font-weight: 600; color: #a5b4fc; }

/* CTA */
.cta-section {
  position: relative; text-align: center; padding: 60px 24px; margin-top: 48px;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
}
.cta-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 400px; height: 200px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.15), transparent 70%);
  pointer-events: none;
}
.cta-section h2 { font-size: 28px; font-weight: 800; }

@media (max-width: 768px) {
  .flow-grid { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); }
  .why-grid { grid-template-columns: 1fr; }
  .hero-stats { padding: 16px 20px; }
  .stat-item { padding: 0 16px; }
}
</style>
