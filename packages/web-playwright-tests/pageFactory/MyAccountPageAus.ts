import { Page, BrowserContext, Locator } from "@playwright/test";
import { WebActions } from "@lib/WebActions";

let webActions: WebActions;

export class MyAccountPageAus {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
  //Navbar top
  readonly BLUELIGHT_NAVBAR: Locator;
  readonly HOME_NAVBAR: Locator;
  readonly OFFERS_NAVBAR: Locator;
  readonly MYCARD_NAVBAR: Locator;
  readonly MYACCOUNT_NAVBAR: Locator;
  readonly FAQS_NAVBAR: Locator;
  readonly SIGNUP_NAVBAR: Locator;
  readonly LOGIN_NAVBAR: Locator;
  readonly LOGOUT_NAVBAR: Locator;

  //Searchbar options
  readonly MAGNIFIER_SEARCHBAR: Locator;
  readonly CATEGORYOPTION_SEARCHBAR: Locator;

  //Login options - Login screen
  readonly LOGIN_BUTTON: Locator;
  readonly LOGIN_TEXT: Locator;
  readonly EMAIL_TEXTFIELD: Locator;
  readonly PASSWORD_TEXTFIELD: Locator;
  readonly SUBMIT_BUTTON: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Initialize locators
    //Navbar top

    this.BLUELIGHT_NAVBAR = page.getByRole("link", {
      name: "Blue Light Card logo",
    });

    this.HOME_NAVBAR = page.getByRole("link", { name: "Home" });
    this.OFFERS_NAVBAR = page.getByRole("link", { name: "Offers" });
    this.MYCARD_NAVBAR = page.getByRole("link", { name: "My Card" });
    this.MYACCOUNT_NAVBAR = page.getByRole("link", { name: "My Account" });
    this.FAQS_NAVBAR = page.getByRole("link", { name: "FAQs" });
    this.LOGOUT_NAVBAR = page.getByRole("link", { name: "Logout" });
    this.SIGNUP_NAVBAR = page.getByRole("link", { name: "Sign up" });
    this.LOGIN_NAVBAR = page.getByLabel("Login");

    //Searchbar options
    this.MAGNIFIER_SEARCHBAR = this.page.locator(".search-trigger");
    this.CATEGORYOPTION_SEARCHBAR = this.page.getByRole("button", {
      name: "or by category",
    });

    //Login options - Login screen
    this.LOGIN_BUTTON = page.getByRole("link", { name: "Login" }).nth(1);
    this.LOGIN_TEXT = page.getByText("Sign in with your email and").nth(1);
    this.EMAIL_TEXTFIELD = page.getByRole("textbox", { name: "name@host.com" });
    this.PASSWORD_TEXTFIELD = page.getByRole("textbox", { name: "Password" });
    this.SUBMIT_BUTTON = page.getByRole("button", { name: "submit" });
  }
}
