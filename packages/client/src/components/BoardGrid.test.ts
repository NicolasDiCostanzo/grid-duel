import { describe, expect, it } from 'vitest';
import { mountWithI18n } from '../../test/helpers/mount';
import BoardGrid from './BoardGrid.vue';

const placed = (pieceId: string) => ({ pieceId, nullified: false });

describe('BoardGrid', () => {
  it.each([
    ['2x2', 4],
    ['2x3', 6],
  ] as const)('has %s cells on a %s board', (boardSize, count) => {
    const wrapper = mountWithI18n(BoardGrid, {
      props: {
        boardSize,
        cells: Array(count).fill(null),
        owner: 'mine',
        legalCells: [],
        title: 'Your board',
      },
    });
    expect(wrapper.findAll('.cell')).toHaveLength(count);
    expect(wrapper.get('h2').text()).toBe('Your board');
  });

  it('reads the cells column by column and shows them row by row', () => {
    const wrapper = mountWithI18n(BoardGrid, {
      props: {
        boardSize: '2x2',
        cells: [placed('r0'), placed('r1'), placed('r2'), null],
        owner: 'mine',
        legalCells: [],
        title: 'Your board',
      },
    });
    const labels = wrapper
      .findAll('.cell')
      .map((cell) => cell.attributes('aria-label'));
    expect(labels).toEqual([
      'Rock, yours, column 1, row 1',
      'Scissors, yours, column 2, row 1',
      'Paper, yours, column 1, row 2',
      'Empty square, column 2, row 2',
    ]);
  });

  it('highlights the legal cells and reports the one that is chosen', async () => {
    const wrapper = mountWithI18n(BoardGrid, {
      props: {
        boardSize: '2x3',
        cells: Array(6).fill(null),
        owner: 'mine',
        legalCells: [
          { column: 0, row: 2 },
          { column: 1, row: 1 },
        ],
        title: 'Your board',
      },
    });
    expect(wrapper.findAll('.cell--legal')).toHaveLength(2);
    await wrapper.findAll('button')[0]?.trigger('click');
    expect(wrapper.emitted('choose')).toEqual([[{ column: 1, row: 1 }]]);
    await wrapper.findAll('button')[1]?.trigger('click');
    expect(wrapper.emitted('choose')?.[1]).toEqual([{ column: 0, row: 2 }]);
  });
});
