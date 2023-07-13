import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin Panel CMS/);
});

test('has heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Admin Panel CMS/);

  expect(await page.innerText('data-testid=homePageHeading')).toBe(
    'Welcome to the Admin panel CMS'
  );
});
