import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class HomePageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
  // Navbar top
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

  // Additional locators for assertions
  private readonly UK_FLAG_BUTTON_UK: Locator;
  private readonly REGISTER_LINK_UK: Locator;
  private readonly FORGOT_PASSWORD_LINK_UK: Locator;
  private readonly OFFERS_HEADER_LINK_UK: Locator;
  private readonly SPONSOR_BANNER_UK: Locator;
  private readonly DEAL_OF_THE_WEEK_UK: Locator;
  private readonly FLEXI_MENU_UK: Locator;
  private readonly MARKETPLACE_MENU_UK: Locator;
  private readonly FEATURE_CAROUSEL_UK: Locator;

  // Search options
  private readonly SEARCH_BUTTON_UK: Locator;
  private readonly SEARCH_OPTION_COMPANY_UK: Locator;
  private readonly SEARCH_OPTION_CATEGORY_UK: Locator;
  private readonly SEARCH_OPTION_SEARCHTERM_UK: Locator;
  private readonly SEARCH_NOW_BUTTON_UK: Locator;

  // Cookie handling
  private readonly ACCEPT_COOKIES_BUTTON_UK: Locator;

  // Code Redemption options
  private readonly CLICK_HERE_TO_SEE_DISCOUNT_UK: Locator;
  private readonly VISIT_WEBSITE_UK: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;

    // Initialize locators
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
    this.LOGOUT_NAVBAR_UK = page.getByRole('link', { name: 'Logout' });

    // Login options - Login screen
    this.LOGIN_BUTTON_UK = page.getByRole('link', { name: 'Login' }).nth(1);
    this.LOGIN_TEXT_UK = page.getByText('Sign in with your email and').nth(1);
    this.EMAIL_TEXTFIELD_UK = page.getByRole('textbox', { name: 'name@host.com' });
    this.PASSWORD_TEXTFIELD_UK = page.getByRole('textbox', { name: 'Password' });
    this.SUBMIT_BUTTON_UK = page.getByRole('button', { name: 'submit' });
    this.INCORRECT_LOGIN_WARNING_UK = page.getByRole('paragraph');

    // Additional locators for assertions
    this.UK_FLAG_BUTTON_UK = page.getByRole('button', { name: 'United Kingdom flag United' });
    this.REGISTER_LINK_UK = page.getByRole('link', { name: 'Register', exact: true });
    this.FORGOT_PASSWORD_LINK_UK = page.getByRole('link', { name: 'Forgot password?' });
    this.OFFERS_HEADER_LINK_UK = page.getByTestId('Offers-header-link');
    this.SPONSOR_BANNER_UK = page.getByTestId('homepage-sponsor-banners');
    this.DEAL_OF_THE_WEEK_UK = page.getByRole('heading', { name: 'Deals of the week' });
    this.FLEXI_MENU_UK = page.getByTestId('flexi-menu-carousel');
    this.MARKETPLACE_MENU_UK = page.getByTestId('marketplace-menu-carousel-0');
    this.FEATURE_CAROUSEL_UK = page.getByTestId('featured-menu-carousel');

    // Search options
    this.SEARCH_BUTTON_UK = page.getByTestId('searchBtn').locator('svg');
    this.SEARCH_OPTION_COMPANY_UK = page.getByTestId('byCompany');
    this.SEARCH_OPTION_CATEGORY_UK = page.getByTestId('byCategory');
    this.SEARCH_OPTION_SEARCHTERM_UK = page.getByRole('textbox');
    this.SEARCH_NOW_BUTTON_UK = page.getByRole('button', { name: 'Search now' });

    // Cookie handling
    this.ACCEPT_COOKIES_BUTTON_UK = page.getByRole('button', { name: 'Agree to all' });
    this.CLICK_HERE_TO_SEE_DISCOUNT_UK = page.getByText('Click here to see discount');
    this.VISIT_WEBSITE_UK = page.getByRole('button', { name: 'Visit Website' });
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

  async assertIncorrectLoginDetailsElementsArePresent(): Promise<void> {
  

    await expect(this.EMAIL_TEXTFIELD_UK).toBeVisible();
    await expect(this.PASSWORD_TEXTFIELD_UK).toBeVisible();
    await expect(this.SUBMIT_BUTTON_UK).toBeVisible();
    await expect(this.INCORRECT_LOGIN_WARNING_UK).toBeVisible();

  
  }


  //Navigation methods
  // Menu selection methods
  async selectOptionFromTheOffersMenu(offersOption: string): Promise<void> {
    await this.DISCOVERMORE_NAVBAR_UK.hover();
    await this.page.getByRole('link', { name: offersOption }).click();
  }

  // Search option methods
  async searchForCompanyCategoryOrPhrase(searchOption: string, searchTerm: string): Promise<void> {
    await this.SEARCH_BUTTON_UK.click();
    switch (searchOption.toLowerCase()) {
      case 'company':
        await this.SEARCH_OPTION_COMPANY_UK.click();
        await this.page.selectOption('select[aria-label="drop-down selector"]', {
          label: searchTerm,
        });

        break;

      case 'category':
        await this.SEARCH_OPTION_CATEGORY_UK.click();
        await this.page.selectOption('select[aria-label="drop-down selector"]', {
          label: searchTerm,
        });

        break;
        
      case 'phrase':
        await this.SEARCH_OPTION_SEARCHTERM_UK.fill(searchTerm);
        await this.SEARCH_NOW_BUTTON_UK.click();

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

  async clickToSeeTheDiscount(expectedDiscountCode: string, newPageUrl: string): Promise<void> {
    await this.CLICK_HERE_TO_SEE_DISCOUNT_UK.click();
    const offerPagePromise = this.page.waitForEvent('popup');
    await this.VISIT_WEBSITE_UK.click();

    const offerPage = await offerPagePromise;
    await offerPage.waitForLoadState('load');
    expect(offerPage.url()).toContain(newPageUrl);

    // Ensure the clipboard has the expected value by reading it and asserting expected vs actual
    await this.context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const clipboardText = await offerPage.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    expect(clipboardText).toBe(expectedDiscountCode);
  }
  // Asserts that all the carousels on the home screen are visible when the user is logged in
  async assertCarouselsVisibleHomeScreenLoggedIn(): Promise<void> {

    await expect(this.SPONSOR_BANNER_UK).toBeVisible();
    await expect(this.DEAL_OF_THE_WEEK_UK).toBeVisible();
    await expect(this.FLEXI_MENU_UK).toBeVisible();
    await expect(this.MARKETPLACE_MENU_UK).toBeVisible();
    await expect(this.FEATURE_CAROUSEL_UK).toBeVisible();

   
  }

}
