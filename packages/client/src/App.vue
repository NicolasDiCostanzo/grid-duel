<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <main class="app">
    <h1 class="app__title">{{ t('product.name') }}</h1>
  </main>
</template>

<style scoped>
.app {
  max-inline-size: var(--width-content);
  margin-inline: auto;
  padding: var(--space-4);
}

.app__title {
  margin: 0;
  font-size: var(--font-size-title);
}
</style>
