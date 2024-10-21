import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class MembersHomeUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators


  //Navbar - logged in
  private readonly MYACCOUNT_NAVBAR_UK: Locator;
  private readonly BLUELIGHTBUTTON_NAVBAR_UK: Locator;
  private readonly HOME_NAVBAR_UK: Locator;
  private readonly FAQS_NAVBAR_UK: Locator;
  private readonly DISCOVERMORE_NAVBAR_UK: Locator;
  private readonly LOGOUT_NAVBAR_UK: Locator;

  //Personal Infomation
  private readonly MOBILE_FIELD_UK: Locator;
  private readonly UPDATE_BUTTON_UK: Locator;

    //Footer Locators

    private readonly ONLINE_DISCOUNTS: Locator;
    private readonly GIFTCARD_DISCOUNTS: Locator;
    private readonly HIGH_STREET_OFFERS: Locator;
    private readonly POPULAR_DISCOUNTS: Locator;
    private readonly OFFERS_NEAR_YOU: Locator;
    private readonly DEALS_OF_THE_WEEK: Locator;
    private readonly BLUE_LIGHT_CARD_FOUNDATION: Locator;
    private readonly LATEST_NEWS_AND_BLOGS: Locator;
    private readonly ABOUT_US: Locator;
    private readonly FREE_TICKETS: Locator;
    private readonly COMPLIANCE: Locator;
    private readonly ADD_A_DISCOUNT: Locator;
    private readonly MOBILE_APP: Locator;
    private readonly COMPETITIONS: Locator;
    private readonly SITEMAP: Locator;
    private readonly CONTACT_US: Locator;
    private readonly CAREERS_AT_BLUE_LIGHT_CARD: Locator;
    private readonly LEGAL_AND_REGULATORY: Locator;
    private readonly TERMS_AND_CONDITIONS: Locator;
    private readonly PRIVACY_NOTICE: Locator;
    private readonly CANDIDATE_PRIVACY_NOTICE: Locator;
    private readonly COOKIES_POLICY: Locator;
    private readonly MANAGE_COOKIES: Locator;
    private readonly MODERN_SLAVERY_ACT_STATEMENT: Locator;


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

    //Navbar - logged in
    this.MYACCOUNT_NAVBAR_UK = page.getByTestId('My Account-header-link');

    //Personal Infomation
    this.MOBILE_FIELD_UK = page.getByPlaceholder('Mobile Number');
    this.UPDATE_BUTTON_UK = page.locator("button[data-qa='button-personal-info-details']");

    // Additional locators for assertions
    this.BLUELIGHTBUTTON_NAVBAR_UK = page.getByTestId('Logout-header-link');
    this.UK_FLAG_BUTTON_UK = page.getByRole('button', { name: 'United Kingdom flag United' });
    this.REGISTER_LINK_UK = page.getByRole('link', { name: 'Register', exact: true });
    this.FORGOT_PASSWORD_LINK_UK = page.getByRole('link', { name: 'Forgot password?' });
    this.OFFERS_HEADER_LINK_UK = page.getByTestId('Offers-header-link');
    this.SPONSOR_BANNER_UK = page.getByTestId('homepage-sponsor-banners');
    this.DEAL_OF_THE_WEEK_UK = page.getByRole('heading', { name: 'Deals of the week' });
    this.FLEXI_MENU_UK = page.getByTestId('flexi-menu-carousel');
    this.MARKETPLACE_MENU_UK = page.getByTestId('marketplace-menu-carousel-0');
    this.FEATURE_CAROUSEL_UK = page.getByTestId('featured-menu-carousel');
    this.BLUELIGHTBUTTON_NAVBAR_UK = page.locator('[data-testid="brandLogo"]');
    this.HOME_NAVBAR_UK = page.locator('[data-testid="Home-header-link"]');
    this.FAQS_NAVBAR_UK = page.getByRole('link', { name: 'FAQs' });
    this.DISCOVERMORE_NAVBAR_UK = page.locator('[data-testid="navigation-dropdown-discover-more"]');
    this.LOGOUT_NAVBAR_UK = page.getByRole('link', { name: 'Logout' });

        //Footer Locators

        this.ONLINE_DISCOUNTS = page.locator('[data-testid="Online Discounts-link"]');
        this.GIFTCARD_DISCOUNTS = page.locator('[data-testid="Giftcard Discounts-link"]');
        this.HIGH_STREET_OFFERS = page.locator('[data-testid="High Street Offers-link"]');
        this.POPULAR_DISCOUNTS = page.locator('[data-testid="Popular Discounts-link"]');
        this.OFFERS_NEAR_YOU = page.locator('[data-testid="Offers Near You-link"]');
        this.DEALS_OF_THE_WEEK = page.locator('[data-testid="Deals of the Week-link"]');
        this.BLUE_LIGHT_CARD_FOUNDATION = page.locator('[data-testid="Blue Light Card Foundation-link"]');
        this.LATEST_NEWS_AND_BLOGS = page.locator('[data-testid="Latest News & Blogs-link"]');
        this.ABOUT_US = page.locator('[data-testid="About Us-link"]');
        this.FREE_TICKETS = page.locator('[data-testid="Free Tickets-link"]');
        this.COMPLIANCE = page.locator('[data-testid="Compliance-link"]');
        this.ADD_A_DISCOUNT = page.locator('[data-testid="Add a discount-link"]');
        this.MOBILE_APP = page.locator('[data-testid="Mobile App-link"]');
        this.COMPETITIONS = page.locator('[data-testid="Competitions-link"]');
        this.SITEMAP = page.locator('[data-testid="Sitemap-link"]');
        this.CONTACT_US = page.locator('[data-testid="Contact Us-link"]');
        this.CAREERS_AT_BLUE_LIGHT_CARD = page.locator('[data-testid="Careers at Blue Light Card-link"]');
        this.LEGAL_AND_REGULATORY = page.locator('[data-testid="Legal and Regulatory-link"]');
        this.TERMS_AND_CONDITIONS = page.locator('[data-testid="Terms and Conditions-link"]');
        this.PRIVACY_NOTICE = page.locator('[data-testid="Privacy Notice-link"]');
        this.CANDIDATE_PRIVACY_NOTICE = page.locator('[data-testid="Candidate Privacy Notice-link"]');
        this.COOKIES_POLICY = page.locator('[data-testid="Cookies Policy-link"]');
        this.MANAGE_COOKIES = page.locator('[data-testid="Manage Cookies-link"]');
        this.MODERN_SLAVERY_ACT_STATEMENT = page.locator('[data-testid="Modern Slavery Act Statement-link"]');

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
    await this.page.goto(process.env.MEMBERS_HOME_URL_UK, { waitUntil: 'load' });
  }

  // Footer Navigation methods

