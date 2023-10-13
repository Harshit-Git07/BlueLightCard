import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, expect } from '@playwright/test';
import { page } from '../support/world';

Given('I am on the BLC website', async function () {
  await page.goto(process.env.BASE_URL);
});
Given('agree to all the cookies', async function () {
  await page.locator('#save_all').click();
});

When('I log in successfully', async function () {
  await page.locator("a[data-qa='a-navbar-login']").click();
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('kinmist9@bluelightcard.tech');
  await page.getByPlaceholder('Type your password').click();
  await page.getByPlaceholder('Type your password').fill('tcpip123');
  await page.locator('#content').getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.goto(process.env.BASE_URL + '/members-home');
  await page.waitForLoadState('domcontentloaded');
});

When('I click on a takeover banner', async function () {
  await page.getByTestId('promoBanner0').click();
});

When('I click on a Deal of the week card', async function () {
  await page
    .getByTestId('deals-carousel')
    .getByTestId('_offer_card_0')
    .click({ timeout: 2 * 60000 });
});

When('I click on a Ways to save card', async function () {
  await page
    .locator('flexi-menu-carousel')
    .locator('_offer_card_0')
    .click({ timeout: 2 * 60000 });
});

When('I scroll to the bottom to view market place menu carousel', async function () {
  await page
    .locator(`[data-testid="marketplace-menu-carousel-0"] [data-testid="_offer_card_0"]`)
    .scrollIntoViewIfNeeded({ timeout: 2 * 60000 });
});

When('I click on a Market place menu card', async function () {
  await page
    .locator(`[data-testid="marketplace-menu-carousel-0"] [data-testid="_offer_card_0"]`)
    .click();
});
When('I scroll to the bottom to view feature offer carousel', async function () {
  await page
    .locator(`[data-testid="featured-menu-carousel"]`)
    .scrollIntoViewIfNeeded({ timeout: 2 * 60000 });
});

When('I click on a featured offers card', async function () {
  await page
    .locator(`[data-testid="featured-menu-carousel"] [data-testid="_offer_card_0"]`)
    .click();
});

Then('I should be able to view the takeover banner', async function () {
  await page.getByTestId('takeover-banners').isVisible();
});

Then('Deal of the week carousel', async function () {
  await page.getByTestId('deals-carousel').isVisible();
});

Then('Flexi menus carousel', async function () {
  await page.getByTestId('flexi-menu-carousel').isVisible();
});

Then('Market place offers carousel', async function () {
  await page.getByTestId('marketplace-menu-carousel-0').isVisible();
});

Then('Featured offers carousel', async function () {
  await page.getByTestId('featured-menu-carousel').isVisible();
});

Then('I should successfully navigate to the offer detail page', async function () {
  await expect(page.url()).toContain('offerdetails.php');
});

Then('I should successfully navigate to the flexible offers detail page', async function () {
  await expect(page.url()).toContain('flexibleOffers.php');
});
