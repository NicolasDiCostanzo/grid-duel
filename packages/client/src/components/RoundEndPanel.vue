<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RoundSummary } from '../solo/useSoloMatch';

const { summary } = defineProps<{ summary: RoundSummary }>();

const emit = defineEmits<{ next: [] }>();

const { t } = useI18n();

const nextButton = useTemplateRef<HTMLButtonElement>('nextButton');
onMounted(() => nextButton.value?.focus());
</script>

<template>
  <section class="round-end" aria-live="polite">
    <h2 class="round-end__title">
      {{ t('roundEnd.title', { n: summary.round }) }}
    </h2>
    <p
      class="round-end__outcome"
      :class="`round-end__outcome--${summary.outcome}`"
    >
      {{ t(`roundEnd.${summary.outcome}`) }}
    </p>
    <p>
      {{
        t('roundEnd.score', {
          you: summary.points[0],
          opponent: summary.points[1],
        })
      }}
    </p>
    <button
      ref="nextButton"
      type="button"
      class="round-end__next"
      @click="emit('next')"
    >
      {{ t('roundEnd.next') }}
    </button>
  </section>
</template>

<style scoped>
.round-end {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-2);
  background: var(--color-surface);
}

.round-end__title {
  margin: 0;
}

.round-end__outcome {
  margin: 0;
  font-weight: 700;
}

.round-end__outcome--won {
  color: var(--color-win);
}

.round-end__outcome--lost {
  color: var(--color-loss);
}

.round-end__outcome--drawn {
  color: var(--color-draw);
}

.round-end__next {
  justify-self: start;
  padding: var(--space-2) var(--space-5);
  border: 0;
  border-radius: var(--radius-2);
  background: var(--color-accent);
  color: var(--color-accent-text);
  font-weight: 700;
  cursor: pointer;
}
</style>
