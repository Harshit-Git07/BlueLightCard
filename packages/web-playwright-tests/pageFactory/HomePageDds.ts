import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

let webActions: WebActions;

export class HomePageDds {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
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

  // Additional locators for assertions
  private readonly DEALS_OF_THE_WEEK_HEADING_DDS: Locator;

  // Cookie handling
  private readonly ACCEPT_COOKIES_BUTTON_DDS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Initialize locators
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
}
