import test from "@lib/BaseTest";
import { footerOptionsAndUrlsUk } from "tests/testData/test_data";

//TODO - NEEDS MAPPED TO TEST CASE - BASED THESE OFF THE AUS TESTS

//TC_001 - Home
test(`@Uk @Smoke @Web Ensure all the Navigation links work on header`, async ({
  homePageUk,
  webActions,
}) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePageUk.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
  });

  //Home
  await test.step(`Checking the Home url is correct`, async () => {
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //Offers
  await test.step(`Hovering on offers and checking the Online Discounts-header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu("Online Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=0");
  });

  await test.step(`Hovering on offers and checking the Giftcard Discounts-header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu("Giftcard Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=2");
  });

  await test.step(`Hovering on offers and checking the High Street offers -header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu("High Street Offers");
    await webActions.verifyPageUrlContains("/offers.php?type=5");
  });

  await test.step(`Hovering on offers and checking the Popular Discounts -header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu("Popular Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=3");
  });

  await test.step(`Hovering on offers and checking the Offers Near You -header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu("Offers Near You");
    await webActions.verifyPageUrlContains("/nearme.php");
  });

  await test.step(`Hovering on offers and checking the Deals of the Week -header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu("Deals of the Week");
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //Discover savings
  await test.step(`Hovering on Discover Savings and checking the Holiday Discounts -header-link`, async () => {
    await homePageUk.selectOptionFromTheDiscoverSavingsMenu(
      "Holiday Discounts"
    );
    await webActions.verifyPageUrlContains("/holiday-discounts.php");
    //Click back to home using the Blue Light Card logo
    await homePageUk.clickTheBlueLightCardLogoToReturnHome();
  });

  // await test.step(`Hovering on Discover Savings and checking the Days out -header-link`, async () => {
  //   //TODO THE BELOW IS NOT WORKING - FIND OUT WHY
  //   await homePageUk.SelectTheOptionFromTheDiscoverSavingsMenu("Days Out");
  //   await webActions.verifyPageUrlContains("/days-out.php");
  //   //Click back to home using the Blue Light Card logo
  //   await homePageUk.ClickTheBlueLightCardLogoToReturnToHome();
  // });

  //MyCard
  await test.step(`Clicking FAQs and verifying the 'My Card' screen appears`, async () => {
    await homePageUk.selectOptionFromTheTopMenu("My Card");
    await webActions.verifyPageUrlContains("/highstreetcard.php");
  });

  //MyAccount
  await test.step(`Clicking MyAccount and verifying the MyAccount screen appears`, async () => {
    await homePageUk.selectOptionFromTheTopMenu("My Account");
    await webActions.verifyPageUrlContains("/account.php");
  });

  //FAQs
  await test.step(`Clicking FAQs and verifying the FAQs screen appears`, async () => {
    await homePageUk.selectOptionFromTheTopMenu("FAQs");
    await webActions.verifyPageUrlContains("/support.php#questions");
  });

  //Home
  await test.step(`Clicking Home and verifying the Home screen appears`, async () => {
    await homePageUk.selectOptionFromTheTopMenu("Home");
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //Logout
  await test.step(`Clicking Logout and verifying home screen appears`, async () => {
    await homePageUk.selectOptionFromTheTopMenu("Logout");

    //
    await webActions.verifyPageUrlContains("/index.php");
    await homePageUk.verifyLoginScreenAppears();
  });
});

//TC_002 - Ensure all the Navigation links work on footer
test(`@Uk @Smoke @Web Ensure all the Navigation links work on footer`, async ({
  homePageUk,
  webActions,
}) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePageUk.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
  });

  for (const footerOptionsAndUrl of footerOptionsAndUrlsUk) {
    await test.step(`Clicking on the ${footerOptionsAndUrl.footerOption} footer link`, async () => {
      await homePageUk.selectOptionFromTheFooterMenu(
        footerOptionsAndUrl.footerOption
      );
    });
    await test.step(`Checking that the url updates to include ${footerOptionsAndUrl.url}`, async () => {
      await webActions.verifyPageUrlContains(footerOptionsAndUrl.url);
    });
  }

  //Blue Light Card Foundation

  await test.step(`Clicking footer option for 'Blue Light Card Foundation' and verifying the 'Blue Light Card Foundation' screen appears`, async () => {
    await homePageUk.selectOptionFromTheFooterMenu(
      "Blue Light Card Foundation"
    );
    await webActions.verifyPageUrlContains("/foundation.php");
  });

  //Latest news & blogs
});
