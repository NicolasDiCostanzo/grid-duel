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
      'Rock, yours, column 1, row 1, duel 3',
      'Scissors, yours, column 2, row 1, duel 1',
      'Paper, yours, column 1, row 2, duel 4',
      'Empty square, column 2, row 2, duel 2',
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

  it.each([
    ['2x2', false, [3, 1, 4, 2]],
    ['2x2', true, [1, 3, 2, 4]],
    ['2x3', false, [4, 1, 5, 2, 6, 3]],
    ['2x3', true, [1, 4, 2, 5, 3, 6]],
  ] as const)(
    'numbers the duels of a %s board (mirrored: %s) from the right column, top to bottom',
    (boardSize, mirrored, numbers) => {
      const wrapper = mountWithI18n(BoardGrid, {
        props: {
          boardSize,
          cells: Array(numbers.length).fill(null),
          owner: 'mine',
          legalCells: [],
          title: 'Board',
          mirrored,
        },
      });
      expect(
        wrapper.findAll('.cell__duel').map((n) => Number(n.text())),
      ).toEqual(numbers);
    },
  );

  it('reports the duel of the square under the pointer, then none', async () => {
    const wrapper = mountWithI18n(BoardGrid, {
      props: {
        boardSize: '2x2',
        cells: Array(4).fill(null),
        owner: 'mine',
        legalCells: [],
        title: 'Board',
      },
    });
    await wrapper.findAll('.cell')[1]?.trigger('pointerenter');
    await wrapper.findAll('.cell')[1]?.trigger('pointerleave');
    expect(wrapper.emitted('hover')).toEqual([[1], [null]]);
  });

  it('highlights the squares of the chosen duel', () => {
    const wrapper = mountWithI18n(BoardGrid, {
      props: {
        boardSize: '2x2',
        cells: Array(4).fill(null),
        owner: 'mine',
        legalCells: [],
        title: 'Board',
        highlightedDuel: 4,
      },
    });
    const lit = wrapper.findAll('.cell--highlighted');
    expect(lit).toHaveLength(1);
    expect(lit[0]?.get('.cell__duel').text()).toBe('4');
  });
});
