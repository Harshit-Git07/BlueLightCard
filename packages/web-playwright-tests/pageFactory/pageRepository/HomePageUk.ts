import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

let webActions: WebActions;

export class HomePageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Navbar top
  readonly BLUELIGHTBUTTON_NAVBAR: Locator;
  readonly HOME_NAVBAR: Locator;
  readonly ABOUTUS_NAVBAR: Locator;
  readonly ADDYOURBUSINESS_NAVBAR: Locator;
  readonly FAQS_NAVBAR: Locator;
  readonly REGISTERNOW_NAVBAR: Locator;
  readonly LOGIN_NAVBAR: Locator;
  readonly DISCOVERMORE_NAVBAR: Locator;
  readonly BROWSECATEGORIES_NAVBAR: Locator;
  readonly LOGOUT_NAVBAR: Locator;

  // Login options - Login screen
  readonly LOGIN_BUTTON: Locator;
  readonly LOGIN_TEXT: Locator;
  readonly EMAIL_TEXTFIELD: Locator;
  readonly PASSWORD_TEXTFIELD: Locator;
  readonly SUBMIT_BUTTON: Locator;

  // Additional locators for assertions
  readonly UK_FLAG_BUTTON: Locator;
  readonly REGISTER_LINK: Locator;
  readonly FORGOT_PASSWORD_LINK: Locator;
  readonly OFFERS_HEADER_LINK: Locator;
  readonly MY_CARD_LINK: Locator;
  readonly MY_ACCOUNT_LINK: Locator;
  readonly SEARCH_BUTTON: Locator;
  readonly DEALS_OF_THE_WEEK_HEADING: Locator;
  readonly PRIVACY_NOTICE_LINK: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Navbar top
    this.BLUELIGHTBUTTON_NAVBAR = page.locator('[data-testid="brandLogo"]');
    this.HOME_NAVBAR = page.locator('[data-testid="Home-header-link"]');
    this.ABOUTUS_NAVBAR = page.getByRole('navigation').getByRole('link', { name: 'About us' });
    this.ADDYOURBUSINESS_NAVBAR = page.getByRole('link', { name: 'Add your business' });
    this.FAQS_NAVBAR = page.getByRole('link', { name: 'FAQs' });
    this.REGISTERNOW_NAVBAR = page
      .getByRole('navigation')
      .getByRole('link', { name: 'Register now' });
    this.LOGIN_NAVBAR = page.getByLabel('Login');
    this.DISCOVERMORE_NAVBAR = page.locator('[data-testid="navigation-dropdown-discover-more"]');
    this.BROWSECATEGORIES_NAVBAR = page.getByRole('link', { name: 'Browse categories' });
    this.LOGOUT_NAVBAR = page.getByRole('link', { name: 'Logout' });

    // Login options - Login screen
    this.LOGIN_BUTTON = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON = page.getByRole('button', { name: 'submit' });

    // Additional locators for assertions
    this.UK_FLAG_BUTTON = page.getByRole('button', { name: 'United Kingdom flag United' });
    this.REGISTER_LINK = page.getByRole('link', { name: 'Register', exact: true });
    this.FORGOT_PASSWORD_LINK = page.getByRole('link', { name: 'Forgot password?' });
    this.OFFERS_HEADER_LINK = page.getByTestId('Offers-header-link');
    this.MY_CARD_LINK = page.getByRole('link', { name: 'My Card' });
    this.MY_ACCOUNT_LINK = page.getByRole('link', { name: 'My Account' });
    this.SEARCH_BUTTON = page.locator('[data-testid="searchBtn"]');
    this.DEALS_OF_THE_WEEK_HEADING = page.getByRole('heading', { name: 'Deals of the Week' });
    this.PRIVACY_NOTICE_LINK = page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Privacy Notice', exact: true });
  }

  // Navigation methods
  async navigateToUrlUk(): Promise<void> {
    await this.page.goto(process.env.BASE_URL_UK!, { waitUntil: 'load' });
  }

  async navigateToUrlAndLogin(email: string, password: string): Promise<void> {
    await this.navigateToUrlUk();
    await this.acceptCookies();
    await this.login(email, password);
  }

  // Cookie handling
  async acceptCookies(): Promise<void> {
    await this.page.getByRole('button', { name: 'Agree to all' }).click();
  }

  // Login methods
  async login(email: string, password: string): Promise<void> {
    await this.LOGIN_BUTTON.click();
    await expect(this.LOGIN_TEXT).toBeVisible();
    await this.EMAIL_TEXTFIELD.fill(email);
    await this.PASSWORD_TEXTFIELD.fill(password);
    await this.SUBMIT_BUTTON.click();
    await expect(this.LOGOUT_NAVBAR).toBeVisible();
  }

  // Element assertions
  async assertElementsVisibleHomeScreenNotLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR).toBeVisible();
    await expect(this.HOME_NAVBAR).toBeVisible();
    await expect(this.ABOUTUS_NAVBAR).toBeVisible();
    await expect(this.ADDYOURBUSINESS_NAVBAR).toBeVisible();
    await expect(this.FAQS_NAVBAR).toBeVisible();
    await expect(this.REGISTERNOW_NAVBAR).toBeVisible();
    await expect(this.DISCOVERMORE_NAVBAR).toBeVisible();
    await expect(this.UK_FLAG_BUTTON).toBeVisible();
    await expect(this.REGISTER_LINK).toBeVisible();
    await expect(this.LOGIN_BUTTON).toBeVisible();
    await expect(this.FORGOT_PASSWORD_LINK).toBeVisible();
  }

  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR).toBeVisible();

    // TODO - The below if statements are a workaround - these need revisited as working like this to differentiate elements in environments is not ideal
    if (process.env.ENVIRONMENT === 'live') {
      await expect(this.HOME_NAVBAR).toBeVisible();
    }
    await expect(this.OFFERS_HEADER_LINK).toBeVisible();

    if (process.env.ENVIRONMENT === 'staging') {
      await expect(this.DISCOVERMORE_NAVBAR).toBeVisible();
    } else {
      await expect(this.BROWSECATEGORIES_NAVBAR).toBeVisible();
    }

    await expect(this.MY_CARD_LINK).toBeVisible();
    await expect(this.MY_ACCOUNT_LINK).toBeVisible();
    await expect(this.FAQS_NAVBAR).toBeVisible();
    await expect(this.LOGOUT_NAVBAR).toBeVisible();
    await expect(this.SEARCH_BUTTON).toBeVisible();
    await expect(this.DEALS_OF_THE_WEEK_HEADING).toBeVisible();
  }

  // Menu selection methods
  async selectOptionFromTheOffersMenu(offersOption: string): Promise<void> {
    await this.DISCOVERMORE_NAVBAR.hover();
    await this.page.getByRole('link', { name: offersOption }).click();
  }

  async selectOptionFromTheDiscoverSavingsMenu(offersOption: string): Promise<void> {
    await this.DISCOVERMORE_NAVBAR.hover();
    await this.page.getByRole('link', { name: offersOption }).click();
  }

  async clickTheBlueLightCardLogoToReturnHome(): Promise<void> {
    await this.BLUELIGHTBUTTON_NAVBAR.click();
  }

  async verifyLoginScreenAppears(): Promise<void> {
    await expect(this.LOGIN_BUTTON).toBeVisible();
  }

  async selectOptionFromTheTopMenu(topBarOption: string): Promise<void> {
    await this.page.getByRole('link', { name: topBarOption }).click();
  }

  // Footer methods
  async selectOptionFromTheFooterMenu(footerOption: string): Promise<void> {
    await this.page.getByRole('link', { name: footerOption, exact: true }).click();
  }

  async selectPrivacyNotice(): Promise<void> {
    await this.PRIVACY_NOTICE_LINK.click();
  }
}
