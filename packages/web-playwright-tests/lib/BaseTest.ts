import { TestInfo, test as baseTest } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
import { HomePageLoggedInUk } from 'pageFactory/HomePageLoggedInUk';
import { HomePagePreLoginUK } from 'pageFactory/HomePagePreLoginUK';
import { HomePagePreLoginAUS } from '@pages/HomePagePreLoginAUS';
import { HomePagePreLoginDDS } from '@pages/HomePagePreLoginDDS';
import { RegistrationPageUk } from 'pageFactory/RegistrationUk/RegistrationPageUk';
import { AboutYouPageUk } from 'pageFactory/RegistrationUk/AboutYouPageUk';
import { AboutYourRolePageUk } from 'pageFactory/RegistrationUk/AboutYourRolePageUk';
import { HomePageLoggedInDds } from 'pageFactory/HomePageLoggedInDds';
import { MyAccountPageAus } from 'pageFactory/MyAccountPageAus';
import { OnlineDiscountsPageUk } from 'pageFactory/OnlineDiscountsPageUk';
import { MyAccountPageUk } from '@pages/MyAccountPageUk';
import { HomePageLoggedInAus } from 'pageFactory/HomePageLoggedInAus';


const test = baseTest.extend<{
  webActions: WebActions;
  testInfo: TestInfo;
  homePageUk: HomePageLoggedInUk;
  aboutYouPageUk: AboutYouPageUk;
  aboutYourRolePageUk: AboutYourRolePageUk;
  registrationPageUk: RegistrationPageUk;
  onlineDiscountPageUk: OnlineDiscountsPageUk;
  homePageLoggedInDds: HomePageLoggedInDds;
  homePageLoggedInAus: HomePageLoggedInAus;
  myAccountPageAus: MyAccountPageAus;
  myAccountPageUk: MyAccountPageUk;
  homePagePreLoginUK: HomePagePreLoginUK;
  homePagePreLoginAUS: HomePagePreLoginAUS;
  homePagePreLoginDDS: HomePagePreLoginDDS;
}>({
  webActions: async ({ page, context }, use) => {
    await use(new WebActions(page, context));
  },
  homePageUk: async ({ page, context }, use) => {
    await use(new HomePageLoggedInUk(page, context));
  },
  registrationPageUk: async ({ page, context }, use) => {
    await use(new RegistrationPageUk(page, context));
  },
  aboutYouPageUk: async ({ page, context }, use) => {
    await use(new AboutYouPageUk(page, context));
  },
  aboutYourRolePageUk: async ({ page, context }, use) => {
    await use(new AboutYourRolePageUk(page, context));
  },
  onlineDiscountPageUk: async ({ page, context }, use) => {
    await use(new OnlineDiscountsPageUk(page, context));
  },
  homePageLoggedInDds: async ({ page, context }, use) => {
    await use(new HomePageLoggedInDds(page, context));
  },
  homePageLoggedInAus: async ({ page, context }, use) => {
    await use(new HomePageLoggedInAus(page, context));
  },
  myAccountPageAus: async ({ page, context }, use) => {
    await use(new MyAccountPageAus(page, context));
  },
  myAccountPageUk: async ({ page, context }, use) => {
    await use(new MyAccountPageUk(page, context));
  },
  homePagePreLoginUK: async ({ page, context }, use) => {
    await use(new HomePagePreLoginUK(page, context));
  },
  homePagePreLoginAUS: async ({ page, context }, use) => {
    await use(new HomePagePreLoginAUS(page, context));
  },
  homePagePreLoginDDS: async ({ page, context }, use) => {
    await use(new HomePagePreLoginDDS(page, context));
  },
});

export default test;
