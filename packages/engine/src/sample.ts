import { catalog } from './catalog';
import { resolveDuels } from './duels';
import type { GameView } from './game';
import { resolveMoves } from './moves';
import { createRng } from './rng';
import {
  applyMove,
  legalMoves,
  otherPlayer,
  withPlayer,
  type Move,
  type PlayerId,
  type RoundState,
} from './round';

export type SampledRound = {
  winner: PlayerId | 'draw';
  points: readonly [number, number];
};

const SEED_DIGITS = 32;
const HEX = 16;

const seedFrom = (source: { nextInt(max: number): number }): string =>
  Array.from({ length: SEED_DIGITS }, () =>
    source.nextInt(HEX).toString(HEX),
  ).join('');

export function sampleRound(
  view: GameView,
  move: Move,
  source: { nextInt(max: number): number },
): SampledRound {
  const isLegal = view.moves.some(
    (legal) =>
      legal.pieceId === move.pieceId &&
      legal.cell.column === move.cell.column &&
      legal.cell.row === move.cell.row,
  );
  if (!isLegal || view.offer === null) {
    throw new Error('The move is not legal in this view');
  }
  const picks = createRng(seedFrom(source));
  const opponent = otherPlayer(view.player);
  const seen = new Set(
    view.boards[opponent].flatMap((placed) => (placed ? [placed.pieceId] : [])),
  );
  const unseen = catalog.map((piece) => piece.id).filter((id) => !seen.has(id));
  for (let index = 0; index < unseen.length; index++) {
    const other = index + picks.nextInt(unseen.length - index);
    [unseen[index], unseen[other]] = [
      unseen[other] as string,
      unseen[index] as string,
    ];
  }
  const decks: RoundState['decks'] = withPlayer(
    withPlayer([[], []], view.player, view.deck),
    opponent,
    unseen,
  );
  let state: RoundState = {
    boardSize: view.boardSize,
    boards: view.boards,
    decks,
    firstPlayer: view.firstPlayer,
    points: [0, 0],
    currentPlayer: view.player,
    offer: view.offer,
    phase: 'placing',
    rngState: createRng(seedFrom(source)).snapshot(),
    winner: null,
  };
  state = applyMove(state, view.player, move);
  while (state.phase === 'placing') {
    const options = legalMoves(state);
    const choice = options[picks.nextInt(options.length)] as Move;
    state = applyMove(state, state.currentPlayer as PlayerId, choice);
  }
  const { winner, points } = resolveDuels(resolveMoves(state).state).state;
  return { winner: winner as PlayerId | 'draw', points };
}
