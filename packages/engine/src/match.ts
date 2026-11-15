import { otherPlayer, type PlayerId } from './round';

export type RoundResult = PlayerId | 'draw';

export type MatchStatus = {
  wins: readonly [number, number];
  winner: PlayerId | null;
};

const WINS_NEEDED = 2;

export function matchStatus(results: readonly RoundResult[]): MatchStatus {
  const won = (player: PlayerId) =>
    results.filter((result) => result === player || result === 'draw').length;
  const wins = [won(0), won(1)] as const;
  const leader = wins[0] > wins[1] ? 0 : 1;
  const leads = wins[leader] > wins[otherPlayer(leader)];
  return {
    wins,
    winner: leads && wins[leader] >= WINS_NEEDED ? leader : null,
  };
}

export const nextFirstPlayer = (
  previousFirst: PlayerId,
  roundWinner: RoundResult,
): PlayerId => (roundWinner === 'draw' ? previousFirst : roundWinner);
