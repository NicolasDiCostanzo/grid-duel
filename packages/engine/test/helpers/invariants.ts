import { expect } from 'vitest';
import { catalog, getPiece } from '../../src/catalog';
import { applyMove, legalMoves, type GameState } from '../../src/game';
import { matchStatus } from '../../src/match';
import { otherPlayer, ROWS, type Board, type PlayerId } from '../../src/round';
import { randomPicker } from './game';

type Placements = readonly [readonly string[], readonly string[]];

const ALL_IDS = catalog.map((piece) => piece.id).toSorted();
const PLAYERS = [0, 1] as const;
const SHORT_OFFER = 1;
const OFFER = 3;
const MAX_COPIES_ON_BOARDS = 2;

const pieces = (board: Board) => board.filter((placed) => placed !== null);

const hasActiveLone = (board: Board): boolean =>
  pieces(board).some(
    (placed) =>
      !placed.nullified && getPiece(placed.pieceId).effect === 'short-offer',
  );

export function checkInvariants(game: GameState, placements: Placements): void {
  const { round } = game;
  const over = game.winner !== null;
  const onBoards = round.boards.flatMap(pieces);
  const placedIds = new Set(placements.flat());

  for (const player of PLAYERS) {
    expect(round.boards[player]).toHaveLength(ROWS[round.boardSize] * 2);
    expect([...round.decks[player], ...placements[player]].toSorted()).toEqual(
      ALL_IDS,
    );
  }

  expect(onBoards.length).toBeLessThanOrEqual(placements.flat().length);
  for (const placed of onBoards) {
    if (placed.nullified) {
      expect(getPiece(placed.pieceId).effect).not.toBeNull();
    }
    if (!over) {
      expect(placedIds.has(placed.pieceId)).toBe(true);
      const copies = onBoards.filter(
        (other) => other.pieceId === placed.pieceId,
      ).length;
      expect(copies).toBeLessThanOrEqual(MAX_COPIES_ON_BOARDS);
    }
  }

  expect(matchStatus(game.results).winner).toBe(game.winner);
  expect(round.phase).toBe(over ? 'resolved' : 'placing');
  if (over) {
    expect(matchStatus(game.results.slice(0, -1)).winner).toBeNull();
    expect(legalMoves(game)).toEqual([]);
    return;
  }

  const current = round.currentPlayer;
  expect(current).not.toBeNull();
  expect(round.winner).toBeNull();
  expect(round.points).toEqual([0, 0]);
  expect(legalMoves(game).length).toBeGreaterThan(0);
  const player = current as PlayerId;
  expect(round.offer).toHaveLength(
    hasActiveLone(round.boards[otherPlayer(player)]) ? SHORT_OFFER : OFFER,
  );
  for (const pieceId of round.offer) {
    expect(round.decks[player]).toContain(pieceId);
  }
}

export function playChecked(
  game: GameState,
  options: { pickSeed: string; maxRounds: number },
): GameState {
  const pick = randomPicker(options.pickSeed);
  let placements: Placements = [[], []];
  let state = game;
  checkInvariants(state, placements);
  while (state.winner === null && state.results.length < options.maxRounds) {
    const move = pick(legalMoves(state));
    const player = state.round.currentPlayer as PlayerId;
    const next = applyMove(state, player, move).state;
    const roundEnded = next.results.length > state.results.length;
    placements =
      roundEnded && next.winner === null
        ? [[], []]
        : withPlaced(placements, player, move.pieceId);
    checkInvariants(next, placements);
    state = next;
  }
  return state;
}

const withPlaced = (
  placements: Placements,
  player: PlayerId,
  pieceId: string,
): Placements =>
  player === 0
    ? [[...placements[0], pieceId], placements[1]]
    : [placements[0], [...placements[1], pieceId]];
