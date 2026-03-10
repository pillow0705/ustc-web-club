<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">排行榜</h1>
        <p class="text-gray text-small">贡献积分越高，排名越靠前</p>
      </div>
      <button class="btn btn-ghost btn-small" @click="showRules = !showRules">
        📋 积分规则
      </button>
    </div>

    <!-- 积分规则 -->
    <div v-if="showRules" class="rules-card card">
      <h4 class="mb-16" style="color:var(--text-primary)">📋 积分规则说明</h4>
      <div class="rules-grid">
        <div class="rule-item">
          <span class="rule-points plus">+5</span>
          <span>报名参加活动</span>
        </div>
        <div class="rule-item">
          <span class="rule-points minus">-5</span>
          <span>取消活动报名</span>
        </div>
        <div class="rule-item">
          <span class="rule-points plus">+10</span>
          <span>提交新项目到项目池</span>
        </div>
        <div class="rule-item">
          <span class="rule-points plus">+2</span>
          <span>参与项目评论互动</span>
        </div>
      </div>
    </div>

    <!-- 前三名 -->
    <div v-if="users.length >= 3" class="top3-row">
      <!-- 第2名 -->
      <div class="top3-card silver">
        <div class="top3-rank">2</div>
        <div class="top3-avatar">{{ users[1]?.username?.charAt(0).toUpperCase() }}</div>
        <div class="top3-name">{{ users[1]?.username }}</div>
        <div class="top3-pts">{{ users[1]?.contributionPoints }} <span>分</span></div>
      </div>
      <!-- 第1名 -->
      <div class="top3-card gold">
        <div class="top3-crown">👑</div>
        <div class="top3-rank">1</div>
        <div class="top3-avatar gold-avatar">{{ users[0]?.username?.charAt(0).toUpperCase() }}</div>
        <div class="top3-name">{{ users[0]?.username }}</div>
        <div class="top3-pts">{{ users[0]?.contributionPoints }} <span>分</span></div>
      </div>
      <!-- 第3名 -->
      <div class="top3-card bronze">
        <div class="top3-rank">3</div>
        <div class="top3-avatar">{{ users[2]?.username?.charAt(0).toUpperCase() }}</div>
        <div class="top3-name">{{ users[2]?.username }}</div>
        <div class="top3-pts">{{ users[2]?.contributionPoints }} <span>分</span></div>
      </div>
    </div>

    <!-- 完整列表 -->
    <div class="card" style="padding:0;overflow:hidden">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>成员</th>
            <th>贡献积分</th>
            <th>参与次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id" :class="{ 'row-highlight': index < 3 }">
            <td>
              <span v-if="index === 0" class="medal" style="background:linear-gradient(135deg,#f59e0b,#d97706)">1</span>
              <span v-else-if="index === 1" class="medal" style="background:linear-gradient(135deg,#94a3b8,#64748b)">2</span>
              <span v-else-if="index === 2" class="medal" style="background:linear-gradient(135deg,#b45309,#92400e)">3</span>
              <span v-else class="rank-num">{{ index + 1 }}</span>
            </td>
            <td>
              <router-link :to="`/profile/${user.id}`" class="user-link">
                <div class="user-avatar">{{ user.username?.charAt(0).toUpperCase() }}</div>
                {{ user.username }}
              </router-link>
            </td>
            <td>
              <span class="pts-badge">{{ user.contributionPoints }}</span>
            </td>
            <td class="text-secondary">{{ user.participationCount }}</td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="text-center text-gray" style="padding:40px">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const users = ref([])
const showRules = ref(false)

onMounted(async () => {
  try { users.value = await api.get('/users') } catch {}
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 800; }

/* Rules */
.rules-card { border-left: 3px solid var(--accent); margin-bottom: 20px; }
.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.rule-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}
.rule-points {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  padding: 3px 8px;
  border-radius: 6px;
}
.rule-points.plus  { background: rgba(16,185,129,0.15); color: #6ee7b7; }
.rule-points.minus { background: rgba(244,63,94,0.15);  color: #fda4af; }

/* Top 3 */
.top3-row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}
.top3-card {
  flex: 1;
  max-width: 200px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 16px;
  text-align: center;
  position: relative;
}
.gold   { border-color: rgba(245,158,11,0.4); box-shadow: 0 0 20px rgba(245,158,11,0.1); }
.silver { border-color: rgba(148,163,184,0.3); }
.bronze { border-color: rgba(180,83,9,0.3); }

.top3-crown { font-size: 24px; margin-bottom: 4px; }
.top3-rank {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.top3-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 10px;
}
.gold-avatar {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 0 16px rgba(245,158,11,0.4);
}
.top3-name { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.top3-pts {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
}
.top3-pts span { font-size: 12px; color: var(--text-secondary); font-weight: 400; }

/* Table */
.leaderboard-table { width: 100%; border-collapse: collapse; }
.leaderboard-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}
.leaderboard-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.leaderboard-table tr:last-child td { border-bottom: none; }
.row-highlight td { background: rgba(99, 102, 241, 0.04); }

.medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
}
.rank-num { color: var(--text-muted); font-size: 14px; padding-left: 4px; }

.user-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-weight: 500;
}
.user-link:hover { color: #a5b4fc; }
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}
.pts-badge {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(99,102,241,0.15);
  color: #a5b4fc;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 13px;
}
</style>
