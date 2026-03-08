<template>
  <div>
    <h2 class="mb-16">活跃贡献排行榜</h2>
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
</style>
