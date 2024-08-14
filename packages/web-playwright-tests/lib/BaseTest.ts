import { TestInfo, test as baseTest } from "@playwright/test";
import { WebActions } from "@lib/WebActions";
import { HomePageUk } from "pageFactory/HomePageUk";
import { HomePageDds } from "pageFactory/HomePageDds";
import { HomePageAus } from "pageFactory/HomePageAus";
import { MyAccountPageAus } from "pageFactory/MyAccountPageAus";
import { OnlineDiscountsPageUk } from "pageFactory/OnlineDiscountsPageUk";

const test = baseTest.extend<{
  webActions: WebActions;
  testInfo: TestInfo;
  homePageUk: HomePageUk;
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
