import { expect, Page } from '@playwright/test';

async function verifyURL(page: Page, expectedURL: string) {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(expectedURL);
}

async function readFromClipboardAndAssert(page: Page, expectedText: string): Promise<void> {
    const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    expect(clipboardText).toBe(expectedText);
}

async function verifyOfferPageLoad(offerPagePromise: Promise<Page>, newPageUrl: string): Promise<void> {
    const offerPage = await offerPagePromise;
    await offerPage.waitForLoadState('load');
    expect(offerPage.url()).toContain(newPageUrl);
}

export { verifyURL, readFromClipboardAndAssert, verifyOfferPageLoad };
