import { expect, test, type Page } from '@playwright/test';

async function playUntilResult(page: Page): Promise<void> {
  const result = page.getByRole('heading', { name: 'Match over' });
  for (let step = 0; step < 600; step++) {
    if (await result.isVisible()) {
      return;
    }
    const next = page.getByRole('button', { name: 'Next round' });
    if (await next.isVisible()) {
      await next.click();
      continue;
    }
    const piece = page.locator('.offer__piece:enabled').first();
    if ((await piece.count()) > 0) {
      await piece.click();
      await page.locator('button.cell').first().click();
    } else {
      await expect(
        page
          .locator('.offer__piece:enabled')
          .or(next)
          .or(result)
          .first(),
      ).toBeVisible({ timeout: 30_000 });
    }
  }
  throw new Error('The match did not reach its result');
}

test('plays a whole solo match from the home page of the site', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Play' })
    .click();
  await expect(page).toHaveURL(/\/en\/play\/$/);
  await page.getByLabel('Small, 4 duels').check();
  await page.getByLabel('Hard', { exact: true }).check();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.locator('.cell')).toHaveCount(8);
  await playUntilResult(page);
  await expect(
    page.getByText(/You win the match|The opponent wins the match/),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      (document.scrollingElement?.scrollWidth ?? 0) -
      (document.scrollingElement?.clientWidth ?? 0),
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
