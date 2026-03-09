<template>
  <div>
    <div class="hero card">
      <h1>关于 USTC Vibe Club</h1>
      <p class="text-gray mt-16">中国科学技术大学 Web 开发俱乐部</p>
    </div>

    <div class="card mt-16">
      <h2 class="mb-16">🎯 我们是谁</h2>
      <p>USTC Vibe Club 是中国科学技术大学的 Web 开发俱乐部，致力于聚合科大热爱编程的小伙伴，共同学习、共同成长。我们相信，编程不仅是一项技能，更是一种创造力的表达方式。</p>
    </div>

    <div class="card mt-16">
      <h2 class="mb-16">🚀 我们做什么</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <div class="feature-icon">📅</div>
          <h3>每周活动</h3>
          <p class="text-gray text-small">每周固定时间举行线下活动，大家聚在一起 coding，互相学习交流。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💡</div>
          <h3>项目驱动</h3>
          <p class="text-gray text-small">成员提交项目想法，大家投票选出最感兴趣的项目，组队开发。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">👥</div>
          <h3>组队开发</h3>
          <p class="text-gray text-small">两人或多人组队，合作完成一个真实可用的 Web 项目。</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🏆</div>
          <h3>贡献激励</h3>
          <p class="text-gray text-small">积极参与活动和项目，积累贡献积分，登上排行榜。</p>
        </div>
      </div>
    </div>

    <div class="card mt-16">
      <h2 class="mb-16">📋 加入条件</h2>
      <ul class="join-list">
        <li>✅ 中国科学技术大学在校学生（使用 @mail.ustc.edu.cn 邮箱注册）</li>
        <li>✅ 对 Web 开发有兴趣，不限技术水平</li>
        <li>✅ 愿意积极参与俱乐部活动</li>
      </ul>
    </div>

    <div class="card mt-16">
      <h2 class="mb-16">🛠️ 技术栈</h2>
      <p class="text-gray mb-16">俱乐部成员涵盖各种技术方向，欢迎所有 Web 相关技术的爱好者：</p>
      <div class="flex gap-8 flex-wrap">
        <span class="tag tag-blue">Vue.js</span>
        <span class="tag tag-blue">React</span>
        <span class="tag tag-green">Node.js</span>
        <span class="tag tag-green">Python</span>
        <span class="tag tag-orange">MySQL</span>
        <span class="tag tag-orange">MongoDB</span>
        <span class="tag tag-red">TypeScript</span>
        <span class="tag tag-blue">更多...</span>
      </div>
    </div>

    <div class="card mt-16 text-center">
      <h2 class="mb-16">🎉 准备好了吗？</h2>
      <p class="text-gray mb-16">加入我们，和一群有趣的科大同学一起 coding！</p>
      <div class="flex gap-8" style="justify-content:center">
        <router-link to="/register" class="btn btn-primary">立即注册</router-link>
        <router-link to="/activities" class="btn btn-success">查看活动</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hero { text-align: center; padding: 48px 24px; }
.hero h1 { font-size: 36px; color: #409eff; }
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.feature-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  text-align: center;
}
.feature-icon { font-size: 32px; margin-bottom: 8px; }
.feature-item h3 { margin-bottom: 8px; }
.join-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.join-list li { font-size: 15px; color: #303133; }
.flex-wrap { flex-wrap: wrap; }
.text-center { text-align: center; }
</style>
