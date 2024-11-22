import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { verifyOfferPageLoad } from 'utils/functional/verifyUtils';

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
  private readonly COPY_DISCOUNT_CODE_UK: Locator;
  private readonly VISIT_WEBSITE_UK: Locator;
  private readonly CONTINUE_TO_PARTNER_WEBSITE_UK: Locator;

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
    this.BLUELIGHTBUTTON_NAVBAR_UK = page.locator('div.bg-NavBar-bg-colour');
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

    this.ONLINE_DISCOUNTS = page.locator('a[href="/offers.php?type=0"]');
    this.GIFTCARD_DISCOUNTS = page.locator('a[href="/offers.php?type=2"]');
    this.HIGH_STREET_OFFERS = page.locator('a[href="/offers.php?type=5"]');
    this.POPULAR_DISCOUNTS = page.locator('a[href="/offers.php?type=3"]');
    this.DEALS_OF_THE_WEEK = page.locator('a[href="/members-home"]');
    this.BLUE_LIGHT_CARD_FOUNDATION = page.locator('a[href="/foundation.php"]');
    this.LATEST_NEWS_AND_BLOGS = page.locator('a[href="/bluelightcardnews.php"]');
    this.ABOUT_US = page.locator('a[href="/about_blue_light_card.php"]');
    this.FREE_TICKETS = page.locator('a[href="/freenhsandbluelightcardtickets.php"]');
    this.COMPLIANCE = page.locator('a[href="/compliance.php"]');
    this.ADD_A_DISCOUNT = page.locator('a[href="/addaforcesdiscount.php"]');
    this.MOBILE_APP = page.locator('a[href="/bluelightcardmobileapp.php"]');
    this.COMPETITIONS = page.locator('a[href="https://prizedraw-terms-conditions.bluelightcard.co.uk/"]');
    this.SITEMAP = page.locator('a[href="/sitemap.php"]');
    this.CONTACT_US = page.locator('a[href="https://bluelightcard.zendesk.com/hc/en-gb/signin"]');
    this.CAREERS_AT_BLUE_LIGHT_CARD = page.locator('a[href="https://careers.bluelightcard.co.uk"]');
    this.LEGAL_AND_REGULATORY = page.locator('a[href="/legal-and-regulatory.php"]');
    this.TERMS_AND_CONDITIONS = page.locator('a[href="/terms_and_conditions.php"]');
    this.PRIVACY_NOTICE = page.locator('a[href="/privacy-notice.php"]');
    this.CANDIDATE_PRIVACY_NOTICE = page.locator('a[href="/candidate-privacy-notice.php"]');
    this.COOKIES_POLICY = page.locator('a[href="/cookies_policy.php"]');
    this.MANAGE_COOKIES = page.locator('a[href="/managecookies.php"]');
    this.MODERN_SLAVERY_ACT_STATEMENT = page.locator('a[href="/modern-slavery-act.php"]');

    // Search options
    this.SEARCH_BUTTON_UK = page.locator("//input[@placeholder='Search for offers or companies']").first();
    this.SEARCH_OPTION_COMPANY_UK = page.getByLabel('Search for a company');
    this.SEARCH_OPTION_CATEGORY_UK = page.getByTestId('byCategory');
    this.SEARCH_OPTION_SEARCHTERM_UK = page.getByRole('textbox');
    this.SEARCH_NOW_BUTTON_UK = page.getByRole('button', { name: 'Search now' });

    // Cookie handling
    this.ACCEPT_COOKIES_BUTTON_UK = page.getByRole('button', { name: 'Agree to all' });
    this.CLICK_HERE_TO_SEE_DISCOUNT_UK = page.getByText('Click here to see discount');
    this.COPY_DISCOUNT_CODE_UK = page.locator('text=Copy discount code');
    this.VISIT_WEBSITE_UK = page.getByRole('button', { name: 'Visit Website' });
    this.CONTINUE_TO_PARTNER_WEBSITE_UK = page.locator('.text-magicButton-pressed-label-colour');
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
        await this.page.waitForLoadState('networkidle');
        await this.SEARCH_OPTION_COMPANY_UK.click();
       // await this.page.selectOption('select[aria-label="drop-down selector"]', {
        //  label: searchTerm,
        await this.page.waitForLoadState('networkidle');
        await this.SEARCH_OPTION_COMPANY_UK.fill(searchTerm);
        await this.page.locator(`text=${searchTerm}`).click();
        

      
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

   
    this.page.locator("//button[@class='text-left']").click();

    await expect(
      this.page.getByRole('heading', { name: searchTerm, exact: true }).first(),
    ).toBeVisible();
  }
  async clickToSeeTheDiscount(newPageUrl: string): Promise<void> {

    await this.COPY_DISCOUNT_CODE_UK.first().click();
   
    await this.CONTINUE_TO_PARTNER_WEBSITE_UK.click();
  
    await this.visitWebsiteAndVerifyUrl(newPageUrl);

    
}

 async visitWebsiteAndVerifyUrl(newPageUrl: string): Promise<void> {
  
  const offerPagePromise = this.page.waitForEvent('popup');
  

  await verifyOfferPageLoad(offerPagePromise, newPageUrl);

   
}

// Asserts that all the carousels on the home screen are visible when the user is logged in
async assertCarouselsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.SPONSOR_BANNER_UK).toBeVisible();
    await expect(this.DEAL_OF_THE_WEEK_UK).toBeVisible();
    await expect(this.FLEXI_MENU_UK).toBeVisible();
    await expect(this.MARKETPLACE_MENU_UK).toBeVisible();
    await expect(this.FEATURE_CAROUSEL_UK).toBeVisible();
}

 async readFromClipboardAndAssert(expectedDiscountCode: string): Promise<void> {
    const clipboardText = await this.page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    expect(clipboardText).toBe(expectedDiscountCode);
}
}
