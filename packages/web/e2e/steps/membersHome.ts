import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from '../support/world';
import * as dotenv from 'dotenv';
dotenv.config();

const ASSERTION_TIMEOUT = 2 * 60000;

When('I click on a takeover banner', async function () {
  await page.getByTestId('promoBanner0').click({ timeout: ASSERTION_TIMEOUT });
});

When('I click on a Deal of the week card', async function () {
  await page
    .getByTestId('deals-carousel')
    .getByTestId('_offer_card_0')
    .click({ timeout: ASSERTION_TIMEOUT });
});

When('I click on a Ways to save card', async function () {
  await page
    .getByTestId('flexi-menu-carousel')
    .getByTestId('_offer_card_0')
    .click({ timeout: ASSERTION_TIMEOUT });
});

When('I scroll to the bottom to view market place menu carousel', async function () {
  await page
    .locator(`[data-testid="marketplace-menu-carousel-0"]`)
    .scrollIntoViewIfNeeded({ timeout: ASSERTION_TIMEOUT });
});

When('I click on a Market place menu card', async function () {
  await page
    .getByTestId('marketplace-menu-carousel-0')
    .getByTestId('_offer_card_4')
    .click({ timeout: ASSERTION_TIMEOUT });
});
When('I scroll to the bottom to view feature offer carousel', async function () {
  await page
    .locator(`[data-testid="featured-menu-carousel"]`)
    .scrollIntoViewIfNeeded({ timeout: ASSERTION_TIMEOUT });
});

When('I click on a featured offers card', async function () {
  await page
    .locator(`[data-testid="featured-menu-carousel"] [data-testid="_offer_card_0"]`)
    .click({ timeout: ASSERTION_TIMEOUT });
});

Then('I should be able to view the takeover banner', async function () {
  await expect(page.getByTestId('takeover-banners')).toBeVisible();
});

Then('Deal of the week carousel', async function () {
  await expect(page.getByTestId('deals-carousel')).toBeVisible();
});

Then('Flexi menus carousel', async function () {
  await expect(page.getByTestId('flexi-menu-carousel')).toBeVisible();
});

Then('Market place offers carousel', async function () {
  await expect(page.getByTestId('marketplace-menu-carousel-0')).toBeVisible();
});

Then('Featured offers carousel', async function () {
  await expect(page.getByTestId('featured-menu-carousel')).toBeVisible();
});

Then('I should successfully navigate to the offer detail page', async function () {
  await expect(page.url()).toContain('offerdetails.php');
});

Then('I should successfully navigate to the flexible offers detail page', async function () {
  await expect(page.url()).toContain('flexibleOffers.php');
});
