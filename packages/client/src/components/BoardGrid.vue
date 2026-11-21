<script setup lang="ts">
import { computed, useId } from 'vue';
import type { BoardSize } from '@game/engine';
import type { Cell, Owner, Placed } from '../types';
import BoardCell from './BoardCell.vue';

const { boardSize, cells, owner, legalCells, title } = defineProps<{
  boardSize: BoardSize;
  cells: readonly (Placed | null)[];
  owner: Owner;
  legalCells: readonly Cell[];
  title: string;
}>();

const emit = defineEmits<{ choose: [cell: Cell] }>();

const headingId = useId();
const rows = computed(() => (boardSize === '2x2' ? 2 : 3));

const squares = computed(() =>
  Array.from({ length: rows.value * 2 }, (_, position) => {
    const row = Math.floor(position / 2);
    const column = (position % 2) as 0 | 1;
    const cell: Cell = { column, row };
    return {
      cell,
      piece: cells[column * rows.value + row] ?? null,
      legal: legalCells.some(
        (legalCell) => legalCell.column === column && legalCell.row === row,
      ),
    };
  }),
);
</script>

<template>
  <section class="board" :aria-labelledby="headingId">
    <h2 :id="headingId" class="board__title">{{ title }}</h2>
    <div class="board__grid">
      <BoardCell
        v-for="square in squares"
        :key="`${square.cell.column}-${square.cell.row}`"
        :cell="square.cell"
        :piece="square.piece"
        :owner="owner"
        :legal="square.legal"
        @choose="emit('choose', square.cell)"
      />
    </div>
  </section>
</template>

<style scoped>
.board__title {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-small);
  color: var(--color-muted);
  font-weight: 600;
}

.board__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, var(--size-cell)));
  gap: var(--space-2);
  justify-content: center;
}
</style>
