import { TestInfo, test as baseTest } from "@playwright/test";
import { WebActions } from "@lib/WebActions";
import { HomePageUk } from "@pages/HomePageUk";
import { RegistrationPageUk } from "@pages/RegistrationPageUk";
import { HomePageDds } from "@pages/HomePageDds";
import { HomePageAus } from "@pages/HomePageAus";
import { MyAccountPageAus } from "@pages/MyAccountPageAus";
import { OnlineDiscountsPageUk } from "@pages/OnlineDiscountsPageUk";

const test = baseTest.extend<{
  webActions: WebActions;
  testInfo: TestInfo;
  homePageUk: HomePageUk;
  registrationPageUk: RegistrationPageUk;
  onlineDiscountPageUk: OnlineDiscountsPageUk;
  homePageDds: HomePageDds;
  homePageAus: HomePageAus;
  myAccountPageAus: MyAccountPageAus;
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
});

export default test;
