import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

let webActions: WebActions;

export class HomePageDds {
  readonly page: Page;
  readonly context: BrowserContext;

  // Navbar top
  private readonly DDSLOGOBUTTON_NAVBAR_DDS: Locator;
  private readonly OFFERS_NAVBAR_DDS: Locator;
  private readonly PRIVILEGE_CARD_NAVBAR_DDS: Locator;
  private readonly MY_ACCOUNT_NAVBAR_DDS: Locator;
  private readonly FAQS_NAVBAR_DDS: Locator;
  private readonly LOGOUT_NAVBAR_DDS: Locator;
  private readonly SEARCH_TEXT_DDS: Locator;

  // Login options - Login screen
  private readonly LOGIN_BUTTON_DDS: Locator;
  private readonly LOGIN_TEXT_DDS: Locator;
  private readonly EMAIL_TEXTFIELD_DDS: Locator;
  private readonly PASSWORD_TEXTFIELD_DDS: Locator;
  private readonly SUBMIT_BUTTON_DDS: Locator;

  // Search options
  private readonly SEARCH_BUTTON_DDS: Locator;
  private readonly SEARCH_OPTION_COMPANY_DDS: Locator;
  private readonly SEARCH_OPTION_CATEGORY_DDS: Locator;
  private readonly SEARCH_OPTION_SEARCHTERM_DDS: Locator;
  private readonly SEARCH_OPTION_DROPDOWN_DDS: Locator;
  private readonly SEARCH_NOW_BUTTON_DDS: Locator;

  private readonly SEARCH_DROPDOWN_SELECTOR_DDS: Locator;

  //Code Redemption
  private readonly CLICK_HERE_TO_SEE_CODE_DDS: Locator;
  private readonly GO_TO_OFFER: Locator;

  // Additional locators for assertions
  private readonly DEALS_OF_THE_WEEK_HEADING_DDS: Locator;

  // Cookie handling
  private readonly ACCEPT_COOKIES_BUTTON_DDS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Navbar top
    this.DDSLOGOBUTTON_NAVBAR_DDS = page.locator('div.site-logo');
    this.OFFERS_NAVBAR_DDS = page.getByRole('link', { name: 'Offers ' });
    this.PRIVILEGE_CARD_NAVBAR_DDS = page.getByRole('link', { name: 'Privilege Card' });
    this.MY_ACCOUNT_NAVBAR_DDS = page.getByRole('link', { name: 'My Account' });
    this.FAQS_NAVBAR_DDS = page.getByRole('link', { name: 'FAQs' });
    this.LOGOUT_NAVBAR_DDS = page.getByRole('link', { name: 'Logout' });
    this.SEARCH_TEXT_DDS = page.getByText('Search by company or phrase');

    // Login options - Login screen
    this.LOGIN_BUTTON_DDS = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT_DDS = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD_DDS = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD_DDS = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON_DDS = page.getByRole('button', { name: 'submit' });

    // Additional locators for assertions
    this.DEALS_OF_THE_WEEK_HEADING_DDS = page.getByRole('heading', { name: 'Deals of the Week' });

    //Search options
    this.SEARCH_BUTTON_DDS = page.getByRole('link', { name: '' });
    this.SEARCH_OPTION_COMPANY_DDS = page.getByRole('button', { name: 'by company' });
    this.SEARCH_OPTION_CATEGORY_DDS = page.getByRole('button', { name: 'or by category' });
    this.SEARCH_OPTION_SEARCHTERM_DDS = page.getByLabel('or By Phrase');
    this.SEARCH_OPTION_DROPDOWN_DDS = page.locator('select[aria-label="drop-down selector"]');
    this.SEARCH_NOW_BUTTON_DDS = page.getByRole('button', { name: 'Search now' });

    // Search options
    this.GO_TO_OFFER = page
      .locator('li')
      .filter({ hasText: 'British Airways Online offer' })
      .getByRole('link')
      .nth(1);
    this.CLICK_HERE_TO_SEE_CODE_DDS = page.getByText('Copy Discount Code');
    //this.VISIT_WEBSITE = page.getByRole('link', { name: 'Visit Sonos now' });

    // Cookie handling
    this.ACCEPT_COOKIES_BUTTON_DDS = page.getByRole('button', { name: 'Agree to all' });
  }

  // Navigation methods
  async navigateToUrlDds(): Promise<void> {
    await this.page.goto(process.env.BASE_URL_DDS, { waitUntil: 'load' });
  }

  async navigateToUrlAndLogin(email: string, password: string): Promise<void> {
    await this.navigateToUrlDds();
    await this.acceptCookies();
    await this.login(email, password);
  }

  // Cookie handling
  async acceptCookies(): Promise<void> {
    await this.ACCEPT_COOKIES_BUTTON_DDS.click();
  }

  // Login methods
  async login(email: string, password: string): Promise<void> {
    await this.LOGIN_BUTTON_DDS.click();
    await expect(this.LOGIN_TEXT_DDS).toBeVisible();
    await this.EMAIL_TEXTFIELD_DDS.fill(email);
    await this.PASSWORD_TEXTFIELD_DDS.fill(password);
    await this.SUBMIT_BUTTON_DDS.click();
    await this.page.waitForLoadState('load');
  }

  // Element assertions
  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.DDSLOGOBUTTON_NAVBAR_DDS).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_DDS).toBeVisible();
    await expect(this.SEARCH_TEXT_DDS).toBeVisible();
  }

  // Search option methods
  async searchForCompanyCategoryOrPhrase(searchOption: string, searchTerm: string): Promise<void> {
    await this.SEARCH_BUTTON_DDS.click();
    switch (searchOption.toLowerCase()) {
      case 'company':
        await this.SEARCH_OPTION_COMPANY_DDS.click();
        await this.page
          .getByRole('menu')
          .locator('a')
          .filter({ hasText: 'British Airways' })
          .click(),
          {
            label: searchTerm,
          };

        break;

      case 'category':
        await this.SEARCH_OPTION_CATEGORY_DDS.click();
        await this.page.selectOption('select[aria-label="drop-down selector"]', {
          label: searchTerm,
        });

        break;
      case 'phrase':
        await this.SEARCH_OPTION_SEARCHTERM_DDS.click();
        await this.SEARCH_OPTION_SEARCHTERM_DDS.fill(searchTerm);
        await this.SEARCH_NOW_BUTTON_DDS.click();
        await this.GO_TO_OFFER.click();

        break;
      default:
        throw new Error(
          `Unknown search option: ${searchOption} - options are "Company, Category and Phrase"`,
        );
    }

    await this.page.waitForLoadState('load');

    //Check the heading is correct
    await expect(this.page.getByRole('heading', { name: searchTerm }).first()).toBeVisible();

    await expect(
      this.page.getByRole('heading', { name: searchTerm, exact: true }).first(),
    ).toBeVisible();
  }

  //Redeeming code
  async clickToSeeTheDiscount(expectedDiscountCode: string, newPageUrl: string): Promise<void> {
    const page1Promise = this.page.waitForEvent('popup');
    await this.CLICK_HERE_TO_SEE_CODE_DDS.click();
    const page1 = await page1Promise;

    const offerPage = await page1;
    await offerPage.waitForLoadState('load');
    expect(offerPage.url()).toContain(newPageUrl);

    //Ensure the clipboard has the expected value by reading it and asserting expected vs actual - Currently does not work
    // await this.context.grantPermissions(['clipboard-read', 'clipboard-write']);
    // const clipboardText = await offerPage.evaluate(async () => {
    //   return await navigator.clipboard.readText();
    // });
    // expect(clipboardText).toBe(expectedDiscountCode);
  }
}
