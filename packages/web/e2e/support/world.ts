import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { invokeBrowser } from '../helpers/browsers/browserManager';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `e2e/.env`,
});

let page: Page;
let browser: Browser;
let context: BrowserContext;

setDefaultTimeout(60000)
BeforeAll(async function () {
  browser = await invokeBrowser();
});

Before(async function () {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.title();
  console.info('Test started');
});

After(async function ({ pickle, result }) {
  if (result?.status === Status.FAILED) {
    const img = await page.screenshot({
      path: './e2e/test-results/screenshots/screenshots' + pickle.name,
      type: 'png',
    });
    await this.attach(img, 'image/png');
  }
  console.log('Test complete');
});

AfterAll(async function () {
  browser.close();
  page.close();
});

export { page, browser };
