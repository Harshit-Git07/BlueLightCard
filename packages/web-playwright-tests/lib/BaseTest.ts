import { TestInfo, test as baseTest } from "@playwright/test";
import { WebActions } from "@lib/WebActions";
import AxeBuilder from "@axe-core/playwright";
import { HomePageUk } from "@pages/HomePageUk";
import { RegistrationPageUk } from "@pages/RegistrationPageUk";
import { HomePageDds } from "@pages/HomePageDds";
import { HomePageAus } from "@pages/HomePageAus";
import { MyAccountPageAus } from "@pages/MyAccountPageAus";
import { CreateAccountPageAus } from "@pages/CreateAccountPageAus";
import { OnlineDiscountsPageUk } from "@pages/OnlineDiscountsPageUk";

const test = baseTest.extend<{
  webActions: WebActions;
  makeAxeBuilder: AxeBuilder;
  testInfo: TestInfo;
  homePageUk: HomePageUk;
  registrationPageUk: RegistrationPageUk;
  onlineDiscountPageUk: OnlineDiscountsPageUk;
  homePageDds: HomePageDds;
  homePageAus: HomePageAus;
  myAccountPageAus: MyAccountPageAus;
  createAccountPageAus: CreateAccountPageAus;
}>({
  webActions: async ({ page, context }, use) => {
    await use(new WebActions(page, context));
  },
  makeAxeBuilder: async ({ page }, use) => {
    await use(
      new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("#commonly-reused-element-with-known-issue")
    );
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
  createAccountPageAus: async ({ page, context }, use) => {
    await use(new CreateAccountPageAus(page, context));
  },
});

export default test;