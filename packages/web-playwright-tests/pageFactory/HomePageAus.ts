import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

export class HomePageAus {
  readonly page: Page;
  readonly context: BrowserContext;
  private webActions: WebActions;

  // Navbar top
  private readonly BLUELIGHTBUTTON_NAVBAR: Locator;
  private readonly HOME_NAVBAR: Locator;
  private readonly OFFERS_NAVBAR: Locator;
  private readonly MYCARD_NAVBAR: Locator;
  private readonly MYACCOUNT_NAVBAR: Locator;
  private readonly FAQS_NAVBAR: Locator;
  private readonly SIGNUP_NAVBAR: Locator;
  private readonly LOGIN_NAVBAR: Locator;
  private readonly LOGOUT_NAVBAR: Locator;

  // Searchbar options
  private readonly MAGNIFIER_SEARCHBAR: Locator;
  private readonly CATEGORYOPTION_SEARCHBAR: Locator;
  private readonly PHRASE_SEARCHBAR: Locator;
  private readonly SEARCHNOW_BUTTON_SEARCHBAR: Locator;

  // Login options - Login screen
  private readonly LOGIN_BUTTON: Locator;
  private readonly LOGIN_TEXT: Locator;
  private readonly EMAIL_TEXTFIELD: Locator;
  private readonly PASSWORD_TEXTFIELD: Locator;
  private readonly SUBMIT_BUTTON: Locator;

  // Cookies popup
  private readonly ACCEPTCOOKIES_BUTTON: Locator;

  // Additional elements for assertions
  private readonly WOOLWORTHS_LINK: Locator;
  private readonly ELIGIBILITY_LINK: Locator;
  private readonly AUSTRALIA_FLAG_BUTTON: Locator;
  private readonly START_SAVING_LINK: Locator;
  private readonly EXCLUSIVE_SAVINGS_HEADING: Locator;
  private readonly SEARCH_BY_COMPANY_OR_PHRASE_TEXT: Locator;
  private readonly DEALS_OF_THE_WEEK_HEADING: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.webActions = new WebActions(this.page, this.context);

    // Navbar top
    this.BLUELIGHTBUTTON_NAVBAR = page.getByRole('link', { name: 'Blue Light Card logo' });
    this.HOME_NAVBAR = page.getByRole('link', { name: 'Home' });
    this.OFFERS_NAVBAR = page.getByRole('link', { name: 'Offers' });
    this.MYCARD_NAVBAR = page.getByRole('link', { name: 'My Card' });
    this.MYACCOUNT_NAVBAR = page.getByRole('link', { name: 'My Account' });
    this.FAQS_NAVBAR = page.getByRole('link', { name: 'FAQs' });
    this.SIGNUP_NAVBAR = page.getByRole('link', { name: 'Sign up' });
    this.LOGIN_NAVBAR = page.getByLabel('Login');
    this.LOGOUT_NAVBAR = page.getByRole('link', { name: 'Logout' });

    // Searchbar options
    this.MAGNIFIER_SEARCHBAR = page.locator('.search-trigger');
    this.CATEGORYOPTION_SEARCHBAR = page.getByRole('button', { name: 'or by category' });
    this.PHRASE_SEARCHBAR = page.getByLabel('or By Phrase');
    this.SEARCHNOW_BUTTON_SEARCHBAR = page.getByRole('button', { name: 'Search now' });

    // Login options - Login screen
    this.LOGIN_BUTTON = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON = page.getByRole('button', { name: 'submit' });

    // Cookies popup
    this.ACCEPTCOOKIES_BUTTON = page.getByRole('button', { name: 'Agree to all' });

    // Additional elements for assertions
    this.WOOLWORTHS_LINK = page.getByRole('link', { name: 'Woolworths' });
    this.ELIGIBILITY_LINK = page.getByRole('link', { name: 'Eligibility' });
    this.AUSTRALIA_FLAG_BUTTON = page.getByRole('button', { name: 'australia flag Australia' });
    this.START_SAVING_LINK = page.getByRole('link', { name: 'Start Saving' });
    this.EXCLUSIVE_SAVINGS_HEADING = page.getByRole('heading', { name: 'Exclusive savings for' });
    this.SEARCH_BY_COMPANY_OR_PHRASE_TEXT = page.getByText('Search by company or phrase');
    this.DEALS_OF_THE_WEEK_HEADING = page.getByRole('heading', { name: 'Deals of the Week' });
  }

  // Methods for common actions
  async acceptCookies(): Promise<void> {
    await this.ACCEPTCOOKIES_BUTTON.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.LOGIN_BUTTON.click();
    await expect(this.LOGIN_TEXT).toBeVisible();
    await this.EMAIL_TEXTFIELD.fill(email);
    await this.PASSWORD_TEXTFIELD.fill(password);
    await this.SUBMIT_BUTTON.click();
    await expect(this.LOGOUT_NAVBAR).toBeVisible();
  }

  async navigateToUrlAus(): Promise<void> {
    await this.webActions.navigateToURL(process.env.BASE_URL_AUS);
  }

  async navigateToUrlAndLogin(email: string, password: string): Promise<void> {
    await this.navigateToUrlAus();
    await this.acceptCookies();
    await this.login(email, password);
  }

  // Methods for verifying elements
  async assertElementsVisibleHomeScreenNotLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR).toBeVisible();
    await expect(this.HOME_NAVBAR).toBeVisible();
    await expect(this.WOOLWORTHS_LINK).toBeVisible();
    await expect(this.ELIGIBILITY_LINK).toBeVisible();
    await expect(this.OFFERS_NAVBAR).toBeVisible();
    await expect(this.FAQS_NAVBAR).toBeVisible();
    await expect(this.LOGIN_NAVBAR).toBeVisible();
    await expect(this.SIGNUP_NAVBAR).toBeVisible();
    await expect(this.AUSTRALIA_FLAG_BUTTON).toBeVisible();
    await expect(this.START_SAVING_LINK).toBeVisible();
    await expect(this.LOGIN_BUTTON).toBeVisible();
    await expect(this.EXCLUSIVE_SAVINGS_HEADING).toBeVisible();
  }

  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR).toBeVisible();
    await expect(this.HOME_NAVBAR).toBeVisible();
    await expect(this.OFFERS_NAVBAR).toBeVisible();
    await expect(this.MYCARD_NAVBAR).toBeVisible();
    await expect(this.MYACCOUNT_NAVBAR).toBeVisible();
    await expect(this.FAQS_NAVBAR).toBeVisible();
    await expect(this.LOGOUT_NAVBAR).toBeVisible();
    await expect(this.SEARCH_BY_COMPANY_OR_PHRASE_TEXT).toBeVisible();
    await expect(this.MAGNIFIER_SEARCHBAR).toBeVisible();
    await expect(this.DEALS_OF_THE_WEEK_HEADING).toBeVisible();
  }
}
