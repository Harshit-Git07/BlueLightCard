import { Page, BrowserContext, Locator } from "@playwright/test";
import { WebActions } from "@lib/WebActions";

let webActions: WebActions;

export class OnlineDiscountsPageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
  readonly LEFTNAVIGATION_BUTTON: Locator;
  readonly RIGHTNAVIGATION_BUTTON: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Initialize locators
    //Featured offers carousel
    this.LEFTNAVIGATION_BUTTON = page.locator(".owl-prev > .fa");
    this.RIGHTNAVIGATION_BUTTON = page.locator(".owl-next > .fa");
  }
}