async clickOnlineDiscounts(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.ONLINE_DISCOUNTS.click();
}

async clickGiftcardDiscounts(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.GIFTCARD_DISCOUNTS.click();
}

async clickHighStreetOffers(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.HIGH_STREET_OFFERS.click();
}

async clickPopularDiscounts(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.POPULAR_DISCOUNTS.click();
}

async clickOffersNearYou(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.OFFERS_NEAR_YOU.click();
}

async clickDealsOfTheWeek(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.DEALS_OF_THE_WEEK.click();
}

async clickBlueLightCardFoundation(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.BLUE_LIGHT_CARD_FOUNDATION.click();
}

async clickLatestNewsAndBlogs(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.LATEST_NEWS_AND_BLOGS.click();
}

async clickAboutUs(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.ABOUT_US.click();
}

async clickFreeTickets(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.FREE_TICKETS.click();
}

async clickCompliance(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.COMPLIANCE.click();
}

async clickAddADiscount(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.ADD_A_DISCOUNT.click();
}

async clickMobileApp(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.MOBILE_APP.click();
}

async clickCompetitions(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.COMPETITIONS.click();
}

async clickSitemap(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.SITEMAP.click();
}

async clickContactUs(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.CONTACT_US.click();
}

async clickCareersAtBlueLightCard(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.CAREERS_AT_BLUE_LIGHT_CARD.click();
}

async clickLegalAndRegulatory(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.LEGAL_AND_REGULATORY.click();
}

async clickTermsAndConditions(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.TERMS_AND_CONDITIONS.click();
}

async clickPrivacyNotice(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.PRIVACY_NOTICE.click();
}

async clickCandidatePrivacyNotice(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.CANDIDATE_PRIVACY_NOTICE.click();
}

async clickCookiesPolicy(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.COOKIES_POLICY.click();
}

async clickManageCookies(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.MANAGE_COOKIES.click();
}

async clickModernSlaveryActStatement(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
  await this.MODERN_SLAVERY_ACT_STATEMENT.click();
}

 
  // Cookie handling
  async acceptCookies(): Promise<void> {
    await this.ACCEPT_COOKIES_BUTTON_UK.click();
  }

  // Element assertions

  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
     expect(this.BLUELIGHTBUTTON_NAVBAR_UK).toBeVisible();

     //Handle environment-specific conditions
     if (process.env.ENVIRONMENT === 'production') {
       await expect(this.HOME_NAVBAR_UK).toBeVisible();
     }
    await expect(this.OFFERS_HEADER_LINK_UK).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_UK).toBeVisible();
    await expect(this.SEARCH_BUTTON_UK).toBeVisible();
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



