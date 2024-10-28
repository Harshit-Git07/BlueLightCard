import test from '@lib/BaseTest';
import { verifyURL } from 'utils/functional/verifyUtils';

test.beforeEach(async ({homePagePreLoginUK }) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePagePreLoginUK.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
});

});



test(`@Uk @SmokeTest @Web - BLC UK Existing User - Redeem offer - 004`, async ({ membersHomeUk }) => {


  await test.step(`Performing the search for Pets At Home`, async () => {
    await membersHomeUk.searchForCompanyCategoryOrPhrase('Company', 'Pets At Home');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeUk.clickToSeeTheDiscount('petsathome.com');
    await membersHomeUk.readFromClipboardAndAssert('BLC10');
  });

});

 test(`@Uk @SmokeTest @Web - BLC UK Existing User - Redeem offer - 005`, async ({ membersHomeUk }) => {


   await test.step(`Performing the search for 883 Police`, async () => {
     await membersHomeUk.searchForCompanyCategoryOrPhrase('Company', '883 Police');
   });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeUk.visitWebsiteAndVerifyUrl('883police.com'); 
    await membersHomeUk.readFromClipboardAndAssert('BLUELIGHT10');
    
   });

 });

test(`@Uk @SmokeTest @Web - Verify that BLC UK Online Discounts Footer Button is Functional`, async ({ membersHomeUk }) => {
  await membersHomeUk.clickOnlineDiscounts();
  await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/offers.php?type=0");
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK High Street Offers Footer Button is Functional`, async ({ membersHomeUk }) => {
  await membersHomeUk.clickHighStreetOffers();
  await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/offers.php?type=5");
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Popular Discounts Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Popular Discounts Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickPopularDiscounts();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/offers.php?type=3");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Offers Near You Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Offers Near You Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickOffersNearYou();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/nearme.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Deals of the Week Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Deals of the Week Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickDealsOfTheWeek();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/members-home");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Blue Light Card Foundation Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Blue Light Card Foundation Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickBlueLightCardFoundation();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/foundation.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Latest News and Blogs Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Latest News and Blogs Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickLatestNewsAndBlogs();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/bluelightcardnews.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK About Us Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking About Us Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickAboutUs();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/about_blue_light_card.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Free Tickets Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Free Tickets Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickFreeTickets();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/freenhsandbluelightcardtickets.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Compliance Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Compliance Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickCompliance();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/compliance.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Add a Discount Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Add a Discount Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickAddADiscount();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/addaforcesdiscount.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Mobile App Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Mobile App Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickMobileApp();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/bluelightcardmobileapp.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Competitions Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Competitions Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickCompetitions();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/blccompetitions.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Sitemap Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Sitemap Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickSitemap();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/sitemap.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Contact Us Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Contact Us Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickContactUs();
    await verifyURL(membersHomeUk.page, "https://bluelightcard.zendesk.com/hc/en-gb/signin");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Careers at Blue Light Card Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Careers at Blue Light Card Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickCareersAtBlueLightCard();
    await verifyURL(membersHomeUk.page, "https://careers.bluelightcard.co.uk");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Legal and Regulatory Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Legal and Regulatory Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickLegalAndRegulatory();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/legal-and-regulatory.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Terms and Conditions Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Terms and Conditions Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickTermsAndConditions();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/terms_and_conditions.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Privacy Notice Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Privacy Notice Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickPrivacyNotice();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/privacy-notice.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Candidate Privacy Notice Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Candidate Privacy Notice Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickCandidatePrivacyNotice();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/candidate-privacy-notice.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Cookies Policy Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Cookies Policy Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickCookiesPolicy();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/cookies_policy.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Manage Cookies Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Manage Cookies Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickManageCookies();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/managecookies.php");
  });
});

test(`@Uk @SmokeTest @Web - Verify that BLC UK Modern Slavery Act Statement Footer Button is Functional`, async ({ membersHomeUk }) => {
  await test.step(`Clicking Modern Slavery Act Statement Link and Verifying Navigation`, async () => {
    await membersHomeUk.clickModernSlaveryActStatement();
    await verifyURL(membersHomeUk.page, "https://www.bluelightcard.co.uk/modern-slavery-act.php");
  });
});


