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
// Updates the mobile number field with the newly generated mobile number
async updateMobileNumberField(newMobileNumber: string, updatedMobileNumber: any): Promise<void> {
  await this.MOBILE_FIELD_AUS.fill(' '); // Clears the existing mobile number field
  await updatedMobileNumber.fill(newMobileNumber); // Fills the mobile field with the new mobile number
}


// Call to update the mobile number in the account settings
async updateMobileNumber(newMobileNumber: string): Promise<void> {
  // Retrieve the mobile field element
  const mobileFieldElement = this.MOBILE_FIELD_AUS;
  
  // Update the mobile number field with the provided mobile number
  await this.updateMobileNumberField.call(this, newMobileNumber, mobileFieldElement);
  
  await this.UPDATE_BUTTON_AUS.click(); // Clicks the update button to save the changes

  // Refresh the page after saving
  await this.page.reload();

  await mobileFieldElement.scrollIntoViewIfNeeded();
}

// Separate method to verify that the mobile number was updated correctly
async verifyMobileNumberUpdated(newMobileNumber: string): Promise<void> {
  // Create a locator for the mobile number field to verify the update
  const mobileNumberLocator = this.page.locator(`xpath=//*[@id="mobile" and @value="${newMobileNumber}"]`);
  
  // Verify that the new mobile number is visible
  await expect(mobileNumberLocator).toBeVisible();
}
}
