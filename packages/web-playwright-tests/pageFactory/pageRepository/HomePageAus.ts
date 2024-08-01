import { Page, BrowserContext, Locator, expect } from "@playwright/test";
import { WebActions } from "@lib/WebActions";

let webActions: WebActions;

export class HomePageAus {
  readonly page: Page;
  readonly context: BrowserContext;

  // Navbar top
  readonly BLUELIGHTBUTTON_NAVBAR: Locator;
  readonly HOME_NAVBAR: Locator;
  readonly OFFERS_NAVBAR: Locator;
  readonly MYCARD_NAVBAR: Locator;
  readonly MYACCOUNT_NAVBAR: Locator;
  readonly FAQS_NAVBAR: Locator;
  readonly SIGNUP_NAVBAR: Locator;
  readonly LOGIN_NAVBAR: Locator;
  readonly LOGOUT_NAVBAR: Locator;

  // Searchbar options
  readonly MAGNIFIER_SEARCHBAR: Locator;
  readonly CATEGORYOPTION_SEARCHBAR: Locator;
  readonly PHRASE_SEARCHBAR: Locator;
  readonly SEARCHNOW_BUTTON_SEARCHBAR: Locator;

  // Login options - Login screen
  readonly LOGIN_BUTTON: Locator;
  readonly LOGIN_TEXT: Locator;
  readonly EMAIL_TEXTFIELD: Locator;
  readonly PASSWORD_TEXTFIELD: Locator;
  readonly SUBMIT_BUTTON: Locator;

  // Cookies popup
  readonly ACCEPTCOOKIES_BUTTON: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Navbar top
    this.BLUELIGHTBUTTON_NAVBAR = page.getByRole("link", {
      name: "Blue Light Card logo",
    });

    //data-testid="brandLogo"

    this.HOME_NAVBAR = page.getByRole("link", { name: "Home" });
    this.OFFERS_NAVBAR = page.getByRole("link", { name: "Offers" });
    this.MYCARD_NAVBAR = page.getByRole("link", { name: "My Card" });
    this.MYACCOUNT_NAVBAR = page.getByRole("link", { name: "My Account" });
    this.FAQS_NAVBAR = page.getByRole("link", { name: "FAQs" });
    this.SIGNUP_NAVBAR = page.getByRole("link", { name: "Sign up" });
    this.LOGIN_NAVBAR = page.getByLabel("Login");
    this.LOGOUT_NAVBAR = page.getByRole("link", { name: "Logout" });

    // Searchbar options
    this.MAGNIFIER_SEARCHBAR = this.page.locator(".search-trigger");
    this.CATEGORYOPTION_SEARCHBAR = this.page.getByRole("button", {
      name: "or by category",
    });
    this.PHRASE_SEARCHBAR = page.getByLabel("or By Phrase");
    this.SEARCHNOW_BUTTON_SEARCHBAR = page.getByRole("button", {
      name: "Search now",
    });

    // Login options - Login screen
    this.LOGIN_BUTTON = page.getByRole("link", { name: "Login" }).nth(1);
    this.LOGIN_TEXT = page.getByText("Sign in with your email and").nth(1);
    this.EMAIL_TEXTFIELD = page.getByRole("textbox", { name: "name@host.com" });
    this.PASSWORD_TEXTFIELD = page.getByRole("textbox", { name: "Password" });
    this.SUBMIT_BUTTON = page.getByRole("button", { name: "submit" });

    // Cookies popup
    this.ACCEPTCOOKIES_BUTTON = page.getByRole("button", {
      name: "Agree to all",
    });

