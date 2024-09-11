import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
const User = require('utils/functional/dataModels/dataModelsUk');

let webActions: WebActions;

export class AboutYourRolePageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
  readonly trustMemberSection: Locator;
  readonly airAmbulanceOption: Locator;
  readonly jobTitleInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Initialize locators
    this.trustMemberSection = page.locator('#trustMemberSection div').nth(1);
    this.airAmbulanceOption = page.getByText('Air Ambulance');
    this.jobTitleInput = page.locator('#position');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async enterJobTitle(jobTitle: string) {
    await this.jobTitleInput.fill(jobTitle);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async selectTrustOrDivision(user) {
    await this.trustMemberSection.click();
    await this.airAmbulanceOption.click();
  }
}
