import { describe, expect, it } from 'vitest';
import { SEED } from '../test/fixtures/rng';
import {
  activeLone,
  blessedPlaced,
  boardSizes,
  cellIndexes,
  firstPlayerSeedCount,
  hexSeedFor,
  invalidCells,
  loneOfferSizes,
  nullifyCases,
  nullifyPieces,
  plainPlaced,
  publicViewKeys,
  regularOffer,
  scoutOffer,
  scoutPiece,
  scoutTargets,
  skipOfferSizes,
} from '../test/fixtures/round';
import {
  errorCode,
  forceOffer,
  playFirstLegalMove,
  withFilledBoard,
  withPlaced,
} from '../test/helpers/round';
import { createDeck } from './deck';
import { createRng } from './rng';
import {
  applyMove,
  cellIndex,
  createRound,
  legalMoves,
  pickFirstPlayer,
  pieceAt,
  playerView,
  type BoardSize,
  type Cell,
  type PlayerId,
} from './round';

const newRound = (boardSize: BoardSize, firstPlayer: PlayerId = 0) =>
  createRound({ boardSize, firstPlayer, rng: createRng(SEED) });

const playToEnd = (boardSize: BoardSize) => {
  let state = newRound(boardSize);
  const players: (PlayerId | null)[] = [];
  while (state.phase === 'placing') {
    players.push(state.currentPlayer);
    state = playFirstLegalMove(state);
  }
  return { state, players };
};

describe('pickFirstPlayer', () => {
  it('is the same for the same seed', () => {
    expect(pickFirstPlayer(createRng(SEED))).toBe(
      pickFirstPlayer(createRng(SEED)),
    );
  });

  it('can pick either player', () => {
    const picked = new Set(
      Array.from({ length: firstPlayerSeedCount }, (_, index) =>
        pickFirstPlayer(createRng(hexSeedFor(index))),
      ),
    );
    expect(picked).toEqual(new Set([0, 1]));
  });
});

describe('cellIndex and pieceAt', () => {
  it.each(cellIndexes)('maps %s cell %o to index %i', (size, cell, index) => {
    expect(cellIndex(size, cell)).toBe(index);
  });

  it.each(invalidCells)('rejects the invalid cell %o', (cell) => {
    expect(errorCode(() => cellIndex('2x2', cell as never))).toBe(
      'invalid-cell',
    );
    expect(errorCode(() => pieceAt(newRound('2x2'), 0, cell as never))).toBe(
      'invalid-cell',
    );
  });

  it('returns null for an empty cell and the piece once placed', () => {
    const state = newRound('2x2');
    const [move] = legalMoves(state);
    expect(pieceAt(state, 0, move!.cell)).toBeNull();
    const next = applyMove(state, 0, move!);
    expect(pieceAt(next, 0, move!.cell)).toEqual({
      pieceId: move!.pieceId,
      nullified: false,
    });
  });
});

describe('createRound', () => {
  it.each(boardSizes)('starts an empty %s round', (boardSize, cells) => {
    const state = newRound(boardSize);
    expect(state.boardSize).toBe(boardSize);
    expect(state.phase).toBe('placing');
    expect(state.points).toEqual([0, 0]);
    expect(state.currentPlayer).toBe(0);
    expect(state.boards).toHaveLength(2);
    for (const board of state.boards) {
      expect(board).toEqual(Array(cells).fill(null));
    }
    const rng = createRng(SEED);
    expect(state.decks).toEqual([createDeck(rng), createDeck(rng)]);
    expect(state.offer).toHaveLength(3);
    expect(new Set(state.offer).size).toBe(3);
    for (const id of state.offer) {
      expect(state.decks[0]).toContain(id);
    }
  });

  it.each([0, 1] as const)(
    'gives the first turn to the chosen first player %i and remembers them',
    (firstPlayer) => {
      const state = newRound('2x2', firstPlayer);
      expect(state.currentPlayer).toBe(firstPlayer);
      expect(state.firstPlayer).toBe(firstPlayer);
    },
  );
});

