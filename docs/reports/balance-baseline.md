# Balance report

Games per pairing: 100. Games of the analysis: 3000. Levels: easy, medium, hard. Boards: 2x2, 2x3. Seed: 1. Analysis level: easy. Hard bot rollouts: default.

Ordering of the levels: holds

## Board 2x2

### Pairings

Win rate of the stronger level over the weaker one. Seats alternate and every pairing plays the same deals.

| Pairing | Games | Wins | Win rate | 95% interval |
| --- | --- | --- | --- | --- |
| medium over easy | 100 | 67 | 67.0% | 57.3% to 75.4% |
| hard over easy | 100 | 97 | 97.0% | 91.5% to 99.0% |
| hard over medium | 100 | 90 | 90.0% | 82.6% to 94.5% |

### First player advantage (easy against itself)

| Rounds | First player wins | Second player wins | Draws | First player win rate | 95% interval |
| --- | --- | --- | --- | --- | --- |
| 7408 | 2990 | 3210 | 1208 | 48.2% | 47.0% to 49.5% |

The win rate counts the decided rounds only.

### Blessings (easy against itself)

Score of a player in a round: win 100%, draw 50%, loss 0%. "Rounds played" counts each player in each round once. The difference compares the rounds where a player placed a piece with the blessing with the other rounds.

Read the Shepherd blessings (Lone, Wandering, Guardian, Rotten+, False, Golden) with care: a Shepherd loses to every regular piece by type, so a negative difference mostly reflects that base weakness and is not specific to the blessing. Compare the Shepherds with each other.

| Blessing | Rounds played | Score when played | Score otherwise | Difference | Flagged |
| --- | --- | --- | --- | --- | --- |
| Just (`tie-win`) | 4744 | 53.0% | 48.6% | +4.4 points | no |
| Fallen (`shift-down`) | 4812 | 50.5% | 49.7% | +0.8 points | no |
| Risen (`shift-up`) | 4887 | 49.9% | 50.1% | -0.2 points | no |
| Prize (`win-bonus`) | 4841 | 54.3% | 47.9% | +6.4 points | yes |
| Rotten (`nullify-row`) | 4887 | 51.9% | 49.1% | +2.9 points | no |
| Scout (`replace`) | 4709 | 49.7% | 50.2% | -0.5 points | no |
| Mercenary (`swap-row`) | 4866 | 50.0% | 50.0% | +0.0 points | no |
| Marked (`drain`) | 4879 | 52.0% | 49.0% | +3.0 points | no |
| Trickster (`retype`) | 4877 | 48.6% | 50.7% | -2.1 points | no |
| Lone (`short-offer`) | 1746 | 33.6% | 52.2% | -18.6 points | yes |
| Wandering (`move-points`) | 1733 | 39.6% | 51.4% | -11.7 points | yes |
| Guardian (`round-win-vs-marked`) | 1720 | 37.3% | 51.7% | -14.3 points | yes |
| Rotten+ (`nullify-side`) | 1827 | 39.5% | 51.5% | -11.9 points | yes |
| False (`loss-points`) | 1831 | 65.8% | 47.8% | +18.0 points | yes |
| Golden (`double-points`) | 1764 | 49.6% | 50.1% | -0.5 points | no |

### Randomness of the offers and the draws

Rounds that end in a draw: 16.3%

How often the weaker level still wins the match.

| Pairing | Weaker level wins the match | 95% interval |
| --- | --- | --- |
| medium over easy | 33.0% | 24.6% to 42.7% |
| hard over easy | 3.0% | 1.0% to 8.5% |
| hard over medium | 10.0% | 5.5% to 17.4% |

## Board 2x3

### Pairings

Win rate of the stronger level over the weaker one. Seats alternate and every pairing plays the same deals.

| Pairing | Games | Wins | Win rate | 95% interval |
| --- | --- | --- | --- | --- |
| medium over easy | 100 | 68 | 68.0% | 58.3% to 76.3% |
| hard over easy | 100 | 100 | 100.0% | 96.3% to 100.0% |
| hard over medium | 100 | 96 | 96.0% | 90.2% to 98.4% |

