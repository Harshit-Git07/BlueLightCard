import { Page, BrowserContext, Locator } from "@playwright/test";
import { WebActions } from "@lib/WebActions";

let webActions: WebActions;

export class OnlineDiscountsPageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  //Featured offers carousell
  readonly LEFTNAVIGATION_BUTTON: Locator;
  readonly RIGHTNAVIGATION_BUTTON: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    //Featured offers carousell
    this.LEFTNAVIGATION_BUTTON = page.locator(".owl-prev > .fa");
    this.RIGHTNAVIGATION_BUTTON = page.locator(".owl-next > .fa");
  }

  async NavigateToUrl(): Promise<void> {
    await this.page.goto(process.env.BASE_URL_UK, {
      waitUntil: "load",
    });
  }

  //Featured offers carousell
  async clickLeftNavigationCarousellButton(): Promise<void> {
    await this.LEFTNAVIGATION_BUTTON.click();
  }

  async clickRightNavigationCarousellButton(): Promise<void> {
    await this.RIGHTNAVIGATION_BUTTON.click();
  }

  //'JBL '

  async SelectTheOptionFromTheCarousellMenu(option: string): Promise<void> {
    // Define a maximum number of attempts to prevent an infinite loop
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Try to find and click the option
      const optionExists = await this.page
        .getByRole("link", { name: option, exact: true })
        .isVisible();

      if (optionExists) {
        await this.page
          .getByRole("link", { name: option, exact: true })
          .click();
        return;
      }

      // If the option is not found, click the right navigation button to scroll
      await this.clickRightNavigationCarousellButton();

      // Increment the attempt counter
      attempts += 1;
    }
  }
}
