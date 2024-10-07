import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class HomePagePreLoginUK {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
  // Navbar top - logged out
  private readonly BLUELIGHTBUTTON_NAVBAR_UK: Locator;
  private readonly HOME_NAVBAR_UK: Locator;
  private readonly ABOUTUS_NAVBAR_UK: Locator;
  private readonly ADDYOURBUSINESS_NAVBAR_UK: Locator;
  private readonly FAQS_NAVBAR_UK: Locator;
  private readonly REGISTERNOW_NAVBAR_UK: Locator;
  private readonly DISCOVERMORE_NAVBAR_UK: Locator;
  private readonly LOGOUT_NAVBAR_UK: Locator;


  // Login options - Login screen
  private readonly LOGIN_BUTTON_UK: Locator;
  private readonly LOGIN_TEXT_UK: Locator;
  private readonly EMAIL_TEXTFIELD_UK: Locator;
  private readonly PASSWORD_TEXTFIELD_UK: Locator;
  private readonly SUBMIT_BUTTON_UK: Locator;
  private readonly INCORRECT_LOGIN_WARNING_UK: Locator;



  // Cookie handling
  private readonly ACCEPT_COOKIES_BUTTON_UK: Locator;


  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;

    // Initialize locators
    // Navbar top - logged out
    this.BLUELIGHTBUTTON_NAVBAR_UK = page.getByTestId('Logout-header-link');
    this.HOME_NAVBAR_UK = page.locator('[data-testid="Home-header-link"]');
    this.ABOUTUS_NAVBAR_UK = page.getByRole('navigation').getByRole('link', { name: 'About us' });
    this.ADDYOURBUSINESS_NAVBAR_UK = page.getByRole('link', { name: 'Add your business' });
    this.FAQS_NAVBAR_UK = page.getByRole('link', { name: 'FAQs' });
    this.REGISTERNOW_NAVBAR_UK = page
      .getByRole('navigation')
      .getByRole('link', { name: 'Register now' });
    this.DISCOVERMORE_NAVBAR_UK = page.locator('[data-testid="navigation-dropdown-discover-more"]');
    this.LOGOUT_NAVBAR_UK = page.getByRole('link', { name: 'Logout' });


    // Login options - Login screen
    this.LOGIN_BUTTON_UK = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT_UK = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD_UK = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD_UK = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON_UK = page.getByRole('button', { name: 'submit' });
    this.INCORRECT_LOGIN_WARNING_UK = page.getByRole('paragraph');



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
    await this.page.waitForLoadState('load');
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
  
    await expect(this.LOGIN_BUTTON_UK).toBeVisible();
  
  }

  // Asserts that all incorrect login details elements are present and visible on the page

  async assertIncorrectLoginDetailsElementsArePresent(): Promise<void> {
  

    await expect(this.EMAIL_TEXTFIELD_UK).toBeVisible();
    await expect(this.PASSWORD_TEXTFIELD_UK).toBeVisible();
    await expect(this.SUBMIT_BUTTON_UK).toBeVisible();
    await expect(this.INCORRECT_LOGIN_WARNING_UK).toBeVisible();

  
  }

 
}

