<template>
  <div>
    <div class="flex-between mb-16">
      <h2>活跃贡献排行榜</h2>
      <a href="#rules" @click.prevent="showRules = !showRules" class="text-small" style="color:#409eff;cursor:pointer">
        📋 积分规则说明
      </a>
    </div>
    <div v-if="showRules" class="card mb-16 rules-box">
      <h4 class="mb-16">积分规则说明</h4>
      <ul class="rules-list">
        <li>📌 报名参加活动：<strong>+5 分</strong></li>
        <li>📌 取消活动报名：<strong>-5 分</strong></li>
        <li>📌 提交新项目：<strong>+10 分</strong></li>
        <li>📌 参与投票：<strong>+2 分</strong></li>
      </ul>
    </div>
    <div class="card">
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
          <tr v-for="(user, index) in users" :key="user.id" :class="{ 'top-3': index < 3 }">
            <td>
              <span v-if="index === 0" class="medal gold">1</span>
              <span v-else-if="index === 1" class="medal silver">2</span>
              <span v-else-if="index === 2" class="medal bronze">3</span>
              <span v-else>{{ index + 1 }}</span>
            </td>
            <td>
              <router-link :to="`/profile/${user.id}`">{{ user.username }}</router-link>
            </td>
            <td><strong>{{ user.contributionPoints }}</strong></td>
            <td>{{ user.participationCount }}</td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="text-gray" style="text-align:center">暂无数据</td>
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
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}
.leaderboard-table th, .leaderboard-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}
.leaderboard-table th {
  color: #909399;
  font-size: 13px;
  font-weight: 600;
}
.top-3 { background: #fdf6ec; }
.medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}
.gold { background: #e6a23c; }
.silver { background: #909399; }
.bronze { background: #b8860b; }
.rules-box { background: #f0f9ff; border-left: 4px solid #409eff; }
.rules-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.rules-list li { font-size: 14px; color: #606266; }
</style>
