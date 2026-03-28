<template>
  <div class="handbook-layout">
    <!-- 侧边 TOC -->
    <aside class="toc">
      <div class="toc-title">目录</div>
      <nav>
        <a
          v-for="s in sections"
          :key="s.id"
          :href="`#${s.id}`"
          class="toc-link"
          :class="{ active: activeSection === s.id }"
          @click.prevent="scrollTo(s.id)"
        >{{ s.title }}</a>
      </nav>
    </aside>

    <!-- 正文 -->
    <article class="handbook-body">
      <h1>USTC Vibe Club 成员手册</h1>

      <section id="intro">
        <p>USTC Vibe Club 是刚刚建立的 Vibe Coding 俱乐部。每周在西区和高新区各举行一次活动，用 Cursor、Claude Code、Codex、OpenClaw 等工具协作开发可以真正落地的项目。</p>
        <p>俱乐部有两个创办初衷：</p>
        <p>一是我观察到科大很多同学仍然停留在「网页对话」的 AI 使用上，希望可以通过俱乐部增强大家使用各种 AI 工具的能力，帮助大家解决使用中各种不方便和棘手的问题。</p>
        <p>二是 Vibe Coding 的时代已经到来，希望聚合全校对 AI 工具使用抱有热情的同学，一起学习交流，每周协作开发，增强大家的协作能力，使开发效率相较于个人使用 AI 工具再进一步提升。</p>
        <p>我们的目的不仅是开发，更是带领同学们熟悉现在先进的 AI 工具，而不是只停留在网页对话上。Vibe Coding、聊聊最新趋势、教大家用最新的 AI 工具——我们探究怎么用最短的时间落地高质量的代码，会一起开发各种 Agent Skills 和 MCP，比如自动科研的 Agent。</p>
        <p>即将迎来 AI 大基建的时代，俱乐部期待聚合全校力量，为世界贡献一份科大力量。俱乐部融合教学与实践两个功能，<strong>新人极其友好</strong>，欢迎加入学习。对于成熟的项目，俱乐部会统一宣传并部署到俱乐部服务器上。</p>
      </section>

      <hr id="join" />

      <section>
        <h2>一、加入方式</h2>
        <ul>
          <li>登录俱乐部网站，填写用户名、上传头像，如果你愿意的话还可以加一段个人简介</li>
          <li>浏览项目池，找到自己感兴趣的项目，点赞或评论，申请加入队伍</li>
          <li>加入我们的群聊，获取每次活动的时间与地点通知</li>
        </ul>
        <blockquote>全校开放，无专业限制，零基础也欢迎！</blockquote>
      </section>

      <hr id="activity" />

      <section>
        <h2>二、活动流程</h2>
        <p>每周举办两次活动：<strong>西区图书馆研讨室</strong>一次，<strong>高新区研讨室</strong>一次，每次约 10 人左右。</p>
        <p>每次活动分为三个部分：</p>
        <p><strong>① 主持人分享（约 15 分钟）</strong><br />主持人进行技术基础介绍、进阶内容或前沿动态分享，满满的干货。</p>
        <p><strong>② 每位成员信息分享（每人 2–5 分钟）</strong><br />每位参与的同学分享一到多个自己最近使用 AI 工具或编程的技巧、一些隐秘的网站、一些神奇的用法。我们不聊废话，高效互换信息差。</p>
        <p><strong>③ 组队开发</strong><br />按照网站上事先报名的信息或现场协调组队，选定项目开始开发。俱乐部后续会对成熟的项目进行统一的宣传工作，帮助大家把想法落地。</p>
      </section>

      <hr id="projects" />

      <section>
        <h2>三、项目参与指南</h2>
        <ul>
          <li>任何人都可以在网站上发起自己的项目想法，等待其他同学的关注</li>
          <li>任何人都可以对别人的项目进行点赞和评论，充分感兴趣的话可以申请加入队伍</li>
          <li>当一个项目人数达到要求，或者大家反响热烈，会在下一次活动中优先选择开发此项目</li>
          <li>对于<strong>成熟的成员</strong>：我们希望一起做出一些对社会真正有价值的服务和工具</li>
          <li>对于<strong>新加入的成员</strong>：我们会准备一些简单的入门项目，帮助大家熟悉整个开发流程</li>
        </ul>
      </section>

      <hr id="rules" />

      <section>
        <h2>四、开发规范</h2>
        <p>我们会在第一次管理员会议中具体商定协作约定，以提高大家的协作效率。以下是基本方向：</p>
        <ul>
          <li>建设统一的 GitHub 组织账号，所有俱乐部项目统一归档</li>
          <li>采用 Git 分支协作，不直接往主分支提交大改动</li>
          <li>每次提交写清楚 commit message，例：<code>feat: 添加评论功能</code></li>
          <li>不要把密钥、<code>.env</code> 文件、<code>node_modules</code> 提交到 Git</li>
          <li>用 AI 生成的代码，自己要读懂再提交，不要盲目粘贴</li>
          <li>遇到卡壳超过 30 分钟，及时在群里求助，不要一个人死磕</li>
        </ul>
      </section>

      <hr id="tools" />

      <section>
        <h2>五、可能使用到的工具</h2>
        <p>我们主要使用以下工具，主持人也会在活动中持续介绍最新的工具动态：</p>
        <table>
          <thead>
            <tr><th>工具</th><th>用途</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Cursor</strong></td><td>AI 原生代码编辑器，主力开发工具</td></tr>
            <tr><td><strong>Claude Code</strong></td><td>命令行 AI 编程助手，复杂任务首选</td></tr>
            <tr><td><strong>Codex / OpenAI CLI</strong></td><td>OpenAI 官方代码生成工具</td></tr>
            <tr><td><strong>GitHub Copilot</strong></td><td>代码补全，嵌入编辑器使用</td></tr>
            <tr><td><strong>MCP</strong></td><td>连接 AI 与外部工具 / 数据库的协议</td></tr>
            <tr><td><strong>gh</strong></td><td>GitHub 官方命令行工具，管理 PR / Issue</td></tr>
            <tr><td><strong>Git</strong></td><td>版本控制，多人协作基础</td></tr>
            <tr><td><strong>Docker</strong></td><td>容器化部署，保证环境一致性</td></tr>
            <tr><td><strong>Linux 服务器</strong></td><td>主持人提供，供大家部署和展示项目</td></tr>
          </tbody>
        </table>
        <blockquote>不限于以上工具，鼓励大家在分享环节介绍自己发现的好用工具。</blockquote>
      </section>

      <hr id="points" />

      <section>
        <h2>六、积分与排行榜</h2>
        <p>排行榜是促进大家积极参与的机制，规则如下：</p>
        <table>
          <thead>
            <tr><th>行为</th><th>积分</th></tr>
          </thead>
          <tbody>
            <tr><td>报名参加一次活动</td><td>+5 分</td></tr>
            <tr><td>取消活动报名</td><td>−5 分</td></tr>
            <tr><td>提交新项目到项目池</td><td>+10 分</td></tr>
            <tr><td>参与活动（现场签到）</td><td>+25 分</td></tr>
            <tr><td>项目评论互动</td><td>+2 分（每天最多 5 次）</td></tr>
          </tbody>
        </table>
        <p>积分实时更新，可在网站<router-link to="/leaderboard">排行榜</router-link>页面查看所有成员的排名。排名靠前的成员将获得优先选择项目、优先展示机会等权益（后续持续完善）。</p>
      </section>

      <hr id="contact" />

      <section>
        <h2>七、联系与反馈</h2>
        <ul>
          <li><strong>负责人</strong>：茶叶蛋（网站 ID：<router-link to="/profile/1">Eggtea</router-link>）</li>
          <li><strong>反馈渠道</strong>：在网站项目池搜索「俱乐部改进建议」，评论反馈，或直接在群聊中反馈</li>
          <li><strong>活动通知</strong>：关注群聊公告，每次活动前提前发布时间和地点</li>
        </ul>
        <blockquote>欢迎所有人对俱乐部的运营方式提出建议，我们会持续迭代改进。</blockquote>
      </section>

      <div class="doc-footer">USTC Vibe Club · 成员手册 · 持续更新</div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('intro')

