<template>
  <div class="empty-state">
    <span class="empty-icon">{{ icon }}</span>
    <p class="empty-text">{{ text }}</p>
    <p v-if="hint" class="empty-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '○' },
  text: { type: String, required: true },
  hint: { type: String, default: '' }
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 64px 24px;
}
.empty-icon {
  display: block;
  font-size: 32px;
  margin-bottom: 16px;
  opacity: 0.3;
}
.empty-text {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.empty-hint {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
