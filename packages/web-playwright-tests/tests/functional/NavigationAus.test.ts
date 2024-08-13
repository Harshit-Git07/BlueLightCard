import test from "@lib/BaseTest";

//Test Case IOSDISCO-261

//TC_001 - Home
test(`@Aus @SmokeTest @Web Ensure all the Navigation links work on header`, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  //Home
  await test.step(`Checking the Home url is correct`, async () => {
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //Offers
  await test.step(`Hovering on offers and checking the Online Discounts-header-link`, async () => {
    await homePageAus.selectOptionFromOffersMenu("Online Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=0");
  });

  await test.step(`Hovering on offers and checking the Giftcard Discounts-header-link`, async () => {
    await homePageAus.selectOptionFromOffersMenu("Giftcard Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=2");
  });

  await test.step(`Hovering on offers and checking the In-Store offers -header-link`, async () => {
    await homePageAus.selectOptionFromOffersMenu("In-Store Offers");
    await webActions.verifyPageUrlContains("/offers.php?type=5");
  });

  await test.step(`Hovering on offers and checking the Popular Discounts -header-link`, async () => {
    await homePageAus.selectOptionFromOffersMenu("Popular Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=3");
  });

  await test.step(`Hovering on offers and checking the Offers Near You -header-link`, async () => {
    await homePageAus.selectOptionFromOffersMenu("Offers Near You");
    await webActions.verifyPageUrlContains("/nearme.php");
  });

  await test.step(`Hovering on offers and checking the Deals of the Week -header-link`, async () => {
    await homePageAus.selectOptionFromOffersMenu("Deals of the Week");
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //MyCard
  await test.step(`Clicking My Card and verifying the My Card screen appears`, async () => {
    await homePageAus.selectOptionFromTopMenu("My Card");
    await webActions.verifyPageUrlContains("/highstreetcard.php");
  });

  //MyAccount
  await test.step(`Clicking MyAccount and verifying the MyAccount screen appears`, async () => {
    await homePageAus.selectOptionFromTopMenu("My Account");
    await webActions.verifyPageUrlContains("/account.php");
  });

  //FAQs
  await test.step(`Clicking FAQs and verifying the FAQs screen appears`, async () => {
    await homePageAus.selectOptionFromTopMenu("FAQs");
    await webActions.verifyPageUrlContains("/contactblc.php");
  });

  //Home
  await test.step(`Clicking Home and verifying the Home screen appears`, async () => {
    await homePageAus.selectOptionFromTopMenu("Home");
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //Logout
  await test.step(`Clicking Logout and verifying home screen appears`, async () => {
    await homePageAus.selectOptionFromTopMenu("Logout");
    await webActions.verifyPageUrlContains("/index.php");
    await homePageAus.verifyLoginScreenAppears();
  });
});

//TC_002 - Ensure all the Navigation links work on footer
test(`@Aus @SmokeTest @Web Ensure all the Navigation links work on footer`, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  //Online Discounts
  await test.step(`Clicking footer option for 'Online Discounts' and verifying the 'Online Discounts' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Online Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=0");
  });

  //Giftcard Discounts
  await test.step(`Clicking footer option for 'Giftcard Discounts' and verifying the 'Giftcard Discounts' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Giftcard Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=2");
  });

  //In-Store Offers
  await test.step(`Clicking footer option for 'In-Store Offers' and verifying the 'In-Store Offers' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("In-Store Offers");
    await webActions.verifyPageUrlContains("/offers.php?type=5");
  });

  //Popular Discounts
  await test.step(`Clicking footer option for 'Popular Discounts' and verifying the 'Popular Discounts' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Popular Discounts");
    await webActions.verifyPageUrlContains("/offers.php?type=3");
  });

  //Offers Near You
  await test.step(`Clicking footer option for 'Offers Near You' and verifying the 'Offers Near You' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Offers Near You");
    await webActions.verifyPageUrlContains("/nearme.php");
  });

  //Deals of the Week
  await test.step(`Clicking footer option for 'Deals of the Week' and verifying the 'Deals of the Week' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Deals of the Week");
    await webActions.verifyPageUrlContains("/memhome.php");
  });

  //Mobile App
  await test.step(`Clicking footer option for 'Mobile App' and verifying the 'Mobile App' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Mobile App");
    await webActions.verifyPageUrlContains("/bluelightcardmobileapp.php");
  });

  //Contact us
  await test.step(`Clicking footer option for 'Contact us' and verifying the 'Contact us' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Contact us");
    await webActions.verifyPageUrlContains("/support.php");
  });

  //The below appears to be broken in staging - times out
  // //Sitemap
  // await test.step(`Clicking footer option for 'Sitemap' and verifying the 'Sitemap' screen appears`, async () => {
  //   await homePageAus.SelectTheOptionFromTheFooterMenu("Sitemap");
  //   await webActions.verifyPageUrlContains("/sitemap.php");
  // });

  //Local businesses
  await test.step(`Clicking footer option for 'Local businesses' and verifying the 'Local businesses' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Local businesses");
    await webActions.verifyPageUrlContains("/localbusinesses.php");
  });

  //FAQ's
  await test.step(`Clicking footer option for 'FAQ's' and verifying the 'FAQ's' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("FAQ's");
    await webActions.verifyPageUrlContains("/localbusinesses.php"); //This looks like a bug in staging - it should go to the FAQ's page..
  });

  //Terms and Conditions
  await test.step(`Clicking footer option for 'Terms and Conditions' and verifying the 'Terms and Conditions' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Terms and Conditions");
    await webActions.verifyPageUrlContains("/terms_and_conditions.php");
  });

  //Privacy Notice
  await test.step(`Clicking footer option for 'Privacy Notice' and verifying the 'Privacy Notice' screen appears`, async () => {
    await homePageAus.selectPrivacyNotice();
    await webActions.verifyPageUrlContains("/privacy-notice.php");
  });

  //Candidate Privacy Notice
  await test.step(`Clicking footer option for 'Candidate Privacy Notice' and verifying the 'Candidate Privacy Notice' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Candidate Privacy Notice");
    await webActions.verifyPageUrlContains("/candidate-privacy-notice.php");
  });

  //Cookies Policy
  await test.step(`Clicking footer option for 'Cookies Policy' and verifying the 'Cookies Policy' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Cookies Policy");
    await webActions.verifyPageUrlContains("/cookies_policy.php");
  });

  //Manage Cookies
  await test.step(`Clicking footer option for 'Manage Cookies' and verifying the 'Manage Cookies' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu("Manage Cookies");
    await homePageAus.acceptCookies();
  });

  //Modern Slavery Act Statement
  await test.step(`Clicking footer option for 'Modern Slavery Act Statement' and verifying the 'Modern Slavery Act Statement' screen appears`, async () => {
    await homePageAus.selectOptionFromFooterMenu(
      "Modern Slavery Act Statement"
    );
    await webActions.verifyPageUrlContains("/modern-slavery-act.php");
  });
});

