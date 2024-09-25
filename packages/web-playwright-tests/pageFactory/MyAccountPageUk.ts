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


      constructor(page: Page, context: BrowserContext) {
        // Assigns the passed-in 'page' (browser page) to the instance's 'page' property
        this.page = page;
        
        // Assigns the passed-in 'context' (browser context) to the instance's 'context' property
        this.context = context;
        
        // Initialises a new instance of 'WebActions' class, passing 'page' and 'context' to handle web interactions
        webActions = new WebActions(this.page, this.context);

    // Initialize locators

    

    //Searchbar options - Initilisa
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


// Call to change the mobile number in the account settings
async updateMobileNumberAndVerifyChangesSaved(): Promise<void> {
  // Generates a new mobile number and retrieves the mobile field element
  const newMobileNumber = generateUKMobileNumber();
  const updatedMobileNumber = this.MOBILE_FIELD_UK;
  
  
  // Updates the mobile number field with the new mobile number
  await this.updateMobileNumberField.call(this, newMobileNumber, updatedMobileNumber);
  
  await this.UPDATE_BUTTON_UK.click(); // Clicks the update button to save the changes

  //Refreshes the page after saving

  await this.page.reload();
    
  // Creates a locator for the mobile number field to verify the update

  const mobileNumberLocator = this.page.locator('xpath=//*[@id="mobile" and @value="'+newMobileNumber+'"]')
 
  await updatedMobileNumber.scrollIntoViewIfNeeded();
 
  await mobileNumberLocator.isVisible();
}
}
