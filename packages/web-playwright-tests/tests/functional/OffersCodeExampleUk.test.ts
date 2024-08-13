import test from '@lib/BaseTest';

//TODO - NEEDS MAPPED TO TEST CASE - BASED OFF OF EXAMPLE TEST CASE PROVIDED BY SALMA
//LIVE TEST

//TC_001 - Home
test(`@Uk @SmokeTest @Web Ensure all the Navigation links work on header`, async ({
  homePageUk,
  webActions,
}) => {
  await test.step(`Logging in to BLC UK`, async () => {
    await homePageUk.navigateToUrlAndLogin(process.env.EMAIL_UK, process.env.PASSWORD_UK);
  });

  //Offers
  await test.step(`Hovering on offers and checking the Online Discounts-header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu('Online Discounts');
    await webActions.verifyPageUrlContains('/offers.php?type=0');
  });

  await test.step(`Hovering on offers and checking the Online Discounts-header-link`, async () => {
    await homePageUk.selectOptionFromTheOffersMenu('Online Discounts');
    await webActions.verifyPageUrlContains('/offers.php?type=0');
  });
});
