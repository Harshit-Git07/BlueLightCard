import test from '@lib/BaseTest';
import { verifyURL } from 'utils/functional/verifyUtils';



test.beforeEach(async ({homePagePreLoginAUS}) => {
  await test.step(`Logging in to BLC AUS`, async () => {
    await homePagePreLoginAUS.navigateToUrlAndLogin(process.env.EMAIL_AUS, process.env.PASSWORD_AUS);
});
});
test(`@Aus @SmokeTest @Web - BLC aus Existing User - Redeem offer`, async ({ membersHomeAus }) => {


  await test.step(`Performing the search for 'Enterprise Rent-A-Car'`, async () => {
    await membersHomeAus.searchForCompanyCategoryOrPhrase('Company', 'Enterprise Rent-A-Car');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeAus.clickToSeeTheDiscount('https://partners.rentalcar.com/blca/');
  });

  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Online Discounts Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Online Discounts Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickOnlineDiscounts();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/offers.php?type=0");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Gift Card Discounts Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Gift Card Discounts Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickGiftCardDiscounts();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/offers.php?type=2");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia In-Store Offers Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking In-Store Offers Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickInStoreOffers();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/offers.php?type=5");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Popular Discounts Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Popular Discounts Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickPopularDiscounts();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/offers.php?type=3");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Offers Near You Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Offers Near You Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickOffersNearYou();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/nearme.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Deals of the Week Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Deals of the Week Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickDealsOfTheWeek();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/memhome.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Mobile App Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Mobile App Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickMobileApp();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/bluelightcardmobileapp.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Contact Us Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Contact Us Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickContactUs();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/support.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Sitemap Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Sitemap Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickSitemap();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/sitemap.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Local Businesses Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Local Businesses Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickLocalBusinesses();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/localbusinesses.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia FAQs Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking FAQs Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickFAQs();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/contactblc.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Terms and Conditions Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Terms and Conditions Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickTermsAndConditions();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/terms_and_conditions.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Privacy Notice Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Privacy Notice Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickPrivacyNotice();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/privacy-notice.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Candidate Privacy Notice Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Candidate Privacy Notice Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickCandidatePrivacyNotice();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/candidate-privacy-notice.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Cookies Policy Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Cookies Policy Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickCookiesPolicy();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/cookies_policy.php");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Manage Cookies Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Manage Cookies Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickManageCookies();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/#");
    });
  });
  
  test(`@Aus @SmokeTest @Web - Verify that BLC Australia Modern Slavery Act Statement Footer Button is Functional`, async ({ membersHomeAus }) => {
    await test.step(`Clicking Modern Slavery Act Statement Link and Verifying Navigation`, async () => {
      await membersHomeAus.clickModernSlaveryAct();
      await verifyURL(membersHomeAus.page, "https://www.bluelightcard.com.au/modern-slavery-act.php");
    });
  });
});

