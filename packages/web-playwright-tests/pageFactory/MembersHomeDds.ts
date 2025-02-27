import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

let webActions: WebActions;

export class MembersHomeDds {
  readonly page: Page;
  readonly context: BrowserContext;

  // Navbar logged in
  private readonly DDSLOGOBUTTON_NAVBAR_DDS: Locator;
  private readonly LOGOUT_NAVBAR_DDS: Locator;
  private readonly SEARCH_TEXT_DDS: Locator;
  private readonly MYACCOUNT_NAVBAR_DDS: Locator;

  //Personal Infomation
  private readonly MOBILE_FIELD_DDS: Locator;
  private readonly UPDATE_BUTTON_DDS: Locator;

   //Footer locators

  private readonly DDS_CHARITY: Locator;
  private readonly VETERANS_GATEWAY: Locator;
  private readonly DDS_IN_THE_PRESS: Locator;
  private readonly DDS_NEWS: Locator;
  private readonly ARMED_FORCES_COVENANT: Locator;

  private readonly LEGAL_AND_REGULATORY: Locator;
  private readonly TERMS_AND_CONDITIONS: Locator;
  private readonly PRIVACY_NOTICE: Locator;
  private readonly COOKIES_POLICY: Locator;
  private readonly MANAGE_COOKIES: Locator;
  private readonly MODERN_SLAVERY_ACT_STATEMENT: Locator;

  private readonly ADD_A_DISCOUNT: Locator;
  private readonly MOBILE_APP: Locator;
  private readonly COMPETITIONS: Locator;
  private readonly COMPLIANCE: Locator;
  private readonly SITEMAP: Locator;
  private readonly TICKETS: Locator;



  // Search options
  private readonly SEARCH_BUTTON_DDS: Locator;
  private readonly SEARCH_OPTION_COMPANY_DDS: Locator;
  private readonly SEARCH_OPTION_CATEGORY_DDS: Locator;
  private readonly SEARCH_OPTION_SEARCHTERM_DDS: Locator;
  private readonly SEARCH_OPTION_DROPDOWN_DDS: Locator;
  private readonly SEARCH_NOW_BUTTON_DDS: Locator;

  private readonly SEARCH_DROPDOWN_SELECTOR_DDS: Locator;

  //Code Redemption
  private readonly CLICK_HERE_TO_SEE_CODE_DDS: Locator;
  private readonly GO_TO_OFFER: Locator;

  // Additional locators for assertions
  private readonly DEALS_OF_THE_WEEK_HEADING_DDS: Locator;

