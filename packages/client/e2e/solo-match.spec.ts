import { expect, test, type Page } from '@playwright/test';

const noHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(
    () =>
      (document.scrollingElement?.scrollWidth ?? 0) -
      (document.scrollingElement?.clientWidth ?? 0),
  );
  expect(overflow).toBeLessThanOrEqual(0);
};

async function playUntilResult(page: Page): Promise<void> {
  const result = page.getByRole('heading', { name: 'Match over' });
  for (let step = 0; step < 600; step++) {
    if (await result.isVisible()) {
      return;
    }
    const next = page.getByRole('button', { name: 'Next round' });
    if (await next.isVisible()) {
      await noHorizontalScroll(page);
      await next.click();
      continue;
    }
    const piece = page.locator('.offer__piece:enabled').first();
    if ((await piece.count()) > 0) {
      await piece.click();
      await page.locator('button.cell').first().click();
    } else {
      await page.waitForTimeout(100);
    }
  }
  throw new Error('The match did not reach its result');
}

const matches = [
  { board: 'Small, 4 duels', level: 'Easy', cells: 8 },
  { board: 'Large, 6 duels', level: 'Medium', cells: 12 },
  { board: 'Large, 6 duels', level: 'Hard', cells: 12 },
] as const;

for (const { board, level, cells } of matches) {
  test(`plays a whole match on the ${board} board against the ${level} bot`, async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Tile Clash',
    );
    await noHorizontalScroll(page);
    await page.getByLabel(board).check();
    await page.getByLabel(level, { exact: true }).check();
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.locator('.cell')).toHaveCount(cells);
    await noHorizontalScroll(page);
    await playUntilResult(page);
    await expect(
      page.getByText(/You win the match|The opponent wins the match/),
    ).toBeVisible();
    await noHorizontalScroll(page);
    await page.getByRole('button', { name: 'New settings' }).click();
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  });
}
