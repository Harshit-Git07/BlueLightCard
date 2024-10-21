import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class MembersHomeAus {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators


  //Navbar - logged in
  private readonly MYACCOUNT_NAVBAR_AUS: Locator;
  private readonly HOME_NAVBAR_AUS: Locator;
  private readonly LOGOUT_NAVBAR_AUS: Locator;


  //Personal Infomation
  private readonly MOBILE_FIELD_AUS: Locator;
  private readonly UPDATE_BUTTON_AUS: Locator;

  // Searchbar options
  private readonly MAGNIFIER_SEARCHBAR_AUS: Locator;

    //Footer Locators

  
    private readonly ONLINE_DISCOUNTS: Locator;
    private readonly GIFT_CARD_DISCOUNTS: Locator;
    private readonly IN_STORE_OFFERS: Locator;
    private readonly POPULAR_DISCOUNTS: Locator;
    private readonly OFFERS_NEAR_YOU: Locator;
    private readonly DEALS_OF_THE_WEEK: Locator;
    private readonly MOBILE_APP: Locator;
    private readonly CONTACT_US: Locator;
    private readonly SITEMAP: Locator;
    private readonly LOCAL_BUSINESSES: Locator;
    private readonly FAQS: Locator;
    private readonly TERMS_AND_CONDITIONS: Locator;
    private readonly PRIVACY_NOTICE: Locator;
    private readonly CANDIDATE_PRIVACY_NOTICE: Locator;
    private readonly COOKIES_POLICY: Locator;
    private readonly MANAGE_COOKIES: Locator;
    private readonly MODERN_SLAVERY_ACT: Locator;
    private readonly COPYRIGHT_NOTICE: Locator;



  // Cookies popup
  private readonly ACCEPTCOOKIES_BUTTON_AUS: Locator;

  // Additional elements for assertions
  private readonly WOOLWORTHS_LINK_AUS: Locator;
  private readonly ELIGIBILITY_LINK_AUS: Locator;
  private readonly AUSTRALIA_FLAG_BUTTON_AUS: Locator;
  private readonly START_SAVING_LINK_AUS: Locator;
  private readonly EXCLUSIVE_SAVINGS_HEADING_AUS: Locator;
  private readonly SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS: Locator;

  // Search options
  private readonly SEARCH_BUTTON_AUS: Locator;
  private readonly SEARCH_OPTION_COMPANY_AUS: Locator;
  private readonly SEARCH_OPTION_CATEGORY_AUS: Locator;
  private readonly SEARCH_OPTION_SEARCHTERM_AUS: Locator;
  private readonly SEARCH_NOW_BUTTON_AUS: Locator;

  // Code Redemption options
  private readonly CLICK_HERE_TO_SEE_DISCOUNT_AUS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;

    // Initialize locators

    //Navbar - logged in
    this.MYACCOUNT_NAVBAR_AUS = page.getByRole('link', { name: 'My Account' });
    this.LOGOUT_NAVBAR_AUS = page.getByRole('link', { name: 'Logout' });
    this.HOME_NAVBAR_AUS = page.getByRole('link', { name: 'Home', exact: true });

        //Footer Locators

        this.ONLINE_DISCOUNTS = page.getByRole('link', { name: 'Online Discounts' });
        this.GIFT_CARD_DISCOUNTS = page.getByRole('link', { name: 'Giftcard Discounts' });
        this.IN_STORE_OFFERS = page.getByRole('link', { name: 'In-Store Offers' });
        this.POPULAR_DISCOUNTS = page.getByRole('link', { name: 'Popular Discounts' });
        this.OFFERS_NEAR_YOU = page.getByRole('link', { name: 'Offers Near You' });
        this.DEALS_OF_THE_WEEK = page.getByRole('link', { name: 'Deals of the Week' });
        this.MOBILE_APP = page.getByRole('link', { name: 'Mobile App' });
        this.CONTACT_US = page.getByRole('link', { name: 'Contact us' });
        this.SITEMAP = page.getByRole('link', { name: 'Sitemap' });
        this.LOCAL_BUSINESSES = page.getByRole('link', { name: 'Local businesses' });
        this.FAQS = page.getByRole('link', { name: 'FAQs' });
       this.TERMS_AND_CONDITIONS = page.getByRole('link', { name: 'Terms and Conditions' });
       this.PRIVACY_NOTICE = page.getByRole('link', { name: 'Privacy Notice' });
       this.CANDIDATE_PRIVACY_NOTICE = page.getByRole('link', { name: 'Candidate Privacy Notice' });
       this.COOKIES_POLICY = page.getByRole('link', { name: 'Cookies Policy' });
       this.MANAGE_COOKIES = page.getByRole('link', { name: 'Manage Cookies' });
       this.MODERN_SLAVERY_ACT = page.getByRole('link', { name: 'Modern Slavery Act Statement' });

    //Personal Infomation
    this.MOBILE_FIELD_AUS = page.getByPlaceholder('Mobile Number');
    this.UPDATE_BUTTON_AUS = page.getByRole('button', { name: 'Update details' });

    // Searchbar options
    this.MAGNIFIER_SEARCHBAR_AUS = page.locator('.search-trigger');

   
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

    // Search options
    this.SEARCH_BUTTON_AUS = page.locator('.search-trigger');
    this.SEARCH_OPTION_COMPANY_AUS = page.locator('//button[@title="by company"]');
    this.SEARCH_OPTION_CATEGORY_AUS = page.locator('//button[@title="or by category"]');
    this.SEARCH_OPTION_SEARCHTERM_AUS = page.getByRole('textbox');
    this.SEARCH_NOW_BUTTON_AUS = page.getByRole('button', { name: 'Search now' });
    this.CLICK_HERE_TO_SEE_DISCOUNT_AUS = page.getByText('Click here to see discount');
  }

  // Methods for common actions
  async acceptCookies(): Promise<void> {
    await this.ACCEPTCOOKIES_BUTTON_AUS.click();
  }



  async navigateToUrlAus(): Promise<void> {
    await this.page.goto(process.env.MEMBERS_HOME_URL_AUS, { waitUntil: 'load' });
  }


  // Methods for verifying elements


  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.HOME_NAVBAR_AUS).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_AUS).toBeVisible();
    await expect(this.SEARCH_BY_COMPANY_OR_PHRASE_TEXT_AUS).toBeVisible();
    await expect(this.MAGNIFIER_SEARCHBAR_AUS).toBeVisible();
  }

  // Search option methods
  async searchForCompanyCategoryOrPhrase(searchOption: string, searchTerm: string): Promise<void> {
    await this.SEARCH_BUTTON_AUS.click();
    switch (searchOption.toLowerCase()) {
      case 'company':
        await this.SEARCH_OPTION_COMPANY_AUS.click();
        await this.page
          .locator(`ul.dropdown-menu.inner.selectpicker li a span.text:has-text("${searchTerm}")`)
          .click();

        break;

      case 'category':
        await this.SEARCH_OPTION_CATEGORY_AUS.click();
        await this.page
          .locator(`ul.dropdown-menu.inner.selectpicker li a span.text:has-text("${searchTerm}")`)
          .click();

        break;

      case 'phrase':
        await this.SEARCH_OPTION_SEARCHTERM_AUS.fill(searchTerm);
        await this.SEARCH_NOW_BUTTON_AUS.click();

        break;

      default:
        throw new Error(
          `Unknown search option: ${searchOption} - options are "Company, Category and Phrase"`,
        );
    }
    await this.page.waitForLoadState('load');

    //Check the heading is correct
    await expect(
      this.page.getByRole('heading', { name: searchTerm, exact: true }).first(),
    ).toBeVisible();
  }

  async clickToSeeTheDiscount(newPageUrl: string): Promise<void> {
    await this.CLICK_HERE_TO_SEE_DISCOUNT_AUS.click();
    await this.page.waitForURL(newPageUrl, { waitUntil: 'load' });
    expect(this.page.url()).toContain(newPageUrl);
  }
  async clickOnlineDiscounts(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.ONLINE_DISCOUNTS.click();
}

async clickGiftCardDiscounts(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.GIFT_CARD_DISCOUNTS.click();
}

async clickInStoreOffers(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.IN_STORE_OFFERS.click();
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

async clickMobileApp(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.MOBILE_APP.click();
}

async clickContactUs(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.CONTACT_US.click();
}

async clickSitemap(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.SITEMAP.click();
}

async clickLocalBusinesses(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.LOCAL_BUSINESSES.click();
}

async clickFAQs(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.FAQS.click();
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

async clickModernSlaveryAct(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.MODERN_SLAVERY_ACT.click();
}




  
}
