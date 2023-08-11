import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, expect } from '@playwright/test';
import { page } from '../support/world';

//Given
Given('I navigate to Eligibility Checker', async function () {
  await page.goto('https://www.staging.bluelightcard.tech/eligibility/');
});

//When
When('I check Employed', async function () {
  await page.getByLabel('Employed').check();
});

When('I check Retired', async function () {
  await page.getByLabel('Retired').check();
});

When('I check Volunteer', async function () {
  await page.getByLabel('Volunteer').check();
});

When('I choose {string}', async function (organisation) {
  await page
    .getByRole('combobox', { name: 'drop-down selector' })
    .selectOption({ label: organisation });
});

When('I choose an {string}', async function (employer) {
  await page.selectOption('#employer_select', { label: employer });
});

When('I enter {string}', async function (jobRole) {
  await page.getByPlaceholder('What do you work as?').click();
  await page.getByPlaceholder('What do you work as?').fill(jobRole);
  await page.locator('#next_button').click();
});

When('I choose {string} as organisation', async function (Other) {
  await page.getByRole('combobox', { name: 'drop-down selector' }).selectOption(Other);
});

When('I should see a message', async function () {
  await page
    .getByText("It looks like we haven't added your organisation yet, register your interest to ")
    .isVisible();
});

When('I can write the name of my organisation', async function () {
  await page.getByPlaceholder('Tell us the name of your organisation').click();
  await page.getByPlaceholder('Tell us the name of your organisation').fill('test company');
  await page.getByRole('button', { name: 'Submit' }).click();
});

When('I can write the name of my employer', async function () {
  await page.getByPlaceholder('Tell us the name of your employer').click();
  await page.getByPlaceholder('Tell us the name of your employer').fill('test');
  await page.getByRole('button', { name: 'Submit' }).click();
});

When('I choose {string} as employer', async function (Other) {
  await page.selectOption('#employer_select', Other);
});

When('I click next button', async function () {
  await page.locator('id=next_button').click();
});
//Then
Then('I should be able to select a verification options', async function () {
  await page.locator('id=work_email').textContent();

  if (page.locator('id=1')) {
    page.locator('id=1').textContent();
  } else if (page.locator('id=2')) {
    page.locator('id=2').textContent();
  } else if (page.locator('id=3')) {
    page.locator('id=3').textContent();
  }
  await page.locator('id=no_id').textContent();
  await page.locator('id=work_email').click();
});

Then('I should see an option to sign up', async function () {
  await page.locator('#submit_button').click();
  await page.locator('#signup_button').textContent();
});

Then('I can close the Checker', async function () {
  await page.locator('#finish_button').click();
});

Then('I should be able quit', async function () {
  await page.locator('#quit_button').click();
  await page.locator('#quit_eligibility').textContent();
  await page.locator('#modal_quit_button').click();
  await page.waitForURL('**/index.php');
});

Then('I should be able quit, change mind and continue', async function () {
  await page.locator('#quit_button').click();
  await page.locator('#quit_eligibility').textContent();
  await page.locator('#continue_button').click();
  await page.getByRole('heading', { name: 'Eligibility Checker' });
});

Then('I go back to previous page', async function () {
  await page.locator('#back_button').click();
});

Then("I see a message that I'm not eligible", async function () {
  await page.getByText('Sorry, you are not currently eligible').isVisible();
});

Then('I click finish', async function () {
  await page.getByRole('button', { name: 'Finish' }).click();
});

Then(
  "I should be able to see of verification options and select I don't have any of the above",
  async function () {
    await page.locator('id=no_id').click();
    await page.getByRole('button', { name: 'Submit' }).click();
  }
);

When('I scroll to the end of the page', async function () {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.locator('#footer_nav').textContent();
});

Then('I should see copyright footer', async function () {
  await page.locator('#footer_nav').isVisible();
});
