<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { pieceLabel } from '../i18n/pieces';
import type { Cell, Owner, Placed } from '../types';
import PieceToken from './PieceToken.vue';

const { cell, piece, owner, legal } = defineProps<{
  cell: Cell;
  piece: Placed | null;
  owner: Owner;
  legal: boolean;
}>();

const emit = defineEmits<{ choose: [] }>();

const { t } = useI18n();

const label = computed(() => {
  const place = { column: cell.column + 1, row: cell.row + 1 };
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
    :class="{ 'cell--legal': legal }"
    :type="legal ? 'button' : undefined"
    :role="legal ? undefined : 'img'"
    :aria-label="label"
    @click="legal && emit('choose')"
  >
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

.cell--legal {
  border-color: var(--color-accent);
  background: var(--color-cell-legal);
  cursor: pointer;
}
</style>
