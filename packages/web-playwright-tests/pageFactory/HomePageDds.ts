import { Page, BrowserContext } from "@playwright/test";
import { WebActions } from "@lib/WebActions";

let webActions: WebActions;

export class HomePageDds {
  readonly page: Page;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);
  }
}
