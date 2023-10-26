import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from '../support/world';
import * as dotenv from 'dotenv';
dotenv.config();

When('I click on a sponsor banner', async function () {
  await page.getByTestId('promoBanner0').click();
});

When('I click on a Deal of the week card', async function () {
  await page
    .getByTestId('deals-carousel')
    .getByTestId('_offer_card_2')
    .click();
});

When('I click on a Ways to save card', async function () {
  await page
  .locator(`[data-testid="flexi-menu-carousel"]`)
  .scrollIntoViewIfNeeded();
  await page
    .getByTestId('flexi-menu-carousel')
    .getByTestId('_offer_card_3')
    .click();
});

When('I scroll to the bottom to view market place menu carousel', async function () {
  await page
    .locator(`[data-testid="marketplace-menu-carousel-0"]`)
    .scrollIntoViewIfNeeded();
});

When('I click on a Market place menu card', async function () {
    await page
    .locator(`[data-testid="marketplace-menu-carousel-0"] [data-testid="_offer_card_3"]`)
    .click();
});
When('I scroll to the bottom to view feature offer carousel', async function () {
  await page
    .locator(`[data-testid="featured-menu-carousel"]`)
    .scrollIntoViewIfNeeded();
});

When('I click on a featured offers card', async function () {
  await page
    .locator(`[data-testid="featured-menu-carousel"] [data-testid="_offer_card_3"]`)
    .click();
});

Then('I should be able to view the sponsor banners', async function () {
  await expect(page.getByTestId('homepage-sponsor-banners')).toBeVisible();
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
