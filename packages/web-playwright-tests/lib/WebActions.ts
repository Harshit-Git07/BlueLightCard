import type { Page } from '@playwright/test';
import { BrowserContext } from '@playwright/test';

export class WebActions {
  readonly page: Page;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async navigateToURL(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'load',
    });
  }

  async verifyPageUrlContains(expectedUrl: string) {
    await this.page.waitForURL(expectedUrl, { timeout: 2000 });
  }
}
