import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
import { AboutYourRolePageUk } from './AboutYourRolePageUk';
import { AboutYouPageUk } from './AboutYouPageUk';

let webActions: WebActions;

export class RegistrationPageUk {
  readonly page: Page;
  readonly context: BrowserContext;
  private aboutYourRolePageUk: AboutYourRolePageUk;
  private aboutYouPageUk: AboutYouPageUk;

  // Locators
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

    // Initialize the page objects with both page and context
    this.aboutYourRolePageUk = new AboutYourRolePageUk(this.page, this.context);
    this.aboutYouPageUk = new AboutYouPageUk(this.page, this.context);

    // Initialize locators
    this.agreeToAllButton = page.getByRole('button', { name: 'Agree to all' });
    this.registerLink = page.getByRole('link', { name: 'Register', exact: true });
    this.serviceSelect = page.locator('#primary');
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.trustMemberSection = page.locator('#trustMemberSection > div');
    this.airAmbulanceOption = page.getByText('Air Ambulance');
    this.jobTitleInput = page.locator('#position');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
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
    this.notRightNowButton = page.getByRole('button', { name: 'Not right now' });
    this.noButton = page.getByRole('button', { name: 'No' });
    this.cantUploadIDButton = page.getByRole('button', { name: "Can't upload ID right now?" });
    this.proceedWithoutIDLink = page.getByRole('link', { name: 'Proceed without uploading ID' });
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.havingProblemsButton = page.getByRole('button', { name: 'Having problems with payment?' });
    this.proceedWithoutPaymentLink = page.getByRole('link', { name: 'Proceed, without payment' });
  }

  // Navigation and Interaction Methods

  async goToHomePage() {
    await webActions.navigateToURL(process.env.BASE_URL_UK);
  }

  async agreeToAllCookies() {
    await this.agreeToAllButton.click();
  }

  async navigateToRegister() {
    await this.registerLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectService(serviceName: string) {
    await this.page.selectOption('#primary', { label: serviceName });
  }

  async clickStart() {
    await this.startButton.click();
  }

  async registerNewUserWithoutIdOrPayment(user) {
    await this.goToHomePage();
    await this.agreeToAllCookies();
    await this.navigateToRegister();
    await this.selectService(user.service);
    await this.clickStart();

    await this.aboutYourRolePageUk.selectTrustOrDivision(user);
    await this.aboutYourRolePageUk.enterJobTitle(user.jobTitleOrPosition);
    await this.aboutYourRolePageUk.clickContinue();

    await this.aboutYouPageUk.fillPersonalDetails(user);
    await this.aboutYouPageUk.fillAddressDetails(user.address);
    await this.aboutYouPageUk.fillEmail(user.email);
    await this.aboutYouPageUk.fillPassword(user.password);
    await this.aboutYouPageUk.agreeToTerms();
    await this.aboutYouPageUk.proceedWithoutUploadingID();
    await this.aboutYouPageUk.proceedWithoutPayment();
    await this.aboutYouPageUk.checkAccountCreatedMessageAppears();
  }

  async navigateToRegistrationFromLink(validationLink: string) {
    await this.page.goto(validationLink);

    // Get the URL after navigating to the link
    let currentUrl = this.page.url();

    // Convert the URL if the environment is staging - if its staging then switch the url from live to staging
    if (process.env.ENVIRONMENT === 'staging') {
      currentUrl = this.page
        .url()
        .replace('www.bluelightcard.co.uk', 'www.staging.bluelightcard.co.uk');
    }

    // Reopen the converted (or original) URL
    await this.page.goto(currentUrl);
  }
}
