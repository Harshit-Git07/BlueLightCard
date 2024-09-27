import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
import { generateAUSMobileNumber } from 'utils/functional/dataModels/dataModelsAus';

let webActions: WebActions;

export class MyAccountPageAus {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators

  //Searchbar options
  readonly MAGNIFIER_SEARCHBAR: Locator;
  readonly CATEGORYOPTION_SEARCHBAR: Locator;

  //Personal Infomation
  readonly MOBILE_FIELD_AUS: Locator;
  readonly UPDATE_BUTTON_AUS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;

    this.context = context;
    webActions = new WebActions(this.page, this.context);

    //Searchbar options
    this.MAGNIFIER_SEARCHBAR = this.page.locator('.search-trigger');
    this.CATEGORYOPTION_SEARCHBAR = this.page.getByRole('button', {
      name: 'or by category',
    });

    //Personal information locators
    this.MOBILE_FIELD_AUS = page.getByPlaceholder('Mobile Number');
    this.UPDATE_BUTTON_AUS = page.getByRole('button', { name: 'Update details' });
  }

  async navigateToMyAccountAus(): Promise<void> {
    await this.page.goto(process.env.MY_ACCOUNT_URL_AUS);
  }

  // Update the mobile number field with the new mobile number
  async updateMobileNumberField(newMobileNumber: string, updatedMobileNumber: any): Promise<void> {
    await this.MOBILE_FIELD_AUS.fill(' ');
    await updatedMobileNumber.fill(newMobileNumber);
  }

  async updateMobileNumberAndVerifyChangesSaved(): Promise<void> {
    // Generates a new mobile number and retrieves the mobile field element
    const newMobileNumber = generateAUSMobileNumber();
    const updatedMobileNumber = this.MOBILE_FIELD_AUS;

    // Update the mobile number field with the new mobile number
    await this.updateMobileNumberField.call(this, newMobileNumber, updatedMobileNumber);

    await this.UPDATE_BUTTON_AUS.click();

    await this.page.reload();
    const mobileNumberLocator = this.page.locator(
      'xpath=//*[@id="mobile" and @value="' + newMobileNumber + '"]',
    );

    await updatedMobileNumber.scrollIntoViewIfNeeded();

    await mobileNumberLocator.isVisible();
  }
}
