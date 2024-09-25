import { TestInfo, test as baseTest } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
import { HomePageUk } from 'pageFactory/HomePageUk';
import { RegistrationPageUk } from 'pageFactory/RegistrationUk/RegistrationPageUk';
import { AboutYouPageUk } from 'pageFactory/RegistrationUk/AboutYouPageUk';
import { AboutYourRolePageUk } from 'pageFactory/RegistrationUk/AboutYourRolePageUk';
import { HomePageDds } from 'pageFactory/HomePageDds';
import { HomePageAus } from 'pageFactory/HomePageAus';
import { MyAccountPageAus } from 'pageFactory/MyAccountPageAus';
import { OnlineDiscountsPageUk } from 'pageFactory/OnlineDiscountsPageUk';
import { MyAccountPageUk } from '@pages/MyAccountPageUk';

const test = baseTest.extend<{
  webActions: WebActions;
  testInfo: TestInfo;
  homePageUk: HomePageUk;
  aboutYouPageUk: AboutYouPageUk;
  aboutYourRolePageUk: AboutYourRolePageUk;
  registrationPageUk: RegistrationPageUk;
  onlineDiscountPageUk: OnlineDiscountsPageUk;
  homePageDds: HomePageDds;
  homePageAus: HomePageAus;
  myAccountPageAus: MyAccountPageAus;
  myAccountPageUk: MyAccountPageUk;
}>({
  webActions: async ({ page, context }, use) => {
    await use(new WebActions(page, context));
  },
  homePageUk: async ({ page, context }, use) => {
    await use(new HomePageUk(page, context));
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
  homePageDds: async ({ page, context }, use) => {
    await use(new HomePageDds(page, context));
  },
  homePageAus: async ({ page, context }, use) => {
    await use(new HomePageAus(page, context));
  },
  myAccountPageAus: async ({ page, context }, use) => {
    await use(new MyAccountPageAus(page, context));
  },
  myAccountPageUk: async ({ page, context }, use) => {
    await use(new MyAccountPageUk(page, context));
  },
});

export default test;