//TC_003 - Ensure when clicking on an offer, user is directed to relevant offer
test(`@Aus @SmokeTest @Web Ensure when clicking on an offer, user is directed to relevant offer`, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  await test.step(`Click on the offer and check that the url is updated to reflect the screen change`, async () => {
    // await homePageAus.ClickTheOffer();
    await webActions.verifyPageUrlContains("???");
  });
});

//TC_004 - The home page should handle invalid links
//What is an invalid link in the context of this test? - Can be setup through admin panel - later

//TC_005 - The flexi menu navigates to the offer list
//anything in ways to save is the flexi menu - click any one and assert url includes flexi offers
test(`@Aus @SmokeTest @Web @workingOn The flexi menu navigates to the offer list`, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  await test.step(`Clicking on the flexi menu option and asserting url change`, async () => {
    await homePageAus.clickFlexiMenu();
    await webActions.verifyPageUrlContains("flexibleOffers.php");
  });
});

//TC_006 - The news should navigate to the blog or the news list - on footer - latest news and blogs
//TODO - There appears to be no news option in AU for the footer?

//TC_007 - User should be able to search for an offer on home page via phrase (mobile and web) - url /search?issuer=&q=shoes
test(`@Aus @SmokeTest @Web User should be able to search for an offer on home page via phrase (mobile and web)`, async ({
  homePageAus,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  await test.step(`Clicking the search option and selecting a category then asserting the correct screen is displayed`, async () => {
    await homePageAus.clickSearchOption();
    await homePageAus.enterSearchPhraseAndSearch("Shoes");
    await homePageAus.checkSearchedPhraseHeadingIsCorrect("Shoes");
  });
});

//TC_008 - User should be able to search for an company on home page via company
//NOT WORKING IN STAGING - "Error - An error has occurred and has been logged in the system for review. If you are not sure why this has happened please navigate back to this page using the navigation links provided above. If the problems continues please contact a member of the team and quote error code: COM99"
//OPODO

//TC_009 - User should be able to search for an company on home page via category (Web)
test(`@Aus @SmokeTest @Web User should be able to search for an company on home page via category`, async ({
  homePageAus,
}) => {
  await test.step(`Logging in to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
  });

  await test.step(`Clicking the search option and selecting a category then asserting the correct screen is displayed`, async () => {
    await homePageAus.clickSearchOption();
    await homePageAus.clickCategoryOption();
    await homePageAus.selectOptionFromCategoryMenu("Children and Toys");
    await homePageAus.checkSearchedForHeadingIsCorrect("Children and Toys");
  });
});

//The below is not mapped to a test case
test(`@Aus @SmokeTest @Web Check 'Start Saving' button loads the 'Create account' screen`, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Navigating to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAus();
    await homePageAus.acceptCookies();
  });

  await test.step(`Clicking on the 'Start saving' button and checking that user is redirected to the correct page`, async () => {
    await homePageAus.clickStartSavingButton();
    await webActions.verifyPageUrlContains("/create-account.php");
    await homePageAus.assertElementsVisibleCreateAccountScreen();
  });
});

//The below is not mapped to a test case
test(`@Aus @SmokeTest @Web Click the 'Brand Partner - Partner with us' button and check redirected to the correct url `, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Navigating to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAus();
    await homePageAus.acceptCookies();
  });

  await test.step(`Clicking on the 'Brand Partner - Partner with us' button and checking that user is redirected to the correct page`, async () => {
    await homePageAus.clickPartnerWithUsButton();
    await webActions.verifyPageUrlContains("/page/partner-with-us/");
  });
});

//The below is not mapped to a test case
test(`@Aus @SmokeTest @Web Click the 'Reward your team - Get in touch with us' button and check redirected to the correct url `, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Navigating to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAus();
    await homePageAus.acceptCookies();
  });

  await test.step(`Clicking on the 'Reward your team - Get in touch with us' button and checking that user is redirected to the correct page`, async () => {
    await homePageAus.clickGetInTouchWithUsButton();
    await webActions.verifyPageUrlContains("/page/member-rewards/");
  });
});

//The below is not mapped to a test case
test(`@Aus @SmokeTest @Web Click the change country button - select UK and check the url the user is redirected to is correct`, async ({
  homePageAus,
  webActions,
}) => {
  await test.step(`Navigating to BLC Aus`, async () => {
    await homePageAus.navigateToUrlAus();
    await homePageAus.acceptCookies();
  });

  await test.step(`Clicking on the select country option, changing the country to UK and checking that user is redirected to the correct page`, async () => {
    await homePageAus.clickChangeCountryButtonAndSelectUk();
    await webActions.verifyPageUrlContains("https://www.bluelightcard.co.uk/");
  });
});
