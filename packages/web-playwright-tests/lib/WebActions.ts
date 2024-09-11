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
    try {
      const currentUrl = this.page.url();

      if (!currentUrl.includes(expectedUrl)) {
        throw new Error(
          `Expected URL to contain '${expectedUrl}', but the current URL is '${currentUrl}'.`,
        );
      }
    } catch (error) {
      throw new Error(`An error occurred while verifying the URL: ${error.message}`);
    }
  }
}