    let url = process.env.EMAIL_AUS;
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
    await webActions.navigateToURL(process.env.BASE_URL_AUS);
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
    await expect(
      this.page.getByRole("link", { name: "Woolworths" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Eligibility" })
    ).toBeVisible();
    await expect(this.OFFERS_NAVBAR).toBeVisible();
    await expect(this.FAQS_NAVBAR).toBeVisible();
    await expect(this.LOGIN_NAVBAR).toBeVisible();
    await expect(this.SIGNUP_NAVBAR).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "australia flag Australia" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Start Saving" })
    ).toBeVisible();
    await expect(this.LOGIN_BUTTON).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Exclusive savings for" })
    ).toBeVisible();
  }

  async assertElementsVisibleHomeScreenLoggedIn(): Promise<void> {
    await expect(this.BLUELIGHTBUTTON_NAVBAR).toBeVisible();
    await expect(this.HOME_NAVBAR).toBeVisible();
    await expect(this.OFFERS_NAVBAR).toBeVisible();
    await expect(this.MYCARD_NAVBAR).toBeVisible();
    await expect(this.MYACCOUNT_NAVBAR).toBeVisible();
    await expect(this.FAQS_NAVBAR).toBeVisible();
    await expect(this.LOGOUT_NAVBAR).toBeVisible();
    await expect(
      this.page.getByText("Search by company or phrase")
    ).toBeVisible();
    await expect(this.MAGNIFIER_SEARCHBAR).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: "Deals of the Week" })
    ).toBeVisible();
  }

  // Top menu actions
  async verifyLoginScreenAppears(): Promise<void> {
    await expect(this.LOGIN_BUTTON).toBeVisible();
  }

  async selectOptionFromTopMenu(option: string): Promise<void> {
    await this.page.getByRole("link", { name: option }).click();
  }

  async selectOptionFromOffersMenu(option: string): Promise<void> {
    await this.OFFERS_NAVBAR.hover();
    await this.page.getByRole("link", { name: option }).click();
  }

  // Footer actions
  async selectOptionFromFooterMenu(option: string): Promise<void> {
    await this.page.getByRole("link", { name: option, exact: true }).click();
  }

  async selectPrivacyNotice(): Promise<void> {
    await this.page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Privacy Notice", exact: true })
      .click();
  }

  // Search options
  async clickSearchOption(): Promise<void> {
    await this.MAGNIFIER_SEARCHBAR.click();
  }

  async clickCategoryOption(): Promise<void> {
    await this.CATEGORYOPTION_SEARCHBAR.click();
  }

  async selectOptionFromCategoryMenu(option: string): Promise<void> {
    await this.page.locator("a").filter({ hasText: option }).click();
  }

  async enterSearchPhraseAndSearch(phrase: string): Promise<void> {
    await this.PHRASE_SEARCHBAR.fill(phrase);
    await this.SEARCHNOW_BUTTON_SEARCHBAR.click();
  }

  async checkSearchedForHeadingIsCorrect(option: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: option })
    ).toBeVisible();
  }

  async checkSearchedPhraseHeadingIsCorrect(phrase: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: `Search results for: ${phrase}` })
    ).toBeVisible();
  }

  // Main on-screen buttons
  async clickStartSavingButton(): Promise<void> {
    await this.page.getByRole("link", { name: "Start Saving" }).click();
  }

  async assertElementsVisibleCreateAccountScreen(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: "Create Account" })
    ).toBeVisible();
    await expect(this.page.getByText("Step 1 of")).toBeVisible();
  }

  // Flexi menu actions
  async clickFlexiMenu(): Promise<void> {
    await this.page.getByRole("link", { name: "Spooky savings " }).click();
  }

  async clickPartnerWithUsButton(): Promise<void> {
    await this.page.getByRole("link", { name: "Partner with us" }).click();
  }

  async clickGetInTouchWithUsButton(): Promise<void> {
    await this.page.getByRole("link", { name: "Get in touch" }).click();
  }

  async clickChangeCountryButtonAndSelectUk(): Promise<void> {
    await this.page
      .getByRole("button", { name: "australia flag Australia" })
      .click();
    await this.page
      .getByRole("link", { name: "United Kingdom flag United" })
      .click();
  }
}
