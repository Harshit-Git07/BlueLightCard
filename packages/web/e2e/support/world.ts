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
  await page.goto('https://www.demoblaze.com/');
  console.info('Spinning up browser using playwright.');
});

After(async function ({ pickle, result }) {
  if (result?.status === Status.FAILED) {
    const img = await page.screenshot({
      path: './e2e/test-results/screenshots/screenshots' + pickle.name,
      type: 'png',
    });
    await this.attach(img, 'image/png');
    await page.close();
  }
});
AfterAll(async function () {
  await browser.close();
});

export { page, browser };
