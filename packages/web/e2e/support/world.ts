import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';

let page: Page;
let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.staging.bluelightcard.tech/eligibility/');
  console.info('Spinning up browser using playwright.');
});

After(async function ({ pickle, result }) {
  if (result?.status === Status.FAILED) {
    const img = await page.screenshot({
      path: './e2e/test-results/screenshots/screenshots' + pickle.name,
      type: 'png',
    });
    await this.attach(img, 'image/png');
    browser.close();
    page.close();
  }
});
AfterAll(async function () {
  browser.close();
  page.close();
  console.log('Test complete');
});

export { page, browser };
