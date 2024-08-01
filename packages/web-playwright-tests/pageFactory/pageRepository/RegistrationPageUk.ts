import { Page, BrowserContext, Locator } from "@playwright/test";
import { WebActions } from "@lib/WebActions";
const User = require("utils/functional/dataModels/dataModelsUk");

let webActions: WebActions;

export class RegistrationPageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  readonly agreeToAllButton: Locator;
  readonly registerLink: Locator;
  readonly serviceSelect: Locator;
  readonly startButton: Locator;
  readonly trustMemberSection: Locator;
  readonly airAmbulanceOption: Locator;
  readonly jobTitleInput: Locator;
  readonly continueButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly genderDropdown: Locator;
  readonly maleOption: Locator;
  readonly mobileNumberInput: Locator;
  readonly dayInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly addressLine1Input: Locator;
  readonly cityInput: Locator;
  readonly countyDropdown: Locator;
  readonly cityOfLondonOption: Locator;
  readonly postCodeInput: Locator;
  readonly emailInput: Locator;
  readonly confirmEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly registerButton: Locator;
  readonly notRightNowButton: Locator;
  readonly noButton: Locator;
  readonly cantUploadIDButton: Locator;
  readonly proceedWithoutIDLink: Locator;
  readonly yesButton: Locator;
  readonly havingProblemsButton: Locator;
  readonly proceedWithoutPaymentLink: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    this.agreeToAllButton = page.getByRole("button", { name: "Agree to all" });
    this.registerLink = page.getByRole("link", {
      name: "Register",
      exact: true,
    });
    this.serviceSelect = page.locator("#primary");
    this.startButton = page.getByRole("button", { name: "Start" });
    this.trustMemberSection = page.locator("#trustMemberSection > div");
    this.airAmbulanceOption = page.getByText("Air Ambulance");
    this.jobTitleInput = page.locator("#position");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.firstNameInput = page.getByLabel("First name");
    this.lastNameInput = page.getByLabel("Last name");
    this.genderDropdown = page
      .locator("div")
      .filter({ hasText: /^Select your gender$/ })
      .nth(1);
    this.maleOption = page.getByText("Male", { exact: true });
    this.mobileNumberInput = page.locator("#phone");
    this.dayInput = page.getByLabel("Day");
    this.monthInput = page.getByLabel("Month");
    this.yearInput = page.getByLabel("Year");
    this.addressLine1Input = page.getByLabel("Address line 1 For example,");
    this.cityInput = page.getByLabel("Town / City");
    this.countyDropdown = page.locator("#countySection");
    this.cityOfLondonOption = page.getByText("City of London");
    this.postCodeInput = page.getByLabel("Postcode");
    this.emailInput = page.getByPlaceholder("Personal Email");
    this.confirmEmailInput = page.getByLabel("Confirm email address");
    this.passwordInput = page.locator("#password");
    this.confirmPasswordInput = page.locator("#password2");
    this.termsCheckbox = page.locator("#termsCheck").getByRole("img");

    this.registerButton = page.locator("#submitButton");

    this.notRightNowButton = page.getByRole("button", {
      name: "Not right now",
    });
    this.noButton = page.getByRole("button", { name: "No" });
    this.cantUploadIDButton = page.getByRole("button", {
      name: "Can't upload ID right now?",
    });
    this.proceedWithoutIDLink = page.getByRole("link", {
      name: "Proceed without uploading ID",
    });
    this.yesButton = page.getByRole("button", { name: "Yes" });
    this.havingProblemsButton = page.getByRole("button", {
      name: "Having problems with payment?",
    });
    this.proceedWithoutPaymentLink = page.getByRole("link", {
      name: "Proceed, without payment",
    });
  }

  async goToHomePage() {
    await this.page.goto("https://www.staging.bluelightcard.co.uk/index.php");
  }

  async agreeToAllCookies() {
    await this.agreeToAllButton.click();
  }

  async navigateToRegister() {
    await this.registerLink.click();
  }

  async selectService(serviceValue: string) {
    await this.serviceSelect.selectOption(serviceValue);
  }

  async clickStart() {
    await this.startButton.click();
  }

  async selectTrustMember(trustValue: string) {
    await this.serviceSelect.selectOption(trustValue);
  }

  async enterJobTitle(jobTitle: string) {
    await this.jobTitleInput.fill(jobTitle);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async fillPersonalDetails(
    firstName: string,
    lastName: string,
    mobileNumber: string,
    dob: { day: string; month: string; year: string }
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    //TODO - Add Gender? optional so leave for now
    await this.mobileNumberInput.fill(mobileNumber);
    await this.dayInput.fill(dob.day);
    await this.monthInput.fill(dob.month);
    await this.yearInput.fill(dob.year);
  }

  async selectCounty(page: Page, countyName: string): Promise<void> {
    // Locate the dropdown container
    const dropdownSelector =
      "#countySection > div > div.selectize-input.items.has-options.full.has-items";

    // Click on the dropdown to open it
    await page.click(dropdownSelector);

    // Wait for the dropdown options to be visible
    await page.waitForSelector(".selectize-dropdown-content", {
      state: "visible",
    });

    // Find the option that matches the countyName and click it
    const optionSelector = `.selectize-dropdown-content .option:has-text("${countyName}")`;
    await page.click(optionSelector);
  }

  async fillAddressDetails(address: {
    line1: string;
    city: string;
    county: string;
    postCode: string;
  }) {
    await this.addressLine1Input.fill(address.line1);
    await this.cityInput.fill(address.city);

    // Select the option by value
    await this.page.locator("#countySection div").nth(1).click();
    await this.page.getByText(address.county).click();
    await this.postCodeInput.fill(address.postCode);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
    await this.confirmEmailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill("Letmein10!");
    await this.confirmPasswordInput.fill("Letmein10!");
  }

  async agreeToTerms() {
    await this.termsCheckbox.click();
  }

  async proceedWithoutUploadingID() {
    //TODO - Wait for the below to be enabled
    await this.registerButton.click();

    await this.notRightNowButton.click();
    await this.noButton.click();
    await this.cantUploadIDButton.click();
    await this.proceedWithoutIDLink.click();
  }

  async proceedWithoutPayment() {
    await this.yesButton.click();
    await this.havingProblemsButton.click();
    await this.proceedWithoutPaymentLink.click();
  }

  //TODO - move the below to util class
  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async registerNewUserWithoutIdOrPayment(user) {
    await this.goToHomePage();
    await this.agreeToAllCookies();
    await this.navigateToRegister();
    await this.selectService("3");
    await this.clickStart();

    //TODO - get the below to select by text
    await this.page.locator("#trustMemberSection div").nth(1).click();
    await this.page.getByText("Air Ambulance").click();
    await this.enterJobTitle("Manager");
    await this.clickContinue();
    await this.sleep(2000); // Sleep for 2 seconds

    //this far
    await this.fillPersonalDetails(
      user.firstName,
      user.lastName,
      user.mobileNumber,
      user.birthDate
    );
    await this.fillAddressDetails(user.address);

    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.agreeToTerms();

    await this.page.waitForLoadState("networkidle");
    await this.proceedWithoutUploadingID();

    //Pause here for page load
    await this.page.waitForLoadState("networkidle");
    await this.proceedWithoutPayment();
  }
}
