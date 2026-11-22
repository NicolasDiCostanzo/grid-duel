<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PieceToken from './PieceToken.vue';

const { pieces, selected, disabled } = defineProps<{
  pieces: readonly string[];
  selected: string | null;
  disabled: boolean;
}>();

const emit = defineEmits<{ select: [pieceId: string] }>();

const { t } = useI18n();
</script>

<template>
  <section class="offer">
    <h2 class="offer__title">{{ t('match.offer') }}</h2>
    <ul class="offer__list">
      <li v-for="pieceId in pieces" :key="pieceId">
        <button
          type="button"
          class="offer__piece"
          :class="{ 'offer__piece--selected': pieceId === selected }"
          :aria-pressed="pieceId === selected"
          :disabled="disabled"
          @click="emit('select', pieceId)"
        >
          <PieceToken :piece-id="pieceId" owner="mine" />
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.offer__title {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-small);
  color: var(--color-muted);
  font-weight: 600;
}

.offer__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.offer__piece {
  min-inline-size: 5.5rem;
  padding: var(--space-2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-1);
  background: var(--color-surface);
  cursor: pointer;
}

.offer__piece:disabled {
  cursor: default;
  opacity: 0.55;
}

.offer__piece--selected {
  border-color: var(--color-accent);
  background: var(--color-cell-selected);
}
</style>
