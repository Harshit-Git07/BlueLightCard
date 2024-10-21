import test from '@lib/BaseTest';
import { verifyURL } from 'utils/functional/verifyUtils';


test.beforeEach(async ({homePagePreLoginDDS }) => {
  await test.step(`Logging in to DDS`, async () => {
  await homePagePreLoginDDS.navigateToUrlAndLogin(process.env.EMAIL_DDS, process.env.PASSWORD_DDS);
});
});


test(`@Dds @SmokeTest @Web - DDS Existing User - Redeem offer`, async ({ membersHomeDds }) => {


  await test.step(`Performing the search for British Airways`, async () => {
    await membersHomeDds.searchForCompanyCategoryOrPhrase('Phrase', 'British Airways');
  });

  await test.step(`Clicking the Discount button and asserting the code is copied and correct website is displayed`, async () => {
    await membersHomeDds.clickToSeeTheDiscount('BAHERO', 'britishairways.com');
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Charity Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking DDS Charity Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickDDSCharityAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/charity.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Veterans Gateway Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Veterans Gateway Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickVeteransGatewayAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/veteransgateway.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS In The Press Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking DDS In The Press Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickDDSInThePressAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/defencediscountservicepress.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS News Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking DDS News Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickDDSNewsAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/defencediscountservicenews.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that Armed Forces Covenant Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Armed Forces Covenant Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickArmedForcesCovenantAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/armed_forces_covenant.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Legal and Regulatory Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Legal and Regulatory Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickLegalAndRegulatoryAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/legal-and-regulatory.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Terms and Conditions Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Terms and Conditions Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickTermsAndConditionsAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/terms_and_conditions.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Privacy Notice Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Privacy Notice Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickPrivacyNoticeAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/privacy-notice.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Cookies Policy Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Cookies Policy Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickCookiesPolicyAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/cookies_policy.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Modern Slavery Act Statement Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Modern Slavery Act Statement Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickModernSlaveryActStatementAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/modern-slavery-act.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Add a Discount Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Add a Discount Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickAddADiscountAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/addaforcesdiscount.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Mobile App Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Mobile App Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickMobileAppAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/defencediscountservicemobileapp.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Competitions Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Competitions Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickCompetitionsAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/ddscompetitions.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Compliance Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Compliance Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickComplianceAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/compliance.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Sitemap Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Sitemap Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickSitemapAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/sitemap.php");
  });
});

test(`@Dds @SmokeTest @Web - Verify that DDS Tickets Footer Button is Functional`, async ({ membersHomeDds }) => {
  await test.step(`Clicking Tickets Link and Verifying Navigation`, async () => {
    await membersHomeDds.clickTicketsAndVerify();
    await verifyURL(membersHomeDds.page, "https://www.defencediscountservice.co.uk/support.php");
  });
});