const sections = [
  { id: 'intro',    title: '前言' },
  { id: 'join',     title: '一、加入方式' },
  { id: 'activity', title: '二、活动流程' },
  { id: 'projects', title: '三、项目参与' },
  { id: 'rules',    title: '四、开发规范' },
  { id: 'tools',    title: '五、工具推荐' },
  { id: 'points',   title: '六、积分规则' },
  { id: 'contact',  title: '七、联系反馈' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

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
  gap: 56px;
  align-items: flex-start;
  max-width: 900px;
  margin: 0 auto;
}

/* TOC */
.toc {
  width: 172px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}
.toc-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.toc-link {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  padding: 5px 0 5px 10px;
  margin-left: -10px;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  line-height: 1.4;
}
.toc-link:hover { color: var(--text-secondary); }
.toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

/* Article body */
.handbook-body {
  flex: 1;
  min-width: 0;
  padding-bottom: 80px;
}

.handbook-body h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 32px;
  line-height: 1.3;
}

.handbook-body h2 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.handbook-body p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.85;
  margin-bottom: 14px;
}

.handbook-body strong {
  color: var(--text-primary);
  font-weight: 600;
}

.handbook-body ul {
  padding-left: 20px;
  margin-bottom: 16px;
}
.handbook-body li {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 6px;
}

blockquote {
  margin: 14px 0 18px;
  padding: 10px 16px;
  border-left: 3px solid var(--accent);
  color: var(--text-secondary);
  font-size: 14px;
  background: rgba(217, 119, 87, 0.04);
  border-radius: 0 5px 5px 0;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 36px 0 28px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 18px;
  font-size: 14px;
}
table th {
  text-align: left;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}
table td {
  padding: 10px 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  line-height: 1.6;
}
table tr:last-child td { border-bottom: none; }

code {
  background: rgba(217, 119, 87, 0.07);
  color: var(--accent);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.doc-footer {
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .handbook-layout { flex-direction: column; gap: 20px; }
  .toc { width: 100%; position: static; }
  .toc-link { display: inline-block; padding-left: 0; border-left: none; margin-right: 6px; }
  .toc-title { display: none; }
}
</style>