describe('legalMoves', () => {
  it.each(boardSizes)(
    'lists every offered piece on every empty %s cell',
    (boardSize, cells) => {
      const state = newRound(boardSize);
      const moves = legalMoves(state);
      expect(moves).toHaveLength(state.offer.length * cells);
      expect(new Set(moves.map((move) => JSON.stringify(move))).size).toBe(
        moves.length,
      );
      for (const move of moves) {
        expect(state.offer).toContain(move.pieceId);
        expect(pieceAt(state, 0, move.cell)).toBeNull();
      }
    },
  );

  it('lists no move once the round is full', () => {
    expect(legalMoves(playToEnd('2x2').state)).toEqual([]);
  });
});

describe('applyMove', () => {
  it('places the piece and consumes it from the placer deck only', () => {
    const state = newRound('2x2');
    const [move] = legalMoves(state);
    const next = applyMove(state, 0, move!);
    expect(next.decks[0]).toHaveLength(35);
    expect(next.decks[0]).not.toContain(move!.pieceId);
    for (const id of state.offer.filter((id) => id !== move!.pieceId)) {
      expect(next.decks[0]).toContain(id);
    }
    expect(next.decks[1]).toEqual(state.decks[1]);
    expect(state.boards[0].every((placed) => placed === null)).toBe(true);
  });

  it('passes the turn with an offer drawn from the other player deck', () => {
    const state = newRound('2x2');
    const next = applyMove(state, 0, legalMoves(state)[0]!);
    expect(next.currentPlayer).toBe(1);
    expect(next.offer).toHaveLength(3);
    for (const id of next.offer) {
      expect(next.decks[1]).toContain(id);
    }
  });

  it('gives the same states for the same seed and moves', () => {
    const play = () => {
      let state = newRound('2x3');
      for (let move = 0; move < 5; move++) {
        state = playFirstLegalMove(state);
      }
      return state;
    };
    expect(play()).toEqual(play());
  });

  it.each(boardSizes)(
    'alternates the players and ends the %s round when both boards are full',
    (boardSize, cells, totalMoves) => {
      const { state, players } = playToEnd(boardSize);
      expect(players).toHaveLength(totalMoves);
      expect(players).toEqual(
        Array.from(
          { length: totalMoves },
          (_, index) => (index % 2) as PlayerId,
        ),
      );
      expect(state.phase).toBe('full');
      expect(state.currentPlayer).toBeNull();
      expect(state.offer).toEqual([]);
      for (const board of state.boards) {
        expect(board).toHaveLength(cells);
        expect(board.every((placed) => placed !== null)).toBe(true);
      }
    },
  );

  it('starts with the second player when they go first', () => {
    const state = newRound('2x2', 1);
    expect(applyMove(state, 1, legalMoves(state)[0]!).currentPlayer).toBe(0);
  });
});

describe('illegal moves', () => {
  const state = newRound('2x2');
  const move = legalMoves(state)[0]!;

  it('rejects a move by the player who is not on turn', () => {
    expect(errorCode(() => applyMove(state, 1, move))).toBe('wrong-turn');
  });

  it('rejects a piece that is not in the offer', () => {
    const notOffered = state.decks[0].find((id) => !state.offer.includes(id))!;
    expect(
      errorCode(() => applyMove(state, 0, { ...move, pieceId: notOffered })),
    ).toBe('not-offered');
  });

  it.each(invalidCells)('rejects the invalid cell %o', (cell) => {
    expect(
      errorCode(() => applyMove(state, 0, { ...move, cell: cell as never })),
    ).toBe('invalid-cell');
  });

  it('rejects an occupied cell', () => {
    const afterSecond = playFirstLegalMove(applyMove(state, 0, move));
    const [again] = legalMoves(afterSecond);
    expect(
      errorCode(() =>
        applyMove(afterSecond, 0, { ...again!, cell: move.cell }),
      ),
    ).toBe('occupied');
  });

  it('rejects any move once the round is full', () => {
    const { state: full } = playToEnd('2x2');
    expect(errorCode(() => applyMove(full, 0, move))).toBe('round-over');
    expect(errorCode(() => applyMove(full, 1, move))).toBe('round-over');
  });
});

