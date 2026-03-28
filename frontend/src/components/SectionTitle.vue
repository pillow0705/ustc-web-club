<template>
  <div class="section-header">
    <h2 class="section-title">{{ title }}</h2>
    <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.section-header {
  margin-bottom: 28px;
}
.section-title {
  font-family: Georgia, serif;
  font-size: 26px;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.section-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
