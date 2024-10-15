import { TestInfo, test as baseTest } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
import { MembersHomeAus } from '@pages/MembersHomeAus';
import { MembersHomeDds } from '@pages/MembersHomeDds';
import { MembersHomeUk } from '@pages/MembersHomeUk';
import { HomePagePreLoginUK } from 'pageFactory/HomePagePreLoginUK';
import { HomePagePreLoginAUS } from '@pages/HomePagePreLoginAUS';
import { HomePagePreLoginDDS } from '@pages/HomePagePreLoginDDS';
import { RegistrationPageUk } from 'pageFactory/RegistrationUk/RegistrationPageUk';
import { AboutYouPageUk } from 'pageFactory/RegistrationUk/AboutYouPageUk';
import { AboutYourRolePageUk } from 'pageFactory/RegistrationUk/AboutYourRolePageUk';
import { MyAccountPageAus } from 'pageFactory/MyAccountPageAus';
import { OnlineDiscountsPageUk } from 'pageFactory/OnlineDiscountsPageUk';
import { MyAccountPageUk } from '@pages/MyAccountPageUk';


const test = baseTest.extend<{
  webActions: WebActions;
  testInfo: TestInfo;
  aboutYouPageUk: AboutYouPageUk;
  aboutYourRolePageUk: AboutYourRolePageUk;
  registrationPageUk: RegistrationPageUk;
  onlineDiscountPageUk: OnlineDiscountsPageUk;
  myAccountPageAus: MyAccountPageAus;
  myAccountPageUk: MyAccountPageUk;
  membersHomeAus: MembersHomeAus;
  membersHomeDds: MembersHomeDds;
  membersHomeUk: MembersHomeUk;
  homePagePreLoginUK: HomePagePreLoginUK;
  homePagePreLoginAUS: HomePagePreLoginAUS;
  homePagePreLoginDDS: HomePagePreLoginDDS;
}>({
  webActions: async ({ page, context }, use) => {
    await use(new WebActions(page, context));
  },
  membersHomeUk: async ({ page, context }, use) => {
    await use(new MembersHomeUk(page, context));
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
  membersHomeDds: async ({ page, context }, use) => {
    await use(new MembersHomeDds(page, context));
  },
  membersHomeAus: async ({ page, context }, use) => {
    await use(new MembersHomeAus(page, context));
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
