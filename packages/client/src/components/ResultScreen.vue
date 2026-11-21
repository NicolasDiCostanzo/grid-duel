<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { MatchResult } from '../solo/useSoloMatch';

const { result } = defineProps<{ result: MatchResult }>();

const emit = defineEmits<{ again: []; settings: [] }>();

const { t } = useI18n();
</script>

<template>
  <section class="result">
    <h1 class="result__title">{{ t('result.title') }}</h1>
    <p class="result__outcome" :class="`result__outcome--${result.outcome}`">
      {{ t(`result.${result.outcome}`) }}
    </p>
    <p>
      {{
        t('result.rounds', { you: result.wins[0], opponent: result.wins[1] })
      }}
    </p>
    <div class="result__actions">
      <button type="button" class="result__again" @click="emit('again')">
        {{ t('result.again') }}
      </button>
      <button type="button" class="result__settings" @click="emit('settings')">
        {{ t('result.settings') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.result {
  display: grid;
  gap: var(--space-3);
}

.result__title {
  margin: 0;
  font-size: var(--font-size-title);
}

.result__outcome {
  margin: 0;
  font-weight: 700;
}

.result__outcome--won {
  color: var(--color-win);
}

.result__outcome--lost {
  color: var(--color-loss);
}

.result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.result__again {
  padding: var(--space-2) var(--space-5);
  border: 0;
  border-radius: var(--radius-2);
  background: var(--color-accent);
  color: var(--color-accent-text);
  font-weight: 700;
  cursor: pointer;
}

.result__settings {
  padding: var(--space-2) var(--space-5);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-2);
  background: var(--color-surface);
  cursor: pointer;
}
</style>
