import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';

let webActions: WebActions;

export class AboutYouPageUk {
  readonly page: Page;
  readonly context: BrowserContext;

  // Locators
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
  readonly accountCreatedMessage: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);

    // Initialize locators
    this.firstNameInput = page.getByLabel('First name');
    this.lastNameInput = page.getByLabel('Last name');
    this.genderDropdown = page
      .locator('div')
      .filter({ hasText: /^Select your gender$/ })
      .nth(1);
    this.maleOption = page.getByText('Male', { exact: true });
    this.mobileNumberInput = page.locator('#phone');
    this.dayInput = page.getByLabel('Day');
    this.monthInput = page.getByLabel('Month');
    this.yearInput = page.getByLabel('Year');
    this.addressLine1Input = page.getByLabel('Address line 1 For example,');
    this.cityInput = page.getByLabel('Town / City');
    this.countyDropdown = page.locator('#countySection div').nth(1);
    this.cityOfLondonOption = page.getByText('City of London');
    this.postCodeInput = page.getByLabel('Postcode');
    this.emailInput = page.getByPlaceholder('Personal Email');
    this.confirmEmailInput = page.getByLabel('Confirm email address');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#password2');
    this.termsCheckbox = page.locator('#termsCheck').getByRole('img');
    this.registerButton = page.locator('#submitButton');
    this.notRightNowButton = page.getByRole('button', {
      name: 'Not right now',
    });
    this.noButton = page.getByRole('button', { name: 'No' });
    this.cantUploadIDButton = page.getByRole('button', {
      name: "Can't upload ID right now?",
    });
    this.proceedWithoutIDLink = page.getByRole('link', {
      name: 'Proceed without uploading ID',
    });
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.havingProblemsButton = page.getByRole('button', {
      name: 'Having problems with payment?',
    });
    this.proceedWithoutPaymentLink = page.getByRole('link', {
      name: 'Proceed, without payment',
    });
    this.accountCreatedMessage = page.locator('h1');
  }

  async fillPersonalDetails(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.mobileNumberInput.fill(user.mobileNumber);
    await this.dayInput.fill(user.birthDate.day);
    await this.monthInput.fill(user.birthDate.month);
    await this.yearInput.fill(user.birthDate.year);
  }

  async fillAddressDetails(address: {
    line1: string;
    city: string;
    county: string;
    postCode: string;
  }) {
    await this.addressLine1Input.fill(address.line1);
    await this.cityInput.fill(address.city);

    // Select the county
    await this.countyDropdown.click();
    await this.page.getByText(address.county).click();
    await this.postCodeInput.fill(address.postCode);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
    await this.confirmEmailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async agreeToTerms() {
    await this.termsCheckbox.click();
  }

  async proceedWithoutUploadingID() {
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

  async checkAccountCreatedMessageAppears() {
    await expect(this.accountCreatedMessage).toContainText('Your account has been created');
  }
}
