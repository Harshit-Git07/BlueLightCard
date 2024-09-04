import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class HomePageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Navbar top
  private readonly BLUELIGHTBUTTON_NAVBAR_UK: Locator;
  private readonly HOME_NAVBAR_UK: Locator;
  private readonly ABOUTUS_NAVBAR_UK: Locator;
  private readonly ADDYOURBUSINESS_NAVBAR_UK: Locator;
  private readonly FAQS_NAVBAR_UK: Locator;
  private readonly REGISTERNOW_NAVBAR_UK: Locator;
  private readonly DISCOVERMORE_NAVBAR_UK: Locator;
  private readonly BROWSECATEGORIES_NAVBAR_UK: Locator;
  private readonly LOGOUT_NAVBAR_UK: Locator;

  // Login options - Login screen
  private readonly LOGIN_BUTTON_UK: Locator;
  private readonly LOGIN_TEXT_UK: Locator;
  private readonly EMAIL_TEXTFIELD_UK: Locator;
  private readonly PASSWORD_TEXTFIELD_UK: Locator;
  private readonly SUBMIT_BUTTON_UK: Locator;

  // Additional locators for assertions
  private readonly UK_FLAG_BUTTON_UK: Locator;
  private readonly REGISTER_LINK_UK: Locator;
  private readonly FORGOT_PASSWORD_LINK_UK: Locator;
  private readonly OFFERS_HEADER_LINK_UK: Locator;
  private readonly MY_CARD_LINK_UK: Locator;
  private readonly MY_ACCOUNT_LINK_UK: Locator;
  private readonly SEARCH_BUTTON_UK: Locator;
  private readonly DEALS_OF_THE_WEEK_HEADING_UK: Locator;

  // Cookie handling
  private readonly ACCEPT_COOKIES_BUTTON_UK: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;

    // Navbar top
    this.BLUELIGHTBUTTON_NAVBAR_UK = page.locator('[data-testid="brandLogo"]');
    this.HOME_NAVBAR_UK = page.locator('[data-testid="Home-header-link"]');
    this.ABOUTUS_NAVBAR_UK = page.getByRole('navigation').getByRole('link', { name: 'About us' });
    this.ADDYOURBUSINESS_NAVBAR_UK = page.getByRole('link', { name: 'Add your business' });
    this.FAQS_NAVBAR_UK = page.getByRole('link', { name: 'FAQs' });
    this.REGISTERNOW_NAVBAR_UK = page
      .getByRole('navigation')
      .getByRole('link', { name: 'Register now' });
    this.DISCOVERMORE_NAVBAR_UK = page.locator('[data-testid="navigation-dropdown-discover-more"]');
    this.BROWSECATEGORIES_NAVBAR_UK = page.getByRole('link', { name: 'Browse categories' });
    this.LOGOUT_NAVBAR_UK = page.getByRole('link', { name: 'Logout' });

    // Login options - Login screen
    this.LOGIN_BUTTON_UK = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT_UK = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD_UK = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD_UK = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON_UK = page.getByRole('button', { name: 'submit' });

    // Additional locators for assertions
    this.UK_FLAG_BUTTON_UK = page.getByRole('button', { name: 'United Kingdom flag United' });
    this.REGISTER_LINK_UK = page.getByRole('link', { name: 'Register', exact: true });
    this.FORGOT_PASSWORD_LINK_UK = page.getByRole('link', { name: 'Forgot password?' });
    this.OFFERS_HEADER_LINK_UK = page.getByTestId('Offers-header-link');
    this.MY_CARD_LINK_UK = page.getByRole('link', { name: 'My Card' });
    this.MY_ACCOUNT_LINK_UK = page.getByRole('link', { name: 'My Account' });
    this.SEARCH_BUTTON_UK = page.locator('[data-testid="searchBtn"]');
    this.DEALS_OF_THE_WEEK_HEADING_UK = page.getByRole('heading', { name: 'Deals of the Week' });

    // Cookie handling
    this.ACCEPT_COOKIES_BUTTON_UK = page.getByRole('button', { name: 'Agree to all' });
  }

  // Navigation methods
  async navigateToUrlUk(): Promise<void> {
    await this.page.goto(process.env.BASE_URL_UK, { waitUntil: 'load' });
  }

  async navigateToUrlAndLogin(email: string, password: string): Promise<void> {
    await this.navigateToUrlUk();
    await this.acceptCookies();
    await this.login(email, password);
  }

  // Cookie handling
  async acceptCookies(): Promise<void> {
    await this.ACCEPT_COOKIES_BUTTON_UK.click();
  }

  // Login methods
  async login(email: string, password: string): Promise<void> {
    await this.LOGIN_BUTTON_UK.click();
    await expect(this.LOGIN_TEXT_UK).toBeVisible();
    await this.EMAIL_TEXTFIELD_UK.fill(email);
    await this.PASSWORD_TEXTFIELD_UK.fill(password);
    await this.SUBMIT_BUTTON_UK.click();
    await this.page.waitForLoadState('load'); // Wait until the page is fully loaded
  }

  // Element assertions
  async assertElementsVisibleHomeScreenNotLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR_UK).toBeVisible();
    await expect(this.HOME_NAVBAR_UK).toBeVisible();
    await expect(this.ABOUTUS_NAVBAR_UK).toBeVisible();
    await expect(this.ADDYOURBUSINESS_NAVBAR_UK).toBeVisible();
    await expect(this.FAQS_NAVBAR_UK).toBeVisible();
    await expect(this.REGISTERNOW_NAVBAR_UK).toBeVisible();
    await expect(this.DISCOVERMORE_NAVBAR_UK).toBeVisible();
    await expect(this.UK_FLAG_BUTTON_UK).toBeVisible();
    await expect(this.REGISTER_LINK_UK).toBeVisible();
    await expect(this.LOGIN_BUTTON_UK).toBeVisible();
    await expect(this.FORGOT_PASSWORD_LINK_UK).toBeVisible();
  }

  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR_UK).toBeVisible();

    // Handle environment-specific conditions
    if (process.env.ENVIRONMENT === 'production') {
      await expect(this.HOME_NAVBAR_UK).toBeVisible();
    }
    await expect(this.OFFERS_HEADER_LINK_UK).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_UK).toBeVisible();
    await expect(this.SEARCH_BUTTON_UK).toBeVisible();
  }

  // Menu selection methods
  async selectOptionFromTheOffersMenu(offersOption: string): Promise<void> {
    await this.DISCOVERMORE_NAVBAR_UK.hover();
    await this.page.getByRole('link', { name: offersOption }).click();
  }
}
