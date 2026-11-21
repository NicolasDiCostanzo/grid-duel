<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { round, wins } = defineProps<{
  round: number;
  wins: readonly [you: number, opponent: number];
}>();

const { t } = useI18n();
</script>

<template>
  <p class="score">
    <strong class="score__round">{{ t('match.round', { n: round }) }}</strong>
    <span class="score__tally">
      {{ t('match.tally', { you: wins[0], opponent: wins[1] }) }}
    </span>
  </p>
</template>

<style scoped>
.score {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  margin: 0;
}

.score__tally {
  color: var(--color-muted);
}
</style>
