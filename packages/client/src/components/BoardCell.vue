<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { pieceLabel } from '../i18n/pieces';
import type { Cell, Owner, Placed } from '../types';
import PieceToken from './PieceToken.vue';

const {
  cell,
  duel,
  piece,
  owner,
  legal,
  highlighted = false,
} = defineProps<{
  cell: Cell;
  duel: number;
  piece: Placed | null;
  owner: Owner;
  legal: boolean;
  highlighted?: boolean;
}>();

const emit = defineEmits<{ choose: []; hover: [active: boolean] }>();

const { t } = useI18n();

const label = computed(() => {
  const place = { column: cell.column + 1, row: cell.row + 1, duel };
  return piece === null
    ? t('cell.empty', place)
    : t('cell.occupied', {
        ...place,
        piece: pieceLabel(t, piece.pieceId),
        owner: t(owner === 'mine' ? 'cell.mine' : 'cell.theirs'),
      });
});
</script>

<template>
  <component
    :is="legal ? 'button' : 'div'"
    class="cell"
    :class="{ 'cell--legal': legal, 'cell--highlighted': highlighted }"
    :type="legal ? 'button' : undefined"
    :role="legal ? undefined : 'img'"
    :aria-label="label"
    @click="legal && emit('choose')"
    @pointerenter="emit('hover', true)"
    @pointerleave="emit('hover', false)"
    @focus="emit('hover', true)"
    @blur="emit('hover', false)"
  >
    <span class="cell__duel" aria-hidden="true">{{ duel }}</span>
    <PieceToken
      v-if="piece"
      :piece-id="piece.pieceId"
      :owner="owner"
      :nullified="piece.nullified"
    />
  </component>
</template>

<style scoped>
.cell {
  --piece-shape-size: 1.5rem;
  --piece-name-size: 0.7rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 0;
  inline-size: 100%;
  aspect-ratio: 1;
  max-inline-size: var(--size-cell);
  padding: var(--space-1);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-1);
  background: var(--color-cell);
}

.cell__duel {
  position: absolute;
  inset-block-start: 0.125rem;
  inset-inline-start: var(--duel-badge-start, auto);
  inset-inline-end: var(--duel-badge-end, 0.125rem);
  display: grid;
  place-items: center;
  min-inline-size: 1.25rem;
  block-size: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-strong);
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: 700;
  line-height: 1;
}

.cell--highlighted {
  border-color: var(--color-focus);
  background: var(--color-cell-selected);
}

.cell--highlighted .cell__duel {
  border-color: var(--color-focus);
  background: var(--color-focus);
  color: var(--color-bg);
}

.cell--legal {
  border-color: var(--color-accent);
  background: var(--color-cell-legal);
  cursor: pointer;
}
</style>
