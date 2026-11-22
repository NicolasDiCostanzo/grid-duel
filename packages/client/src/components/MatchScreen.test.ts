import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import { humanView } from '../../test/helpers/views';
import MatchScreen from './MatchScreen.vue';

const mountMatch = (
  props: Parameters<typeof humanView>[0] & { thinking?: boolean } = {},
) => {
  const { thinking = false, ...viewOptions } = props;
  return mountWithI18n(MatchScreen, {
    props: { view: humanView(viewOptions), thinking },
  });
};

describe('MatchScreen', () => {
  it('shows the round, both boards and the pieces on offer', () => {
    const wrapper = mountMatch({
      offer: ['r0', 'r1', 'r2'],
      wins: [1, 0],
      results: [0],
    });
    expect(wrapper.text()).toContain('Round 2');
    expect(wrapper.text()).toContain('Rounds won: you 1, opponent 0');
    const titles = wrapper.findAll('h2').map((title) => title.text());
    expect(titles).toEqual(['Your board', "Opponent's board", 'Your pieces']);
    expect(wrapper.findAll('.offer__piece')).toHaveLength(3);
  });

  it('asks the player to choose a piece first', () => {
    expect(mountMatch({ offer: ['r0', 'r1', 'r2'] }).text()).toContain(
      'Your turn: choose a piece, then a square.',
    );
  });

  it('highlights the squares of the chosen piece on the own board', async () => {
    const wrapper = mountMatch({
      offer: ['r0', 'r1', 'r2'],
      own: ['r1', null, null, null],
    });
    expect(wrapper.findAll('.cell--legal')).toHaveLength(0);
    await wrapper.findAll('.offer__piece')[0]?.trigger('click');
    const legal = wrapper.findAll('.cell--legal');
    expect(legal).toHaveLength(3);
    expect(wrapper.text()).toContain('Choose a square for Rock.');
    const boards = wrapper.findAll('section.board');
    expect(boards[0]?.findAll('.cell--legal')).toHaveLength(3);
    expect(boards[1]?.findAll('.cell--legal')).toHaveLength(0);
  });

  it('plays the chosen piece on the chosen square', async () => {
    const wrapper = mountMatch({ offer: ['r0', 'r1', 'r2'] });
    await wrapper.findAll('.offer__piece')[1]?.trigger('click');
    await wrapper.findAll('button.cell--legal')[1]?.trigger('click');
    expect(wrapper.emitted('play')).toEqual([
      [{ pieceId: 'r1', cell: { column: 1, row: 0 } }],
    ]);
  });

  it('forgets the chosen piece once it is played', async () => {
    const wrapper = mountMatch({ offer: ['r0', 'r1', 'r2'] });
    await wrapper.findAll('.offer__piece')[0]?.trigger('click');
    await wrapper.findAll('button.cell--legal')[0]?.trigger('click');
    expect(wrapper.findAll('.cell--legal')).toHaveLength(0);
  });

  it('lets a Scout replace an opponent piece on the opponent board', async () => {
    const wrapper = mountMatch({
      offer: ['r0.replace', 'r1'],
      own: [null, null, null, null],
      opp: [null, 'r2', null, null],
    });
    await wrapper.findAll('.offer__piece')[0]?.trigger('click');
    const boards = wrapper.findAll('section.board');
    expect(boards[0]?.findAll('.cell--legal')).toHaveLength(0);
    expect(boards[1]?.findAll('.cell--legal')).toHaveLength(1);
    await boards[1]?.get('button.cell--legal').trigger('click');
    expect(wrapper.emitted('play')).toEqual([
      [{ pieceId: 'r0.replace', cell: { column: 0, row: 1 } }],
    ]);
  });

  it('waits for the opponent and blocks the pieces meanwhile', () => {
    const wrapper = mountMatch({ offer: ['r0', 'r1', 'r2'], thinking: true });
    expect(wrapper.text()).toContain('The opponent is choosing.');
    for (const piece of wrapper.findAll('.offer__piece')) {
      expect(piece.attributes('disabled')).toBeDefined();
    }
  });

  it('announces the status to a screen reader', () => {
    expect(mountMatch().find('[aria-live="polite"]').exists()).toBe(true);
  });

  it('puts the two boards side by side', () => {
    const wrapper = mountMatch();
    const row = wrapper.get('.match__boards');
    expect(row.findAll('section.board')).toHaveLength(2);
  });

  it('numbers the duels on both boards, the opponent board mirrored', () => {
    const wrapper = mountMatch();
    const [mine, theirs] = wrapper
      .findAll('section.board')
      .map((board) =>
        board.findAll('.cell__duel').map((n) => Number(n.text())),
      );
    expect(mine).toEqual([3, 1, 4, 2]);
    expect(theirs).toEqual([1, 3, 2, 4]);
  });

  it('explains the numbers', () => {
    expect(mountMatch().text()).toContain(
      'Squares with the same number duel each other.',
    );
  });

  it('highlights the square that faces the one under the pointer', async () => {
    const wrapper = mountMatch();
    const own = wrapper.findAll('section.board')[0];
    await own?.findAll('.cell')[1]?.trigger('pointerenter');
    const lit = wrapper.findAll('.cell--highlighted');
    expect(lit).toHaveLength(2);
    expect(lit.map((cell) => cell.get('.cell__duel').text())).toEqual([
      '1',
      '1',
    ]);
    await own?.findAll('.cell')[1]?.trigger('pointerleave');
    expect(wrapper.findAll('.cell--highlighted')).toHaveLength(0);
  });
});
