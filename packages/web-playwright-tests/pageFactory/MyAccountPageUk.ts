import { Page, BrowserContext, Locator, expect } from "@playwright/test";
import { WebActions } from "@lib/WebActions";
import { generateUKMobileNumber } from "utils/functional/dataModels/dataModelsUk";

let webActions: WebActions;

export class MyAccountPageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators

  //Searchbar options
  readonly MAGNIFIER_SEARCHBAR: Locator;
  readonly CATEGORYOPTION_SEARCHBAR: Locator;

  //Personal Infomation 
      readonly MOBILE_FIELD_UK: Locator;
      readonly UPDATE_BUTTON_UK: Locator;

      //Service Locators

      readonly AVAILABLE_SERVICE_DROPDOWN_UK: Locator;


      constructor(page: Page, context: BrowserContext) {
        // Assigns the passed-in 'page' (browser page) to the instance's 'page' property
        this.page = page;
        
        // Assigns the passed-in 'context' (browser context) to the instance's 'context' property
        this.context = context;
        
        // Initialises a new instance of 'WebActions' class, passing 'page' and 'context' to handle web interactions
        webActions = new WebActions(this.page, this.context);

    // Initialise locators

    // Service Locator - Initialise

        this.AVAILABLE_SERVICE_DROPDOWN_UK = this.page.locator('button.btn.dropdown-toggle.selectpicker[data-id="trust"]');

    //Searchbar options - Initialise
    this.MAGNIFIER_SEARCHBAR = this.page.locator(".search-trigger");
    this.CATEGORYOPTION_SEARCHBAR = this.page.getByRole("button", {
      name: "or by category",
    });


     //initialising personal information locators
     this.MOBILE_FIELD_UK = page.getByPlaceholder('Mobile Number');
     this.UPDATE_BUTTON_UK = page.locator("button[data-qa='button-personal-info-details']");

 
  }

  //Navigation Methods

  async navigateToMyAccountUk(): Promise<void> {
    await this.page.goto(process.env.MY_ACCOUNT_URL_UK);
  }



// Updates the mobile number field with the newly generated mobile number
async updateMobileNumberField(newMobileNumber: string, updatedMobileNumber: any): Promise<void> {
  await this.MOBILE_FIELD_UK.fill(' '); // Clears the existing mobile number field
  await updatedMobileNumber.fill(newMobileNumber); // Fills the mobile field with the new mobile number
}


// Call to update the mobile number in the account settings
async updateMobileNumber(newMobileNumber: string): Promise<void> {
  // Retrieve the mobile field element
  const mobileFieldElement = this.MOBILE_FIELD_UK;
  
  // Update the mobile number field with the provided mobile number
  await this.updateMobileNumberField.call(this, newMobileNumber, mobileFieldElement);
  
  await this.UPDATE_BUTTON_UK.click(); // Clicks the update button to save the changes

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


async clickUpdateButtonUK(): Promise<void> {
  await this.UPDATE_BUTTON_UK.click(); // Clicks the update button to save the changes
}

async updateSelectedService(rel: number, serviceText: string): Promise<void> {
  // Create a locator for the dropdown option based on the provided rel number
  const serviceDropdownList = this.page.locator(`//li[@rel="${rel}"]/a[span[contains(text(), "${serviceText}")]]`);;

  // Click the dropdown to open the list of available services
  await this.AVAILABLE_SERVICE_DROPDOWN_UK.click();

  // Click the specific service option from the dropdown list
  await serviceDropdownList.click({ force: true });

  // Call the method to click the update button
  this.clickUpdateButtonUK();
}

// Separate method to verify that the selected service was updated correctly
async verifyServiceUpdated(service: string): Promise<void> {
  // Create a locator for the button that displays the updated service
  const updatedService = this.page.locator(`button[data-id="trust"][title="${service}"]`);

  // Verify that the updated service button is visible on the page
  await expect(updatedService).toBeVisible();
}
}
