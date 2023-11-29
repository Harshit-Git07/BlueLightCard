import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from '../support/world';
import * as dotenv from 'dotenv';
dotenv.config();

const ASSERTION_TIMEOUT = 10000;
const BASE_URL = process.env.BASE_URL || '';
const USERNAME = process.env.USERNAME || '';
const PASSWORD = process.env.PASSWORD || '';

//GIVEN//
Given('I am on the BLC website', async function () {
  await page.goto(BASE_URL, { waitUntil: 'load' });
});

Given('agree to all the cookies', async function () {
  await page.locator('#save_all').click();
});

Given('I should be able to view the search section', async function () {
  await page.getByTestId('searchNav').isVisible();
});

When('I log in successfully', async function () {
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Login' }).click();

  await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  await expect(page.getByPlaceholder('Type your password')).toBeVisible();

  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill(USERNAME);
  await page.getByPlaceholder('Type your password').click();
  await page.getByPlaceholder('Type your password').fill(PASSWORD);
  await page.locator("input[data-qa='input-submit-login']").scrollIntoViewIfNeeded();
  await expect(page.locator("input[data-qa='input-submit-login']")).toBeEnabled();
  await page.locator("input[data-qa='input-submit-login']").click();
  console.log('logging in');
  await page.waitForURL(`**/memhome.php`, { waitUntil: 'load' });
  console.log('waiting for memhome to finish loading');
  expect(page.url()).toContain('memhome.php');
  console.log('doing the expect to check its memhome');
  await page.goto(BASE_URL + '/members-home', { waitUntil: 'load' });
  console.log('goto members home');
  expect(page.url()).toContain('members-home');
  console.log('check url');
  await expect(page.getByTestId('homepage-sponsor-banners')).toBeVisible();
  console.log('sponsor');
});

//WHEN//
When('I should be able to view the header', async function () {
  await expect(page.getByTestId('app-header')).toBeVisible();
  await expect(page.getByTestId('desktopNav')).toBeVisible();
});

When('I should be able to view the footer', async function () {
  await expect(page.getByTestId('app-footer')).toBeVisible();
});

When('I click on {string} in the header', async function (icon) {
  await expect(page.getByTestId(icon)).toBeVisible();
  await page.getByTestId(icon).click();
});

When('I click on {string} in the navigation bar', async function (link) {
  await expect(page.getByTestId(link)).toBeVisible();
  await page.getByTestId(link).click();
});

When('I click on {string} in the footer', async function (link) {
  await expect(page.getByTestId(link)).toBeVisible();
  await page.getByTestId(link).click();
});

When('I hover on Browse Categories', async function () {
  await expect(page.getByTestId('Browse categories-header-link')).toBeVisible();
  await page.getByTestId('Browse categories-header-link').hover();
});

When('I click on {string} in Browse Categories', async function (link) {
  await expect(page.getByTestId(link)).toBeVisible();
  await page.getByTestId(link).click();
});

When('I hover on Offers', async function () {
  await expect(page.getByTestId('Offers-header-link')).toBeVisible();
  await page.getByTestId('Offers-header-link').hover();
});

When('I click on {string} in Offers', async function (link) {
  await page.getByTestId(link).click();
});

When('I click on search button', async function () {
  await expect(page.getByTestId('searchBtn')).toBeVisible();
  await page.getByTestId('searchBtn').click();
});

///THEN//
Then('I should navigate to {string}', async function (url) {
  await page.waitForURL(`**${url}`, { waitUntil: 'commit' });
  await expect(page.url()).toContain(url);
});

Then('I should see Find by company dropdown menu', async function () {
  await expect(page.getByTestId('byCompany')).toBeVisible();
});

Then('I should see Find by category dropdown menu', async function () {
  await expect(page.getByTestId('byCategory')).toBeVisible();
});

Then('I should see Find by phrase field', async function () {
  await expect(page.getByTestId('byPhrase')).toBeVisible();
});

Then('I click on Search now button', async function () {
  await expect(page.getByTestId('searchNowBtn')).toBeVisible();
  await page.getByTestId('searchNowBtn').click();
});

Then('I return to membersHome', async function () {
  await page.goto(BASE_URL + '/members-home', { waitUntil: 'load' });
  console.log('goto members home');
  expect(page.url()).toContain('members-home');
  await expect(page.getByTestId('homepage-sponsor-banners')).toBeVisible();
});
