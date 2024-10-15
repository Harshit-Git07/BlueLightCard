import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class MembersHomeAus {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators


  //Navbar - logged in
  private readonly MYACCOUNT_NAVBAR_AUS: Locator;
  private readonly HOME_NAVBAR_AUS: Locator;
  private readonly LOGOUT_NAVBAR_AUS: Locator;


  //Personal Infomation
  private readonly MOBILE_FIELD_AUS: Locator;
  private readonly UPDATE_BUTTON_AUS: Locator;

  // Searchbar options
  private readonly MAGNIFIER_SEARCHBAR_AUS: Locator;



  // Cookies popup
  private readonly ACCEPTCOOKIES_BUTTON_AUS: Locator;

  // Additional elements for assertions
  private readonly WOOLWORTHS_LINK_AUS: Locator;
  private readonly ELIGIBILITY_LINK_AUS: Locator;
  private readonly AUSTRALIA_FLAG_BUTTON_AUS: Locator;
  private readonly START_SAVING_LINK_AUS: Locator;
  private readonly EXCLUSIVE_SAVINGS_HEADING_AUS: Locator;
  private readonly SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS: Locator;

  // Search options
  private readonly SEARCH_BUTTON_AUS: Locator;
  private readonly SEARCH_OPTION_COMPANY_AUS: Locator;
  private readonly SEARCH_OPTION_CATEGORY_AUS: Locator;
  private readonly SEARCH_OPTION_SEARCHTERM_AUS: Locator;
  private readonly SEARCH_NOW_BUTTON_AUS: Locator;

  // Code Redemption options
  private readonly CLICK_HERE_TO_SEE_DISCOUNT_AUS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;

    // Initialize locators

    //Navbar - logged in
    this.MYACCOUNT_NAVBAR_AUS = page.getByRole('link', { name: 'My Account' });
    this.LOGOUT_NAVBAR_AUS = page.getByRole('link', { name: 'Logout' });
    this.HOME_NAVBAR_AUS = page.getByRole('link', { name: 'Home', exact: true });

    

    //Personal Infomation
    this.MOBILE_FIELD_AUS = page.getByPlaceholder('Mobile Number');
    this.UPDATE_BUTTON_AUS = page.getByRole('button', { name: 'Update details' });

    // Searchbar options
    this.MAGNIFIER_SEARCHBAR_AUS = page.locator('.search-trigger');

   
    // Cookies popup
    this.ACCEPTCOOKIES_BUTTON_AUS = page.getByRole('button', { name: 'Agree to all' });

    // Additional elements for assertions
    this.WOOLWORTHS_LINK_AUS = page.getByRole('link', { name: 'Woolworths' });
    this.ELIGIBILITY_LINK_AUS = page.getByRole('link', { name: 'Eligibility' });
    this.AUSTRALIA_FLAG_BUTTON_AUS = page.getByRole('button', { name: 'australia flag Australia' });
    this.START_SAVING_LINK_AUS = page.getByRole('link', { name: 'Start Saving' });
    this.EXCLUSIVE_SAVINGS_HEADING_AUS = page.getByRole('heading', {
      name: 'Exclusive savings for',
    });
    this.SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS = page.getByText('Search by company or phrase');

    // Search options
    this.SEARCH_BUTTON_AUS = page.locator('.search-trigger');
    this.SEARCH_OPTION_COMPANY_AUS = page.locator('//button[@title="by company"]');
    this.SEARCH_OPTION_CATEGORY_AUS = page.locator('//button[@title="or by category"]');
    this.SEARCH_OPTION_SEARCHTERM_AUS = page.getByRole('textbox');
    this.SEARCH_NOW_BUTTON_AUS = page.getByRole('button', { name: 'Search now' });
    this.CLICK_HERE_TO_SEE_DISCOUNT_AUS = page.getByText('Click here to see discount');
  }

  // Methods for common actions
  async acceptCookies(): Promise<void> {
    await this.ACCEPTCOOKIES_BUTTON_AUS.click();
  }



  async navigateToUrlAus(): Promise<void> {
    await this.page.goto(process.env.MEMBERS_HOME_URL_AUS, { waitUntil: 'load' });
  }


  // Methods for verifying elements


  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.HOME_NAVBAR_AUS).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_AUS).toBeVisible();
    await expect(this.SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS).toBeVisible();
    await expect(this.MAGNIFIER_SEARCHBAR_AUS).toBeVisible();
  }

  // Search option methods
  async searchForCompanyCategoryOrPhrase(searchOption: string, searchTerm: string): Promise<void> {
    await this.SEARCH_BUTTON_AUS.click();
    switch (searchOption.toLowerCase()) {
      case 'company':
        await this.SEARCH_OPTION_COMPANY_AUS.click();
        await this.page
          .locator(`ul.dropdown-menu.inner.selectpicker li a span.text:has-text("${searchTerm}")`)
          .click();

        break;

      case 'category':
        await this.SEARCH_OPTION_CATEGORY_AUS.click();
        await this.page
          .locator(`ul.dropdown-menu.inner.selectpicker li a span.text:has-text("${searchTerm}")`)
          .click();

        break;

      case 'phrase':
        await this.SEARCH_OPTION_SEARCHTERM_AUS.fill(searchTerm);
        await this.SEARCH_NOW_BUTTON_AUS.click();

        break;

      default:
        throw new Error(
          `Unknown search option: ${searchOption} - options are "Company, Category and Phrase"`,
        );
    }
    await this.page.waitForLoadState('load');

    //Check the heading is correct
    await expect(
      this.page.getByRole('heading', { name: searchTerm, exact: true }).first(),
    ).toBeVisible();
  }

  async clickToSeeTheDiscount(newPageUrl: string): Promise<void> {
    await this.CLICK_HERE_TO_SEE_DISCOUNT_AUS.click();
    await this.page.waitForURL(newPageUrl, { waitUntil: 'load' });
    expect(this.page.url()).toContain(newPageUrl);
  }



  
}
