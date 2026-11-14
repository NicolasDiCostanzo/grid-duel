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
- First player: chosen at random for round 1. In later rounds the previous round's winner goes first; after a drawn round, the player who went first goes first again.
- Trickster: at the start of the duel phase it turns into a piece drawn at random (server-side, from the game's seed) among the two regular (unblessed) pieces of the other types (a Trickster Sword becomes a regular Shield or Scribe, and so on), so it never keeps its type or gains a blessing, at its place in the 1 to 4 sequence.
- Hard board (2x3): the 1 to 4 sequence extends column by column, right column first, top to bottom, over 3 rows of 2 columns.
- Guardian: "marked by the wolf" means a piece with the Marked blessing, and only those.
- Rotten and Rotten+: they nullify blessings only at the moment they are placed. Pieces placed on that side afterwards keep their blessing.
