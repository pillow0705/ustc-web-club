<template>
  <div class="handbook-layout">
    <!-- 侧边导航 -->
    <aside class="toc">
      <div class="toc-inner">
        <div class="toc-title">成员手册</div>
        <nav>
          <a
            v-for="section in sections"
            :key="section.id"
            :href="`#${section.id}`"
            class="toc-link"
            :class="{ active: activeSection === section.id }"
            @click.prevent="scrollTo(section.id)"
          >
            <span class="toc-num">{{ section.num }}</span>
            {{ section.title }}
          </a>
        </nav>
      </div>
    </aside>

    <!-- 正文 -->
    <article class="handbook-content">
      <!-- 封面 -->
      <header class="handbook-header">
        <div class="header-badge">USTC Vibe Club</div>
        <h1>成员手册</h1>
        <p class="header-sub">加入之前，花 3 分钟读完这份手册</p>
        <div class="header-meta">
          <span>作者：茶叶蛋（Eggtea）</span>
          <span>·</span>
          <span>面向全体成员</span>
        </div>
      </header>

      <hr />

      <!-- 前言 -->
      <section id="intro" class="hb-section">
        <p class="intro-text">
          大家好，我是茶叶蛋，本俱乐部的创建者。创办俱乐部有两个目的：
        </p>
        <div class="callout callout-purple">
          <div class="callout-icon">💡</div>
          <div>
            我观察到科大很多同学仍然停留在「网页对话」的 AI 使用上。希望通过该俱乐部，增强大家使用各种 AI 工具的能力，帮助大家解决使用中各种不方便和棘手的问题（坏笑）
          </div>
        </div>
        <div class="callout callout-cyan">
          <div class="callout-icon">🚀</div>
          <div>
            Vibe Coding 的时代已经到来。希望聚合全校对 AI 工具有热情的同学，一起学习交流，每周协作开发，<strong>增强协作能力</strong>，使开发效率相较于个人使用 AI 工具再进一步提升。
          </div>
        </div>
        <p style="color:var(--text-secondary); margin-top:16px; line-height:1.8">
          我们的目的不仅是开发，更是带领同学们熟悉先进的 AI 工具，而不是只是停留在网页对话上。<br />
          <strong style="color:var(--text-primary)">Vibe Coding · 聊最新趋势 · 教大家用最新 AI 工具</strong> —— 这就是我们每周在做的事。
        </p>
      </section>

      <hr />

      <!-- 加入方式 -->
      <section id="join" class="hb-section">
        <h2><span class="section-num">01</span>加入方式</h2>
        <div class="step-list">
          <div class="step-item">
            <div class="step-dot">1</div>
            <div>登录俱乐部网站，填写用户名、上传头像，如果你愿意的话还可以加一段个人简介</div>
          </div>
          <div class="step-item">
            <div class="step-dot">2</div>
            <div>浏览项目池，找到自己感兴趣的项目，点赞或评论，加入队伍</div>
          </div>
          <div class="step-item">
            <div class="step-dot">3</div>
            <div>加入我们的群聊，获取每次活动的时间与地点通知</div>
          </div>
        </div>
        <div class="callout callout-green">
          <div class="callout-icon">✅</div>
          <div><strong>全校开放，无专业限制，零基础也欢迎！</strong></div>
        </div>
      </section>

      <hr />

      <!-- 活动流程 -->
      <section id="activity" class="hb-section">
        <h2><span class="section-num">02</span>活动流程</h2>
        <p style="color:var(--text-secondary); margin-bottom:20px; line-height:1.8">
          每周举办两次活动：<strong style="color:var(--text-primary)">西区图书馆研讨室</strong>一次，<strong style="color:var(--text-primary)">高新区研讨室</strong>一次，每次约 10 人左右。
        </p>
        <div class="timeline">
          <div class="tl-item">
            <div class="tl-badge" style="background:var(--gradient)">① 15分钟</div>
            <div class="tl-content">
              <h4>主持人分享</h4>
              <p>技术基础介绍、进阶内容或前沿动态分享，满满的干货。</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-badge" style="background:var(--gradient-cyan)">② 2-5分钟/人</div>
            <div class="tl-content">
              <h4>成员信息分享</h4>
              <p>每位参与的同学分享一到多个自己最近使用 AI 工具或编程的技巧、一些隐秘的网站、或者对大家有用的信息差。</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-badge" style="background:linear-gradient(135deg,#10b981,#06b6d4)">③ 主场</div>
            <div class="tl-content">
              <h4>组队开发</h4>
              <p>按照网站上事先报名的信息或现场自由组队，选定项目开始开发。俱乐部后续会对成熟的项目进行统一的宣传工作，帮助大家把想法落地。</p>
            </div>
          </div>
        </div>
      </section>

      <hr />

      <!-- 项目参与 -->
      <section id="projects" class="hb-section">
        <h2><span class="section-num">03</span>项目参与指南</h2>
        <ul class="hb-list">
          <li>任何人都可以在网站上发起自己的项目想法</li>
          <li>任何人都可以对别人的项目进行点赞和评论，充分感兴趣的话可以申请加入队伍</li>
          <li>当一个项目人数达到要求，或者大家反响热烈，会在下一次活动中优先选择开发此项目</li>
        </ul>
        <div class="two-col">
          <div class="col-card col-purple">
            <h4>成熟的成员</h4>
            <p>我们希望一起做出一些对社会真正有价值的服务和工具</p>
          </div>
          <div class="col-card col-cyan">
            <h4>新加入的成员</h4>
            <p>我们会准备一些简单的入门项目，帮助大家熟悉整个开发流程</p>
          </div>
        </div>
      </section>

      <hr />

      <!-- 开发规范 -->
      <section id="rules" class="hb-section">
        <h2><span class="section-num">04</span>开发规范</h2>
        <p style="color:var(--text-secondary);margin-bottom:20px">我们提倡轻量、务实的协作风格，以下是基本约定：</p>
        <div class="rule-group">
          <h4 class="rule-title">代码风格</h4>
          <ul class="hb-list">
            <li>变量和函数命名语义清晰，见名知意</li>
            <li>关键逻辑处写注释，方便队友理解</li>
            <li>提交前确保代码在本地能正常运行</li>
          </ul>
        </div>
        <div class="rule-group">
          <h4 class="rule-title">Git 协作</h4>
          <ul class="hb-list">
            <li>每次提交写清楚 commit message，例：<code>feat: 添加评论功能</code></li>
            <li>不要直接往主分支提交大改动，建议新开分支再合并</li>
            <li>不要把密钥、<code>.env</code> 文件、<code>node_modules</code> 提交到 Git</li>
          </ul>
        </div>
        <div class="rule-group">
          <h4 class="rule-title">AI 工具使用</h4>
          <ul class="hb-list">
            <li>用 AI 生成的代码，自己要读懂再提交，不要盲目粘贴</li>
            <li>遇到 bug 先自己思考 10 分钟，再问 AI 或队友</li>
            <li>善用 AI 做 code review，提交前让 AI 帮你检查一遍</li>
          </ul>
        </div>
        <div class="rule-group">
          <h4 class="rule-title">团队协作</h4>
          <ul class="hb-list">
            <li>遇到卡壳超过 30 分钟，及时在群里求助，不要一个人死磕</li>
            <li>尊重队友的想法，有分歧时多讨论，少否定</li>
          </ul>
        </div>
      </section>

      <hr />

      <!-- 工具推荐 -->
      <section id="tools" class="hb-section">
        <h2><span class="section-num">05</span>工具推荐</h2>
        <p style="color:var(--text-secondary);margin-bottom:20px">主持人也会在活动中持续介绍最新工具动态：</p>
        <div class="tools-table">
          <div class="tool-row tool-header">
            <span>工具</span><span>用途</span>
          </div>
          <div class="tool-row" v-for="t in toolList" :key="t.name">
            <span class="tool-name-cell"><strong>{{ t.name }}</strong></span>
            <span style="color:var(--text-secondary)">{{ t.desc }}</span>
          </div>
        </div>
        <div class="callout callout-purple" style="margin-top:16px">
          <div class="callout-icon">💬</div>
          <div>不限于以上工具，鼓励大家在分享环节介绍自己发现的好用工具。</div>
        </div>
      </section>

      <hr />

      <!-- 积分 -->
      <section id="points" class="hb-section">
        <h2><span class="section-num">06</span>积分与排行榜</h2>
        <p style="color:var(--text-secondary);margin-bottom:20px">排行榜是促进大家积极参与的机制，规则如下：</p>
        <div class="points-table">
          <div class="pt-row pt-header">
            <span>行为</span><span>积分</span>
          </div>
          <div class="pt-row" v-for="r in pointRules" :key="r.action">
            <span style="color:var(--text-secondary)">{{ r.action }}</span>
            <span class="pt-score" :class="r.pts > 0 ? 'plus' : 'minus'">
              {{ r.pts > 0 ? '+' : '' }}{{ r.pts }} 分
            </span>
          </div>
        </div>
        <p style="color:var(--text-secondary);font-size:14px;margin-top:16px;line-height:1.7">
          积分实时更新，可在网站<router-link to="/leaderboard">排行榜</router-link>页面查看。排名靠前的成员将获得优先选择项目、优先展示机会等权益（后续持续完善）。
        </p>
      </section>

      <hr />

      <!-- 联系 -->
      <section id="contact" class="hb-section">
        <h2><span class="section-num">07</span>联系与反馈</h2>
        <div class="contact-list">
          <div class="contact-item">
            <span class="contact-label">负责人</span>
            <span>茶叶蛋（网站 ID：<router-link to="/profile/1">Eggtea</router-link>）</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">建议渠道</span>
            <span>在项目池提交「俱乐部改进建议」，或直接在群聊中反馈</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">活动通知</span>
            <span>关注群聊公告，每次活动前提前发布时间和地点</span>
          </div>
        </div>
        <div class="callout callout-green" style="margin-top:20px">
          <div class="callout-icon">🙌</div>
          <div>欢迎所有人对俱乐部的运营方式提出建议，我们会持续迭代改进。</div>
        </div>
      </section>

      <!-- 底部 -->
      <div class="handbook-footer">
        <span class="gradient-text" style="font-weight:700">USTC Vibe Club</span>
        <span style="color:var(--text-muted)">成员手册 · 持续更新</span>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('intro')

const sections = [
  { id: 'intro',    num: '00', title: '前言' },
  { id: 'join',     num: '01', title: '加入方式' },
  { id: 'activity', num: '02', title: '活动流程' },
  { id: 'projects', num: '03', title: '项目参与' },
  { id: 'rules',    num: '04', title: '开发规范' },
  { id: 'tools',    num: '05', title: '工具推荐' },
  { id: 'points',   num: '06', title: '积分规则' },
  { id: 'contact',  num: '07', title: '联系反馈' },
]

const toolList = [
  { name: 'Cursor',         desc: 'AI 原生代码编辑器，主力开发工具' },
  { name: 'Claude Code',    desc: '命令行 AI 编程助手，复杂任务首选' },
  { name: 'GitHub Copilot', desc: '代码补全，嵌入编辑器使用' },
  { name: 'MCP',            desc: '连接 AI 与外部工具/数据库的协议' },
  { name: 'Linux 服务器',   desc: '主持人提供，供大家部署和展示项目' },
]

const pointRules = [
  { action: '报名参加一次活动', pts: 5 },
  { action: '取消活动报名',     pts: -5 },
  { action: '提交新项目到项目池', pts: 10 },
  { action: '参与项目评论互动', pts: 2 },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 滚动高亮当前章节
function onScroll() {
  for (const s of [...sections].reverse()) {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= 120) {
      activeSection.value = s.id
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.handbook-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  max-width: 960px;
  margin: 0 auto;
}

/* ---- TOC 侧边栏 ---- */
.toc {
  width: 210px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}
.toc-inner { padding: 16px 0; }
.toc-title {
  font-size: 12px; font-weight: 700; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;
  padding-left: 10px;
}
.toc-link {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 8px;
  font-size: 15px; color: var(--text-secondary);
  transition: color 0.2s, background 0.2s;
  cursor: pointer; text-decoration: none; margin-bottom: 3px;
}
.toc-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
.toc-link.active { color: #a5b4fc; background: rgba(99,102,241,0.1); font-weight: 600; }
.toc-num { font-size: 11px; color: var(--text-muted); min-width: 20px; }

/* ---- 正文 ---- */
.handbook-content { flex: 1; min-width: 0; padding-bottom: 80px; }

.handbook-header {
  padding: 48px 0 32px;
  text-align: center;
}
.header-badge {
  display: inline-block; padding: 5px 16px;
  background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
  border-radius: 9999px; font-size: 13px; color: #a5b4fc; margin-bottom: 18px;
}
.handbook-header h1 { font-size: 44px; font-weight: 900; margin-bottom: 12px; }
.header-sub { font-size: 18px; color: var(--text-secondary); margin-bottom: 14px; }
.header-meta { display: flex; justify-content: center; gap: 8px; font-size: 14px; color: var(--text-muted); }

hr { border: none; border-top: 1px solid var(--border); margin: 36px 0; }

.hb-section { margin: 0 0 8px; }
.hb-section h2 {
  font-size: 24px; font-weight: 800;
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 22px;
}
.section-num {
  font-size: 13px; font-weight: 700; color: var(--text-muted);
  background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: 6px; padding: 3px 10px; letter-spacing: 1px;
}

/* Callouts */
.callout {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 16px 18px; border-radius: 10px;
  font-size: 15px; line-height: 1.8; margin: 14px 0;
}
.callout-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
.callout-purple { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); color: var(--text-secondary); }
.callout-cyan   { background: rgba(6,182,212,0.08);  border: 1px solid rgba(6,182,212,0.2);  color: var(--text-secondary); }
.callout-green  { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: var(--text-secondary); }

/* Steps */
.step-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px; }
.step-item { display: flex; align-items: flex-start; gap: 16px; font-size: 15px; color: var(--text-secondary); line-height: 1.8; }
.step-dot {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: var(--gradient); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
}

/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 18px; }
.tl-item { display: flex; gap: 16px; align-items: flex-start; }
.tl-badge {
  flex-shrink: 0; padding: 5px 14px; border-radius: 9999px;
  font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap;
  margin-top: 2px;
}
.tl-content h4 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.tl-content p  { font-size: 15px; color: var(--text-secondary); line-height: 1.7; }

/* List */
.hb-list { list-style: none; padding: 0; margin: 0 0 8px; }
.hb-list li {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 7px 0; font-size: 15px; color: var(--text-secondary); line-height: 1.7;
}
.hb-list li::before { content: '–'; color: var(--accent); font-weight: 700; flex-shrink: 0; }

code {
  background: rgba(99,102,241,0.12); color: #a5b4fc;
  padding: 2px 7px; border-radius: 4px; font-size: 14px;
}

/* Two col */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
.col-card { padding: 18px; border-radius: 10px; }
.col-purple { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); }
.col-cyan   { background: rgba(6,182,212,0.08);  border: 1px solid rgba(6,182,212,0.2); }
.col-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
.col-card p  { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

/* Rule groups */
.rule-group { margin-bottom: 24px; }
.rule-title { font-size: 15px; font-weight: 700; color: #a5b4fc; margin-bottom: 10px; }

/* Tools table */
.tools-table { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.tool-row {
  display: grid; grid-template-columns: 180px 1fr;
  padding: 13px 18px; border-bottom: 1px solid var(--border); font-size: 15px;
}
.tool-row:last-child { border-bottom: none; }
.tool-header { background: var(--bg-surface); font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

/* Points table */
.points-table { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.pt-row {
  display: grid; grid-template-columns: 1fr 110px;
  padding: 13px 18px; border-bottom: 1px solid var(--border); font-size: 15px;
}
.pt-row:last-child { border-bottom: none; }
.pt-header { background: var(--bg-surface); font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.pt-score { font-weight: 700; text-align: right; font-size: 16px; }
.pt-score.plus  { color: #6ee7b7; }
.pt-score.minus { color: #fda4af; }

/* Contact */
.contact-list { display: flex; flex-direction: column; gap: 14px; }
.contact-item { display: flex; gap: 16px; font-size: 15px; align-items: flex-start; }
.contact-label { min-width: 80px; font-weight: 600; color: var(--text-secondary); }

/* Footer */
.handbook-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 0 0; margin-top: 32px;
  border-top: 1px solid var(--border);
  font-size: 14px;
}

.intro-text { font-size: 16px; color: var(--text-secondary); line-height: 1.9; margin-bottom: 18px; }

@media (max-width: 768px) {
  .handbook-layout { flex-direction: column; }
  .toc { width: 100%; position: static; }
  .toc-inner { display: flex; flex-wrap: wrap; gap: 4px; padding: 0 0 16px; }
  .toc-title { display: none; }
  .two-col { grid-template-columns: 1fr; }
}
</style>
