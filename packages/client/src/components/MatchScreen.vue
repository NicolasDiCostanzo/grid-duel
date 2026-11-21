<script setup lang="ts">
import { getPiece, type GameView, type Move } from '@game/engine';
import { computed, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { pieceLabel } from '../i18n/pieces';
import type { Cell } from '../types';
import BoardGrid from './BoardGrid.vue';
import OfferTray from './OfferTray.vue';
import ScoreBar from './ScoreBar.vue';

const { view, thinking } = defineProps<{
  view: GameView;
  thinking: boolean;
}>();

const emit = defineEmits<{ play: [move: Move] }>();

const { t } = useI18n();

const chosen = shallowRef<string | null>(null);

const offer = computed(() => view.offer ?? []);
const selected = computed(() =>
  chosen.value !== null && offer.value.includes(chosen.value)
    ? chosen.value
    : null,
);
const canPlay = computed(() => !thinking && view.moves.length > 0);

const opponentSide = computed(() => (view.player === 0 ? 1 : 0));

const landsOnOpponent = (move: Move): boolean =>
  getPiece(move.pieceId).effect === 'replace' &&
  view.boards[opponentSide.value].some((placed) => placed !== null);

const targets = computed(() => {
  const moves = view.moves.filter((move) => move.pieceId === selected.value);
  const cellsOf = (onOpponent: boolean): Cell[] =>
    moves
      .filter((move) => landsOnOpponent(move) === onOpponent)
      .map((move) => move.cell);
  return { own: cellsOf(false), opponent: cellsOf(true) };
});

const status = computed(() => {
  if (thinking) {
    return t('match.opponentTurn');
  }
  if (selected.value !== null) {
    return t('match.chooseSquare', { piece: pieceLabel(t, selected.value) });
  }
  return canPlay.value ? t('match.yourTurn') : '';
});

const wins = computed(() => view.wins);

function choose(cell: Cell): void {
  if (selected.value === null) {
    return;
  }
  emit('play', { pieceId: selected.value, cell });
  chosen.value = null;
}
</script>

<template>
  <div class="match">
    <ScoreBar :round="view.results.length + 1" :wins="wins" />
    <p class="match__status" aria-live="polite">{{ status }}</p>
    <BoardGrid
      :board-size="view.boardSize"
      :cells="view.boards[opponentSide]"
      owner="theirs"
      :legal-cells="targets.opponent"
      :title="t('match.opponentBoard')"
      @choose="choose"
    />
    <BoardGrid
      :board-size="view.boardSize"
      :cells="view.boards[view.player]"
      owner="mine"
      :legal-cells="targets.own"
      :title="t('match.yourBoard')"
      @choose="choose"
    />
    <OfferTray
      :pieces="offer"
      :selected="selected"
      :disabled="!canPlay"
      @select="chosen = $event"
    />
  </div>
</template>

<style scoped>
.match {
  display: grid;
  gap: var(--space-4);
}

.match__status {
  min-block-size: 1.5em;
  margin: 0;
}
</style>