describe('Lone', () => {
  it('gives the opponent an offer of 1 once a Lone is placed', () => {
    const state = forceOffer(newRound('2x2'), ['s.short-offer', 'r0', 'r1']);
    const next = applyMove(state, 0, {
      pieceId: 's.short-offer',
      cell: { column: 0, row: 0 },
    });
    expect(next.offer).toHaveLength(1);
  });

  it.each(loneOfferSizes)(
    'with a Lone nullified = %s on the placer board, the opponent offer has size %i',
    (nullified, expected) => {
      const base = withPlaced(
        newRound('2x2'),
        0,
        { column: 1, row: 1 },
        { pieceId: 's.short-offer', nullified },
      );
      const next = applyMove(base, 0, legalMoves(base)[0]!);
      expect(next.offer).toHaveLength(expected);
    },
  );
});

const scoutState = (
  boardSize: BoardSize,
  own: readonly Cell[],
  enemy: readonly Cell[],
) => {
  let state = forceOffer(newRound(boardSize), scoutOffer);
  for (const cell of own) {
    state = withPlaced(state, 0, cell, plainPlaced);
  }
  for (const cell of enemy) {
    state = withPlaced(state, 1, cell, plainPlaced);
  }
  return state;
};

describe('Scout', () => {
  it.each(scoutTargets)(
    '$name: lists the Scout only on its targets',
    ({ boardSize, own, enemy, scoutCells }) => {
      const state = scoutState(boardSize, own, enemy);
      const moves = legalMoves(state);
      const cellsOf = (pieceId: string) =>
        moves.filter((move) => move.pieceId === pieceId).map((m) => m.cell);
      expect(cellsOf(scoutPiece)).toEqual(scoutCells);
      expect(cellsOf('r1')).toHaveLength(
        state.boards[0].filter((placed) => placed === null).length,
      );
      for (const move of moves) {
        expect(() => applyMove(state, 0, move)).not.toThrow();
      }
    },
  );

  it('replaces the enemy piece and leaves the own board unchanged', () => {
    const cell: Cell = { column: 1, row: 0 };
    const state = scoutState('2x2', [], [cell]);
    const next = applyMove(state, 0, { pieceId: scoutPiece, cell });
    expect(pieceAt(next, 1, cell)).toEqual({
      pieceId: scoutPiece,
      nullified: false,
    });
    expect(next.boards[0]).toEqual(state.boards[0]);
    expect(next.decks[0]).toHaveLength(35);
    expect(next.decks[0]).not.toContain(scoutPiece);
    expect(next.decks[1]).toEqual(state.decks[1]);
    expect(next.currentPlayer).toBe(1);
  });

  it('is placed on the own board when the enemy board is empty', () => {
    const cell: Cell = { column: 0, row: 1 };
    const state = scoutState('2x2', [], []);
    const next = applyMove(state, 0, { pieceId: scoutPiece, cell });
    expect(pieceAt(next, 0, cell)).toEqual({
      pieceId: scoutPiece,
      nullified: false,
    });
    expect(next.boards[1]).toEqual(state.boards[1]);
  });

  it('rejects an empty enemy cell while an enemy piece exists', () => {
    const state = scoutState('2x2', [], [{ column: 1, row: 0 }]);
    expect(
      errorCode(() =>
        applyMove(state, 0, {
          pieceId: scoutPiece,
          cell: { column: 0, row: 0 },
        }),
      ),
    ).toBe('no-piece-to-replace');
  });
});

describe('skipping a player with a full board', () => {
  const emptyCell: Cell = { column: 1, row: 1 };
  const opponentFull = (blessed = plainPlaced, offer = regularOffer) =>
    withPlaced(
      withFilledBoard(forceOffer(newRound('2x2'), offer), 1, plainPlaced),
      1,
      { column: 0, row: 0 },
      blessed,
    );

  it('gives the turn to the same player again', () => {
    const next = applyMove(opponentFull(), 0, {
      pieceId: 'r1',
      cell: emptyCell,
    });
    expect(next.phase).toBe('placing');
    expect(next.currentPlayer).toBe(0);
    expect(next.offer).toHaveLength(3);
    for (const id of next.offer) {
      expect(next.decks[0]).toContain(id);
    }
  });

  it.each(skipOfferSizes)(
    'with %s on the full opponent board, the offer has size %i',
    (_, expected, placed) => {
      const next = applyMove(opponentFull(placed), 0, {
        pieceId: 'r1',
        cell: emptyCell,
      });
      expect(next.offer).toHaveLength(expected);
    },
  );

  it('keeps the turn after a Scout replaces an enemy piece, and the removed Lone no longer shortens the offer', () => {
    const state = opponentFull(activeLone, scoutOffer);
    const next = applyMove(state, 0, {
      pieceId: scoutPiece,
      cell: { column: 0, row: 0 },
    });
    expect(next.currentPlayer).toBe(0);
    expect(next.offer).toHaveLength(3);
  });

  it('ends the round once both boards are full', () => {
    const state = withFilledBoard(opponentFull(), 0, plainPlaced, [emptyCell]);
    const next = applyMove(state, 0, { pieceId: 'r1', cell: emptyCell });
    expect(next.phase).toBe('full');
    expect(next.currentPlayer).toBeNull();
  });
});

