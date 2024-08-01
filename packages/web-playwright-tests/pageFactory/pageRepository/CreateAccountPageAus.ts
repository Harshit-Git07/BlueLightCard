import { Page, BrowserContext, Locator } from "@playwright/test";
import { WebActions } from "@lib/WebActions";

let webActions: WebActions;

export class CreateAccountPageAus {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly ACCEPTCOOKIES_BUTTON: Locator;

  //Create Account Screen - Step 1
  readonly EMPLOYERTYPE_DROPDOWN: Locator;
  readonly EMPLOYERNAME_TEXTBOX: Locator;
  readonly JOBTITLE_TEXTBOX: Locator;
  readonly FIRSTNAME_TEXTBOX: Locator;
  readonly LASTNAME_TEXTBOX: Locator;
  readonly MOBILENUMBER_TEXTBOX: Locator;
  readonly GENDER_DROPDOWN: Locator;
  readonly DOBDAY_TEXTBOX: Locator;
  readonly DOBMONTH_TEXTBOX: Locator;
  readonly DOBYEAR_TEXTBOX: Locator;
  readonly EMAIL_TEXTBOX: Locator;
  readonly CONFIRMEMAIL_TEXTBOX: Locator;
  readonly PASSWORD_TEXTBOX: Locator;
  readonly AGREETOTERMSANDCONDITIONS_CHECKBOX: Locator;
  readonly EMAILNEWSLETTERS_CHECKBOX: Locator;
  readonly SMSMARKETING_CHECKBOX: Locator;
  readonly APPNOTIFICATIONS_CHECKBOX: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    //Accept cookies popup
    this.ACCEPTCOOKIES_BUTTON = page.getByRole("button", {
      name: "Agree to all",
    });

    //Create Account Screen - Step 1
    this.EMPLOYERTYPE_DROPDOWN = page.locator(".selectize-input").first();
    this.EMPLOYERNAME_TEXTBOX = page.getByText("Aged Care");
    this.JOBTITLE_TEXTBOX = page.locator("#trustMemberEntry");
    this.FIRSTNAME_TEXTBOX = page.locator("#position");
    this.LASTNAME_TEXTBOX = page.getByLabel("First name");
    this.MOBILENUMBER_TEXTBOX = page.locator("#lastName");
    this.GENDER_DROPDOWN = page.getByText("Female");
    this.DOBDAY_TEXTBOX = page.getByPlaceholder("DD");
    this.DOBMONTH_TEXTBOX = page.getByPlaceholder("MM");
    this.DOBYEAR_TEXTBOX = page.getByPlaceholder("YYYY");
    this.EMAIL_TEXTBOX = page.getByLabel("Email", { exact: true });
    this.CONFIRMEMAIL_TEXTBOX = page.getByLabel("Confirm email address");
    this.PASSWORD_TEXTBOX = page.getByLabel("Password");
    this.AGREETOTERMSANDCONDITIONS_CHECKBOX = page
      .locator("#termsCheck")
      .getByRole("img");
    this.EMAILNEWSLETTERS_CHECKBOX = page.getByText("Email newsletters");
    this.SMSMARKETING_CHECKBOX = page
      .locator("label")
      .filter({ hasText: "SMS marketing" })
      .getByRole("img");
    this.APPNOTIFICATIONS_CHECKBOX = page
      .locator("label")
      .filter({ hasText: "App notifications" })
      .getByRole("img");

    //Create Account Screen - Step 2

    // Address Line 1
    // Address line 2 (Optional)
    // Suburb
    // State
  }

  //TODO Reference from other class?
  async acceptCookies(): Promise<void> {
    await this.ACCEPTCOOKIES_BUTTON.click();
  }

  //To map - Step 2
  //Step 3

  //Mail client/get BLC credentials to attempt alias?
}
