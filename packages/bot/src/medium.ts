import { compareTypes, getPiece, type GameView, type Move } from '@game/engine';
import { pickMove } from './pick';
import type { Bot } from './types';

const SIDES = 2;

const typeWins = (mine: string, theirs: string): boolean =>
  compareTypes(getPiece(mine), getPiece(theirs)) === 'win';

const beatsFacingPiece = (view: GameView, move: Move): boolean => {
  const rows = view.boards[0].length / SIDES;
  const index = move.cell.column * rows + move.cell.row;
  const opponent = view.player === 0 ? 1 : 0;
  const ownPiece = view.boards[view.player][index]?.pieceId;
  const opponentPiece = view.boards[opponent][index]?.pieceId;
  const replaces = ownPiece !== undefined;
  const mine = replaces ? ownPiece : move.pieceId;
  const theirs = replaces ? move.pieceId : opponentPiece;
  return theirs !== undefined && typeWins(mine, theirs);
};

export const mediumBot: Bot = (view, rng) => {
  const winning = view.moves.filter((move) => beatsFacingPiece(view, move));
  return pickMove(winning.length > 0 ? winning : view.moves, rng);
};
