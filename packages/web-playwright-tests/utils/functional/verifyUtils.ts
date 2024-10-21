import { expect, Page } from '@playwright/test';

async function verifyURL(page: Page, expectedURL: string) {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(expectedURL);
}

export { verifyURL };
