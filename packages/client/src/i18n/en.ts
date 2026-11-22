export const en = {
  product: { name: 'Tile Clash' },
  start: {
    title: 'New match',
    boardSize: 'Board size',
    botLevel: 'Opponent',
    play: 'Play',
    boardSizes: { '2x2': 'Small, 4 duels', '2x3': 'Large, 6 duels' },
    levels: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  },
  match: {
    round: 'Round {n}',
    yourBoard: 'Your board',
    opponentBoard: "Opponent's board",
    offer: 'Your pieces',
    yourTurn: 'Your turn: choose a piece, then a square.',
    chooseSquare: 'Choose a square for {piece}.',
    opponentTurn: 'The opponent is choosing.',
    tally: 'Rounds won: you {you}, opponent {opponent}',
    firstPlayer: 'You play first this round.',
    secondPlayer: 'The opponent plays first this round.',
    duelHint: 'Squares with the same number duel each other.',
    botError: 'The opponent could not play. Start a new match.',
  },
  cell: {
    empty: 'Empty square, column {column}, row {row}, duel {duel}',
    occupied: '{piece}, {owner}, column {column}, row {row}, duel {duel}',
    mine: 'yours',
    theirs: "opponent's",
  },
  roundEnd: {
    title: 'Round {n} is over',
    won: 'You win the round.',
    lost: 'The opponent wins the round.',
    drawn: 'The round is drawn.',
    score: 'Points: you {you}, opponent {opponent}',
    next: 'Next round',
  },
  result: {
    title: 'Match over',
    won: 'You win the match.',
    lost: 'The opponent wins the match.',
    rounds: 'Rounds won: you {you}, opponent {opponent}',
    again: 'Play again',
    settings: 'New settings',
  },
  piece: { nullified: 'blessing cancelled' },
  points: 'no points | {n} point | {n} points',
  pieces: {
    types: { r0: 'Rock', r1: 'Paper', r2: 'Scissors' },
    blessed: '{blessing} {type}',
    // A blessing is an effect on a regular piece (Rock, Paper or Scissors).
    // The keys are the engine's effect ids in camelCase.
    blessings: {
      // tie-win: wins the tie against a piece of its own type; two of them tie.
      tieWin: 'Tiebreaker',
      // shift-down: when the duels begin, every piece in its column moves down
      // one square, the bottom one wrapping to the top.
      shiftDown: 'Sinker',
      // shift-up: the same, upwards.
      shiftUp: 'Riser',
      // win-bonus: scores 2 points instead of 1 when it wins a duel.
      winBonus: 'Bounty',
      // nullify-row: when placed, cancels the blessings of the opponent's
      // pieces in the row with the same row number.
      nullifyRow: 'Muffler',
      // replace: must be placed on an opponent piece when there is one, which
      // removes that piece and puts the Intruder on the opponent's board;
      // otherwise it is placed like any piece.
      replace: 'Intruder',
      // swap-row: when the duels begin, swaps places with the piece beside it
      // in the same row.
      swapRow: 'Switcher',
      // drain: when it wins a duel, the opponent loses 1 point (never below 0).
      drain: 'Drainer',
      // retype: when the duels begin, becomes a plain piece of one of the two
      // other types, chosen at random.
      retype: 'Chameleon',
    },
    keeper: '{name} Keeper',
    // A Keeper is the fourth type: it loses to every regular piece and ties
    // with another Keeper. The keys are the engine's effect ids in camelCase.
    keepers: {
      // short-offer: while it is active, the opponent is offered 1 piece
      // instead of 3 on each turn.
      shortOffer: 'Narrowing',
      // move-points: its owner gains 2 points each time this piece moves,
      // whatever moved it.
      movePoints: 'Roaming',
      // round-win-vs-marked: if it faces a piece with the drain blessing, its
      // owner wins the whole round at once.
      roundWinVsMarked: 'Warding',
      // nullify-side: when placed, cancels the blessings of all the
      // opponent's pieces.
      nullifySide: 'Silencing',
      // loss-points: when it loses a duel, its owner gets 2 points and the
      // winner of that duel gets none.
      lossPoints: 'Decoy',
      // double-points: doubles the points its owner wins in duels.
      doublePoints: 'Amplifying',
    },
  },
};

export type Messages = typeof en;