describe('Rotten and Rotten+', () => {
  it.each(nullifyCases)(
    '$name',
    ({ boardSize, pieceId, cell, nullifiedCells }) => {
      const state = withPlaced(
        withFilledBoard(
          forceOffer(newRound(boardSize), [pieceId, 'r1', 'r2']),
          1,
          blessedPlaced,
        ),
        1,
        { column: 1, row: 0 },
        plainPlaced,
      );
      const next = applyMove(state, 0, { pieceId, cell });
      const nullifiedIndexes = nullifiedCells.map((target) =>
        cellIndex(boardSize, target),
      );
      expect(next.boards[1]).toEqual(
        state.boards[1].map((placed, index) =>
          nullifiedIndexes.includes(index)
            ? { ...placed, nullified: true }
            : placed,
        ),
      );
      expect(next.boards[0].filter((placed) => placed !== null)).toEqual([
        { pieceId, nullified: false },
      ]);
    },
  );

  it.each(nullifyPieces)(
    '%s leaves an empty opponent board alone and pieces placed later active',
    (pieceId) => {
      const state = forceOffer(newRound('2x2'), [pieceId, 'r1', 'r2']);
      const after = applyMove(state, 0, {
        pieceId,
        cell: { column: 0, row: 0 },
      });
      expect(after.boards[1]).toEqual(state.boards[1]);
      const next = applyMove(forceOffer(after, [blessedPlaced.pieceId]), 1, {
        pieceId: blessedPlaced.pieceId,
        cell: { column: 0, row: 0 },
      });
      expect(pieceAt(next, 1, { column: 0, row: 0 })).toEqual(blessedPlaced);
    },
  );

  it.each(nullifyPieces)(
    '%s nullifies an enemy Lone, so it no longer shortens the offer',
    (pieceId) => {
      const state = withPlaced(
        withFilledBoard(
          forceOffer(newRound('2x2'), [pieceId, 'r1', 'r2']),
          1,
          plainPlaced,
        ),
        1,
        { column: 0, row: 0 },
        activeLone,
      );
      const next = applyMove(state, 0, {
        pieceId,
        cell: { column: 0, row: 0 },
      });
      expect(pieceAt(next, 1, { column: 0, row: 0 })?.nullified).toBe(true);
      expect(next.currentPlayer).toBe(0);
      expect(next.offer).toHaveLength(3);
    },
  );
});

describe('playerView', () => {
  it.each([0, 1] as const)(
    'exposes only public data to player %i',
    (player) => {
      const view = playerView(newRound('2x2'), player);
      expect(Object.keys(view).sort()).toEqual([...publicViewKeys].sort());
      expect(view.player).toBe(player);
    },
  );

  it('shows the offer to the player on turn only', () => {
    const state = newRound('2x2');
    expect(playerView(state, 0).offer).toEqual(state.offer);
    expect(playerView(state, 1).offer).toBeNull();
  });

  it('shows both boards and the own deck in sorted order', () => {
    const state = playFirstLegalMove(newRound('2x2'));
    const view = playerView(state, 1);
    const shuffled = [...state.decks[1]];
    expect(view.boards).toEqual(state.boards);
    expect(view.deck).toEqual(shuffled.toSorted());
    expect(view.deck).not.toEqual(shuffled);
    expect(state.decks[1]).toEqual(shuffled);
  });
});
