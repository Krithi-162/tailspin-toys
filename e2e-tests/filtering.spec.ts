import { test, expect } from '@playwright/test';

test.describe('Game filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('game-filters')).toBeVisible();
  });

  test('filters games by publisher and clears the filter', async ({ page }) => {
    const cards = page.getByTestId('game-card');
    const initialCount = await cards.count();
    const publisherFilter = page.getByTestId('publisher-filter');

    await publisherFilter.selectOption({ index: 1 });
    const visibleCards = page.locator('[data-testid="game-card"]:visible');
    await expect(visibleCards.first()).toBeVisible();
    expect(await visibleCards.count()).toBeLessThan(initialCount);
    expect(await page.getByTestId('game-card').count()).toBe(initialCount);

    await page.getByTestId('clear-filters').click();
    await expect(page.getByTestId('game-card')).toHaveCount(initialCount);
  });

  test('combines category and publisher filters', async ({ page }) => {
    const categoryFilter = page.locator('[data-filter-category]').first();
    const publisherFilter = page.getByTestId('publisher-filter');

    await categoryFilter.check();
    await publisherFilter.selectOption({ index: 1 });

    await expect(page.getByTestId('games-grid')).toBeVisible();
    await expect(page.getByTestId('filter-empty-state')).toBeHidden();
  });
});
