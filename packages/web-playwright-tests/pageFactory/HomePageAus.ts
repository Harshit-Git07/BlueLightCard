import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

export class HomePageAus {
  readonly page: Page;
  readonly context: BrowserContext;
  private webActions: WebActions;

  // Navbar top
  private readonly BLUELIGHTBUTTON_NAVBAR_AUS: Locator;
  private readonly HOME_NAVBAR_AUS: Locator;
  private readonly OFFERS_NAVBAR_AUS: Locator;
  private readonly MYCARD_NAVBAR_AUS: Locator;
  private readonly MYACCOUNT_NAVBAR_AUS: Locator;
  private readonly FAQS_NAVBAR_AUS: Locator;
  private readonly SIGNUP_NAVBAR_AUS: Locator;
  private readonly LOGIN_NAVBAR_AUS: Locator;
  private readonly LOGOUT_NAVBAR_AUS: Locator;

  // Searchbar options
  private readonly MAGNIFIER_SEARCHBAR_AUS: Locator;
  private readonly CATEGORYOPTION_SEARCHBAR_AUS: Locator;
  private readonly PHRASE_SEARCHBAR_AUS: Locator;
  private readonly SEARCHNOW_BUTTON_SEARCHBAR_AUS: Locator;

  // Login options - Login screen
  private readonly LOGIN_BUTTON_AUS: Locator;
  private readonly LOGIN_TEXT_AUS: Locator;
  private readonly EMAIL_TEXTFIELD_AUS: Locator;
  private readonly PASSWORD_TEXTFIELD_AUS: Locator;
  private readonly SUBMIT_BUTTON_AUS: Locator;

  // Cookies popup
  private readonly ACCEPTCOOKIES_BUTTON_AUS: Locator;

  // Additional elements for assertions
  private readonly WOOLWORTHS_LINK_AUS: Locator;
  private readonly ELIGIBILITY_LINK_AUS: Locator;
  private readonly AUSTRALIA_FLAG_BUTTON_AUS: Locator;
  private readonly START_SAVING_LINK_AUS: Locator;
  private readonly EXCLUSIVE_SAVINGS_HEADING_AUS: Locator;
  private readonly SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS: Locator;
  private readonly DEALS_OF_THE_WEEK_HEADING_AUS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.webActions = new WebActions(this.page, this.context);

    // Navbar top
    this.BLUELIGHTBUTTON_NAVBAR_AUS = page.locator('div.site-logo');
    this.HOME_NAVBAR_AUS = page.getByRole('link', { name: 'Home', exact: true });
    this.OFFERS_NAVBAR_AUS = page
      .getByRole('navigation')
      .getByRole('link', { name: 'Offers', exact: true });
    this.MYCARD_NAVBAR_AUS = page.getByRole('link', { name: 'My Card' });
    this.MYACCOUNT_NAVBAR_AUS = page.getByRole('link', { name: 'My Account' });
    this.FAQS_NAVBAR_AUS = page.getByRole('link', { name: 'FAQs' });
    this.SIGNUP_NAVBAR_AUS = page.getByRole('link', { name: 'Sign up' });
    this.LOGIN_NAVBAR_AUS = page.getByLabel('Login');
    this.LOGOUT_NAVBAR_AUS = page.getByRole('link', { name: 'Logout' });

    // Searchbar options
    this.MAGNIFIER_SEARCHBAR_AUS = page.locator('.search-trigger');
    this.CATEGORYOPTION_SEARCHBAR_AUS = page.getByRole('button', { name: 'or by category' });
    this.PHRASE_SEARCHBAR_AUS = page.getByLabel('or By Phrase');
    this.SEARCHNOW_BUTTON_SEARCHBAR_AUS = page.getByRole('button', { name: 'Search now' });

    // Login options - Login screen
    this.LOGIN_BUTTON_AUS = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT_AUS = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD_AUS = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD_AUS = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON_AUS = page.getByRole('button', { name: 'submit' });

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
    this.DEALS_OF_THE_WEEK_HEADING_AUS = page.getByRole('heading', { name: 'Deals of the Week' });
  }

  // Methods for common actions
  async acceptCookies(): Promise<void> {
    await this.ACCEPTCOOKIES_BUTTON_AUS.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.LOGIN_BUTTON_AUS.click();
    await expect(this.LOGIN_TEXT_AUS).toBeVisible();
    await this.EMAIL_TEXTFIELD_AUS.fill(email);
    await this.PASSWORD_TEXTFIELD_AUS.fill(password);
    await this.SUBMIT_BUTTON_AUS.click();
    await this.page.waitForLoadState('load'); // Wait until the page is fully loaded
  }

  async navigateToUrlAus(): Promise<void> {
    await this.page.goto(process.env.BASE_URL_AUS, { waitUntil: 'load' });
  }

  async navigateToUrlAndLogin(email: string, password: string): Promise<void> {
    await this.navigateToUrlAus();
    await this.acceptCookies();
    await this.login(email, password);
  }

  // Methods for verifying elements
  async assertElementsVisibleHomeScreenNotLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR_AUS).toBeVisible();
    await expect(this.HOME_NAVBAR_AUS).toBeVisible();
    await expect(this.WOOLWORTHS_LINK_AUS).toBeVisible();
    await expect(this.ELIGIBILITY_LINK_AUS).toBeVisible();
    await expect(this.OFFERS_NAVBAR_AUS).toBeVisible();
    await expect(this.FAQS_NAVBAR_AUS).toBeVisible();
    await expect(this.LOGIN_NAVBAR_AUS).toBeVisible();
    await expect(this.SIGNUP_NAVBAR_AUS).toBeVisible();
    await expect(this.AUSTRALIA_FLAG_BUTTON_AUS).toBeVisible();
    await expect(this.START_SAVING_LINK_AUS).toBeVisible();
    await expect(this.LOGIN_BUTTON_AUS).toBeVisible();
    await expect(this.EXCLUSIVE_SAVINGS_HEADING_AUS).toBeVisible();
  }

  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.HOME_NAVBAR_AUS).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_AUS).toBeVisible();
    await expect(this.SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS).toBeVisible();
    await expect(this.MAGNIFIER_SEARCHBAR_AUS).toBeVisible();
  }
}
