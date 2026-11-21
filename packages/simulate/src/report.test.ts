import { describe, expect, it } from 'vitest';
import {
  failingOrderingFinding,
  report,
  reportFindings,
  reportLines,
} from '../test/fixtures/report';
import { findings, renderJson, renderMarkdown } from './report';

describe('renderMarkdown', () => {
  const markdown = renderMarkdown(report).split('\n');

  it.each(reportLines)('contains the line %s', (line) => {
    expect(markdown).toContain(line);
  });

  it('lists the findings for the rules owner', () => {
    expect(markdown).toContain('## Findings');
    for (const finding of reportFindings) {
      expect(markdown).toContain(`- ${finding}`);
    }
  });

  it('says so when there is no finding', () => {
    const calm = {
      ...report,
      boards: report.boards.map((board) => ({
        ...board,
        firstPlayer: { ...board.firstPlayer, interval: [0.45, 0.55] as const },
        effects: board.effects.map((effect) => ({ ...effect, flagged: false })),
      })),
    };
    expect(renderMarkdown(calm).split('\n')).toContain('None.');
  });
});

describe('renderJson', () => {
  it('is the report as readable JSON', () => {
    expect(JSON.parse(renderJson(report))).toEqual(report);
    expect(renderJson(report)).toContain('\n  "boards"');
  });
});

describe('findings', () => {
  it('lists the first player advantage and the flagged blessings', () => {
    expect(findings(report)).toEqual(reportFindings);
  });

  it('lists a failing ordering first', () => {
    const failing = {
      ...report,
      orderingHolds: false,
      boards: report.boards.map((board) => ({
        ...board,
        ordering: {
          holds: false,
          failures: [
            {
              stronger: 'easy' as const,
              weaker: 'medium' as const,
              rate: 0.45,
              games: 100,
            },
          ],
        },
      })),
    };
    expect(findings(failing)[0]).toBe(failingOrderingFinding);
    expect(renderMarkdown(failing)).toContain(
      'Ordering of the levels: does not hold',
    );
  });
});
