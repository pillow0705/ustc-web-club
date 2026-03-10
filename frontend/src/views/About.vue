<template>
  <div class="about">
    <!-- Hero -->
    <section class="about-hero">
      <div class="hero-badge">关于我们</div>
      <h1>
        USTC <span class="gradient-text">Vibe Club</span>
      </h1>
      <p>
        中国科学技术大学开放编程社区<br />
        用 AI 工具，做真实有价值的产品
      </p>
    </section>

    <!-- 使命 -->
    <section class="mission card">
      <div class="mission-content">
        <div class="mission-text">
          <h2>我们的使命</h2>
          <p>
            Vibe Club 相信：<strong>每一位科大学生都有能力用 AI 工具创造出改变世界的产品</strong>。
            我们不区分专业、不设技术门槛，只需要你有想法、有热情。
          </p>
          <p class="mt-16">
            我们的目标是让科大的同学们，通过协作开发，在 <strong>Agent 系统、AI 应用和开源软件</strong>
            领域做出属于科大的贡献，让世界听到中科大的声音。
          </p>
        </div>
        <div class="mission-visual">
          <div class="visual-ring">
            <div class="visual-core">🚀</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 活动流程 -->
    <section>
      <h2 class="section-title">活动流程</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-dot" style="background: var(--gradient)">1</div>
          <div class="timeline-content card">
            <h3>知识分享 <span class="tag tag-blue">~30 分钟</span></h3>
            <p>由成员分享最新 AI 工具、开发经验或技术趋势，开阔视野，激发灵感。</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot" style="background: var(--gradient-cyan)">2</div>
          <div class="timeline-content card">
            <h3>项目路演 <span class="tag tag-cyan">~20 分钟</span></h3>
            <p>展示项目池中的想法，大家讨论可行性，选出本次活动要开发的项目。</p>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-dot" style="background: linear-gradient(135deg,#10b981,#06b6d4)">3</div>
          <div class="timeline-content card">
            <h3>组队开发 <span class="tag tag-green">主场</span></h3>
            <p>在西区图书馆或高新区研讨室，约 10 人左右，用 Cursor / Copilot 一起编码，当场出成果。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 工具栈 -->
    <section class="card">
      <h2 class="section-title" style="margin-bottom:20px">我们用什么工具</h2>
      <div class="tools-grid">
        <div class="tool-item">
          <span class="tool-icon">🤖</span>
          <div>
            <div class="tool-name">Cursor</div>
            <div class="tool-desc text-small text-gray">AI 原生代码编辑器</div>
          </div>
        </div>
        <div class="tool-item">
          <span class="tool-icon">🐙</span>
          <div>
            <div class="tool-name">GitHub Copilot</div>
            <div class="tool-desc text-small text-gray">AI 代码补全</div>
          </div>
        </div>
        <div class="tool-item">
          <span class="tool-icon">⚡</span>
          <div>
            <div class="tool-name">Claude / GPT-4</div>
            <div class="tool-desc text-small text-gray">大模型编程助手</div>
          </div>
        </div>
        <div class="tool-item">
          <span class="tool-icon">📦</span>
          <div>
            <div class="tool-name">Vue / React / Node</div>
            <div class="tool-desc text-small text-gray">主流 Web 技术栈</div>
          </div>
        </div>
      </div>
      <hr style="margin:20px 0" />
      <p class="text-gray text-small">+ Python、FastAPI、Docker、PostgreSQL 等，根据项目需求灵活选择。不限技术栈，只要能做出好产品。</p>
    </section>

    <!-- 加入条件 -->
    <section class="card">
      <h2 class="section-title" style="margin-bottom:20px">如何加入</h2>
      <div class="join-list">
        <div class="join-item">
          <div class="join-check">✓</div>
          <div>
            <strong>中科大在校学生</strong>
            <p class="text-gray text-small">使用 @mail.ustc.edu.cn 邮箱注册即可</p>
          </div>
        </div>
        <div class="join-item">
          <div class="join-check">✓</div>
          <div>
            <strong>有兴趣就行</strong>
            <p class="text-gray text-small">零基础也欢迎，AI 工具会帮你补足技术短板</p>
          </div>
        </div>
        <div class="join-item">
          <div class="join-check">✓</div>
          <div>
            <strong>愿意协作</strong>
            <p class="text-gray text-small">我们重视团队合作，一起做出有价值的东西</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="text-center" style="padding:48px 0">
      <h2 style="font-size:28px;font-weight:800">一起来 Vibe！</h2>
      <p class="text-gray mt-16">加入科大最有活力的编程社区</p>
      <div class="flex gap-8 mt-16" style="justify-content:center">
        <router-link to="/register" class="btn btn-primary">立即注册</router-link>
        <router-link to="/activities" class="btn btn-ghost">查看活动</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-hero {
  text-align: center;
  padding: 60px 0 40px;
}
.hero-badge {
  display: inline-block;
  padding: 4px 14px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 20px;
}
.about-hero h1 { font-size: 44px; font-weight: 800; margin-bottom: 16px; }
.about-hero p { font-size: 16px; color: var(--text-secondary); line-height: 1.7; }

.section-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }

/* Mission */
.mission-content {
  display: flex;
  align-items: center;
  gap: 32px;
}
.mission-text { flex: 1; }
.mission-text h2 { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
.mission-text p { color: var(--text-secondary); line-height: 1.7; }
.mission-text strong { color: var(--text-primary); }
.mission-visual { flex-shrink: 0; }
.visual-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
              var(--gradient) border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-core { font-size: 48px; }

/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 16px; }
.timeline-item { display: flex; gap: 16px; align-items: flex-start; }
.timeline-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  margin-top: 4px;
  box-shadow: 0 2px 10px rgba(99,102,241,0.4);
}
.timeline-content { flex: 1; margin-bottom: 0; }
.timeline-content h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.timeline-content p { font-size: 14px; color: var(--text-secondary); }

/* Tools */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.tool-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.tool-icon { font-size: 28px; }
.tool-name { font-weight: 600; font-size: 14px; }

/* Join */
.join-list { display: flex; flex-direction: column; gap: 16px; }
.join-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.join-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.join-item strong { display: block; margin-bottom: 4px; }

@media (max-width: 768px) {
  .mission-content { flex-direction: column; }
  .tools-grid { grid-template-columns: 1fr; }
}
</style>