### First player advantage (easy against itself)

| Rounds | First player wins | Second player wins | Draws | First player win rate | 95% interval |
| --- | --- | --- | --- | --- | --- |
| 7343 | 3055 | 3205 | 1083 | 48.8% | 47.6% to 50.0% |

The win rate counts the decided rounds only.

### Blessings (easy against itself)

Score of a player in a round: win 100%, draw 50%, loss 0%. "Rounds played" counts each player in each round once. The difference compares the rounds where a player placed a piece with the blessing with the other rounds.

Read the Shepherd blessings (Lone, Wandering, Guardian, Rotten+, False, Golden) with care: a Shepherd loses to every regular piece by type, so a negative difference mostly reflects that base weakness and is not specific to the blessing. Compare the Shepherds with each other.

| Blessing | Rounds played | Score when played | Score otherwise | Difference | Flagged |
| --- | --- | --- | --- | --- | --- |
| Just (`tie-win`) | 6699 | 52.3% | 48.1% | +4.1 points | no |
| Fallen (`shift-down`) | 6753 | 50.0% | 50.0% | -0.1 points | no |
| Risen (`shift-up`) | 6839 | 50.0% | 50.0% | +0.1 points | no |
| Prize (`win-bonus`) | 6828 | 52.3% | 48.0% | +4.3 points | no |
| Rotten (`nullify-row`) | 6782 | 51.3% | 48.8% | +2.5 points | no |
| Scout (`replace`) | 6696 | 50.6% | 49.5% | +1.1 points | no |
| Mercenary (`swap-row`) | 6781 | 49.6% | 50.3% | -0.7 points | no |
| Marked (`drain`) | 6795 | 50.6% | 49.5% | +1.1 points | no |
| Trickster (`retype`) | 6837 | 48.6% | 51.2% | -2.7 points | no |
| Lone (`short-offer`) | 2587 | 37.8% | 52.6% | -14.8 points | yes |
| Wandering (`move-points`) | 2619 | 44.2% | 51.3% | -7.1 points | yes |
| Guardian (`round-win-vs-marked`) | 2583 | 40.6% | 52.0% | -11.4 points | yes |
| Rotten+ (`nullify-side`) | 2688 | 44.6% | 51.2% | -6.6 points | yes |
| False (`loss-points`) | 2588 | 60.6% | 47.7% | +12.9 points | yes |
| Golden (`double-points`) | 2665 | 53.9% | 49.1% | +4.8 points | no |

### Randomness of the offers and the draws

Rounds that end in a draw: 14.7%

How often the weaker level still wins the match.

| Pairing | Weaker level wins the match | 95% interval |
| --- | --- | --- |
| medium over easy | 32.0% | 23.7% to 41.7% |
| hard over easy | 0.0% | 0.0% to 3.7% |
| hard over medium | 4.0% | 1.6% to 9.8% |

## Findings

- 2x2: the first player wins 48.2% of the decided rounds (95% interval 47.0% to 49.5%)
- 2x2: Prize (win-bonus) moves the round score by +6.4 points when played
- 2x2: Lone (short-offer) moves the round score by -18.6 points when played
- 2x2: Wandering (move-points) moves the round score by -11.7 points when played
- 2x2: Guardian (round-win-vs-marked) moves the round score by -14.3 points when played
- 2x2: Rotten+ (nullify-side) moves the round score by -11.9 points when played
- 2x2: False (loss-points) moves the round score by +18.0 points when played
- 2x3: Lone (short-offer) moves the round score by -14.8 points when played
- 2x3: Wandering (move-points) moves the round score by -7.1 points when played
- 2x3: Guardian (round-win-vs-marked) moves the round score by -11.4 points when played
- 2x3: Rotten+ (nullify-side) moves the round score by -6.6 points when played
- 2x3: False (loss-points) moves the round score by +12.9 points when played
