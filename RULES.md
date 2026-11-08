# Rules

The engine follows `docs/reference/flockade-rules.md` (copy of the original wiki page). This file lists where we differ from it and every choice the wiki does not settle. Entries marked "interpretation" are ours.

## Differences from the original

- No Trickster+ Shepherd blessing (marked unused on the wiki).
- No betting: there is no wool or stake.

## Interpretations

- Duel phase order: first the blessing effects, in sequence order 1 to 4, then the duels.
- Deck: each player has their own fixed deck of the 36 pieces (the wiki's count; the plain nullified Shepherd is a state, not a piece). A piece is consumed when placed, so it can be placed only once per game. The offered pieces that are not picked go back into that player's deck.
- First player: chosen at random for round 1. In later rounds the previous round's winner goes first; after a drawn round, the player who went first goes first again.
- Trickster: at the start of the duel phase it turns into a piece drawn at random (server-side, from the game's seed) among the two regular (unblessed) pieces of the other types (a Trickster Sword becomes a regular Shield or Scribe, and so on), so it never keeps its type or gains a blessing, at its place in the 1 to 4 sequence.
- Hard board (2x3): the 1 to 4 sequence extends column by column, right column first, top to bottom, over 3 rows of 2 columns.
- Guardian: "marked by the wolf" means a piece with the Marked blessing, and only those.
- Rotten and Rotten+: they nullify blessings only at the moment they are placed. Pieces placed on that side afterwards keep their blessing.
