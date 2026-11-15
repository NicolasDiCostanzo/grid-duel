# Rules

The engine follows `docs/reference/flockade-rules.md` (copy of the original wiki page). This file lists where we differ from it and every choice the wiki does not settle. Entries marked "interpretation" are ours.

## Differences from the original

- No Trickster+ Shepherd blessing (marked unused on the wiki).
- No betting: there is no wool or stake.
- No tied match: the original ends a match in a tie when both players reach 2 round wins. Here play continues (see "Match winner" under Interpretations).

## Interpretations

- Duel phase order: first the blessing effects, in sequence order 1 to 4, then the duels.
- Deck: each player has their own deck of the 36 pieces, rebuilt in full at the start of every round. A placed piece is consumed for the rest of the round, so it can be placed only once per round. The unpicked offered pieces go back into the deck.
- Match winner: a drawn round counts as a win for both players, in every round including extra ones. After each round the match ends if one player has at least 2 round wins and strictly more round wins than the opponent, and that player wins. Otherwise another round is played, with no limit on the number of rounds.
- Layout: each player has their own board, 2 columns by 2 rows (2x2) or by 3 rows (2x3). The two boards face each other, and a duel pairs the cells in the same column and row on the two boards.
- Duel phase start: the duels begin only when every cell of both boards holds a piece.
- Lone: as long as an active (not nullified) Lone sits on a player's board, the opponent's offer has 1 piece instead of 3 on every one of their turns, not only the turn after the Lone is placed. If the Lone is nullified or replaced by a Scout, offers return to 3.
- Rotten: it nullifies the blessings on the opponent's row that has the same row index as the Rotten's own row.
- Scout: it is played on an enemy piece's cell, so on the opponent's board. That piece is removed from the game and the Scout takes its cell. A piece counts for the board side it sits on, whoever placed it, and the Scout duels as its own type. When the opponent's board holds no piece, the Scout is placed like any piece, on an empty cell of its player's own board. Playing a Scout counts as the turn's placement.
- Turns: players alternate. A player whose board is full is skipped and the other player plays again, which only happens after a Scout replaced a piece instead of filling a cell.
- First player: chosen at random for round 1. In later rounds the previous round's winner goes first; after a drawn round, the player who went first goes first again.
- Trickster: at the start of the duel phase it turns into a piece drawn at random (server-side, from the game's seed) among the two regular (unblessed) pieces of the other types (a Trickster Sword becomes a regular Shield or Scribe, and so on), so it never keeps its type or gains a blessing, at its place in the 1 to 4 sequence.
- Hard board (2x3): the 1 to 4 sequence extends column by column, right column first, top to bottom, over 3 rows of 2 columns.
- Guardian: "marked by the wolf" means a piece with the Marked blessing, and only those.
- Effects phase: once both boards are full, the effects that move or transform pieces (Fallen, Risen, Mercenary, Trickster) are applied for both players, then the duels begin. A Wandering Shepherd earns its points during this phase.
- Sequence: the slots run right column (column 1) first, then left column (column 0), top to bottom. Each piece with an effect acts once, at the position of the cell it started the phase on, and acts from the cell it holds at that moment. At the same position, the round's first player resolves first. Effects only touch the board they sit on, so the two sides never affect each other.
- Fallen and Risen: all pieces of the column, on the board of the piece, move one square; the piece pushed off one end appears at the other end (wrap-around, because a full board has no free square). A moved piece keeps its nullified state. A nullified Fallen or Risen does nothing.
- Mercenary: it swaps with the piece of the other column in its current row, on its own board. A nullified Mercenary does nothing.
- Trickster, resolution: each active Trickster makes one draw of the game's seeded generator at its place in the sequence, and a nullified Trickster makes none. It stays on its cell, becomes a plain piece and does not act again.
- Wandering: it earns 2 points for each move of the piece, whatever moved it (Fallen, Risen or Mercenary swap), for the player whose board it sits on. The points are added to the round score in the effects phase. A nullified Wandering earns nothing.
- Rotten and Rotten+: they nullify blessings only at the moment they are placed. Pieces placed on that side afterwards keep their blessing.
- Just: it wins the tie against a piece of its own type, whatever that piece's blessing. Two Just pieces of the same type tie. A nullified Just is a plain piece.
- Duels: once the effects phase is over, the pairs are resolved in sequence order (right column first, top to bottom, then the left column). A won duel gives 1 point and a tie gives none. The round score starts with the points earned in the effects phase. The round winner has the most points, and equal points make a drawn round.
- Duel points: a win gives 1 point, or 2 with an active Prize. An active Golden doubles the duel points its owner wins, wherever it sits on that board (a Prize win gives 4). It does not double the opponent's points, the False points or the Marked deduction. When an active False loses, its owner gets 2 points and the winner of that duel gets none. When an active Marked wins, the opponent loses 1 point.
- Simultaneous changes: inside one duel the changes to both scores are added up first, then each score is floored at 0, so a Marked winning against a False gives the False owner +2 -1 = +1. The `points` event carries the actual signed change of each player, the winner first, and is omitted when nothing changes.