  // Cookie handling
  private readonly ACCEPT_COOKIES_BUTTON_DDS: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);



    //Navbar - logged in
    this.MYACCOUNT_NAVBAR_DDS = page.getByRole('link', { name: 'My Account' });
    this.DDSLOGOBUTTON_NAVBAR_DDS = page.locator('div.site-logo');
    this.LOGOUT_NAVBAR_DDS = page.getByRole('link', { name: 'Logout' });
    this.SEARCH_TEXT_DDS = page.getByText('Search by company or phrase');

    //Personal Infomation
    this.MOBILE_FIELD_DDS = page.getByPlaceholder('Mobile Number');
    this.UPDATE_BUTTON_DDS = page.locator("button[id='detailsbutton']");

        //Footer Locators

        this.DDS_CHARITY = page.getByRole('link', { name: 'DDS Charity' });
        this.VETERANS_GATEWAY = page.getByRole('link', { name: 'Veterans Gateway' });
        this.DDS_IN_THE_PRESS = page.getByRole('link', { name: 'DDS in the Press' });
        this.DDS_NEWS = page.getByRole('link', { name: 'DDS News' });
        this.ARMED_FORCES_COVENANT = page.getByRole('link', { name: 'Armed Forces Covenant' });
    
        this.LEGAL_AND_REGULATORY = page.getByRole('link', { name: 'Legal and Regulatory' });
        this.TERMS_AND_CONDITIONS = page.getByRole('link', { name: 'Terms and Conditions' });
        this.PRIVACY_NOTICE = page.getByRole('link', { name: 'Privacy Notice' });
        this.COOKIES_POLICY = page.getByRole('link', { name: 'Cookies Policy' });
        this.MANAGE_COOKIES = page.locator('a').filter({ hasText: 'Manage Cookies' }); 
        this.MODERN_SLAVERY_ACT_STATEMENT = page.getByRole('link', { name: 'Modern Slavery Act Statement' });
    
        this.ADD_A_DISCOUNT = page.getByRole('link', { name: 'Add a Discount' });
        this.MOBILE_APP = page.getByRole('link', { name: 'Mobile App' });
        this.COMPETITIONS = page.getByRole('link', { name: 'Competitions' });
        this.COMPLIANCE = page.getByRole('link', { name: 'Compliance' });
        this.SITEMAP = page.getByRole('link', { name: 'Sitemap' });
        this.TICKETS = page.getByRole('link', { name: 'Tickets' });

    // Additional locators for assertions
    this.DEALS_OF_THE_WEEK_HEADING_DDS = page.getByRole('heading', { name: 'Deals of the Week' });

    //Search options
    this.SEARCH_BUTTON_DDS = page.getByRole('link', { name: '' });
    this.SEARCH_OPTION_COMPANY_DDS = page.getByRole('button', { name: 'by company' });
    this.SEARCH_OPTION_CATEGORY_DDS = page.getByRole('button', { name: 'or by category' });
    this.SEARCH_OPTION_SEARCHTERM_DDS = page.getByLabel('or By Phrase');
    this.SEARCH_OPTION_DROPDOWN_DDS = page.locator('select[aria-label="drop-down selector"]');
    this.SEARCH_NOW_BUTTON_DDS = page.getByRole('button', { name: 'Search now' });

    // Search options
    this.GO_TO_OFFER = page
      .locator('li')
      .filter({ hasText: 'British Airways Online offer' })
      .getByRole('link')
      .nth(1);
    this.CLICK_HERE_TO_SEE_CODE_DDS = page.getByText('Copy Discount Code');
    //this.VISIT_WEBSITE = page.getByRole('link', { name: 'Visit Sonos now' });

    // Cookie handling
    this.ACCEPT_COOKIES_BUTTON_DDS = page.getByRole('button', { name: 'Agree to all' });
  }

  // Navigation methods
  async navigateToUrlDds(): Promise<void> {
    await this.page.goto(process.env.MEMBERS_HOME_URL_DDS, { waitUntil: 'load' });
  }



  
  // Element assertions
  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.DDSLOGOBUTTON_NAVBAR_DDS).toBeVisible();
    await expect(this.LOGOUT_NAVBAR_DDS).toBeVisible();
    await expect(this.SEARCH_TEXT_DDS).toBeVisible();
  }

  // Search option methods
  async searchForCompanyCategoryOrPhrase(searchOption: string, searchTerm: string): Promise<void> {
    await this.SEARCH_BUTTON_DDS.click();
    switch (searchOption.toLowerCase()) {
      case 'company':
        await this.SEARCH_OPTION_COMPANY_DDS.click();
        await this.page
          .getByRole('menu')
          .locator('a')
          .filter({ hasText: 'British Airways' })
          .click(),
          {
            label: searchTerm,
          };

        break;

      case 'category':
        await this.SEARCH_OPTION_CATEGORY_DDS.click();
        await this.page.selectOption('select[aria-label="drop-down selector"]', {
          label: searchTerm,
        });

        break;
      case 'phrase':
        await this.SEARCH_OPTION_SEARCHTERM_DDS.click();
        await this.SEARCH_OPTION_SEARCHTERM_DDS.fill(searchTerm);
        await this.SEARCH_NOW_BUTTON_DDS.click();
        await this.GO_TO_OFFER.click();

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

  //Redeeming code
  async clickToSeeTheDiscount(expectedDiscountCode: string, newPageUrl: string): Promise<void> {
    const page1Promise = this.page.waitForEvent('popup');
    await this.CLICK_HERE_TO_SEE_CODE_DDS.click();
    const page1 = await page1Promise;

    const offerPage = await page1;
    await offerPage.waitForLoadState('load');
    expect(offerPage.url()).toContain(newPageUrl);


  }

  async clickDDSCharityAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.DDS_CHARITY.click();
  }
  
  async clickVeteransGatewayAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.VETERANS_GATEWAY.click();
  }
  
  async clickDDSInThePressAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.DDS_IN_THE_PRESS.click();
  }
  
  async clickDDSNewsAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.DDS_NEWS.click();
  }
  
  async clickArmedForcesCovenantAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.ARMED_FORCES_COVENANT.click();
  }
  
  async clickLegalAndRegulatoryAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.LEGAL_AND_REGULATORY.click();
  }
  
  async clickTermsAndConditionsAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.TERMS_AND_CONDITIONS.click();
  }
  
  async clickPrivacyNoticeAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.PRIVACY_NOTICE.click();
  }
  
  async clickCookiesPolicyAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.COOKIES_POLICY.click();
  }
  
  async clickManageCookiesAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.MANAGE_COOKIES.click();
  }
  
  async clickModernSlaveryActStatementAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.MODERN_SLAVERY_ACT_STATEMENT.click();
  }
  
  async clickAddADiscountAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.ADD_A_DISCOUNT.click();
  }
  
  async clickMobileAppAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.MOBILE_APP.click();
  }
  
  async clickCompetitionsAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.COMPETITIONS.click();
  }
  
  async clickComplianceAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.COMPLIANCE.click();
  }
  
  async clickSitemapAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.SITEMAP.click();
  }
  
  async clickTicketsAndVerify(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.TICKETS.click();
  }



  };
