import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, expect } from '@playwright/test';
import { page } from '../support/world';

//Given
Given('I navigate to Eligibility Checker', async function () {
  await page.goto(process.env.BASE_URL + '/eligibility');
  await page.title();
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
  await page.locator('id=job_role_field').click();
  await page.type('id=job_role_field',jobRole);
  await page.locator('id=job_role_field').click();
  await page.type('id=job_role_field',' ');
});

When('I choose {string} as organisation', async function (Other) {
  await page.getByRole('combobox', { name: 'drop-down selector' }).selectOption(Other);
});

When('I should see an information message', async function () {
  await page
    .getByText("It looks like we haven't added your organisation yet, register your interest to ")
    .isVisible();
});

When('I can write the name of my organisation', async function () {
  await page.locator('id=other_organisation_field').click();
  await page.locator('id=other_organisation_field').fill('test company');
  await page.getByRole('button', { name: 'Submit' }).click();
});

When('I can write the name of my employer', async function () {
  await page.locator('id=other_employer_field').click();
  await page.locator('id=other_employer_field').fill('test');
  await page.getByRole('button', { name: 'Submit' }).click();
});

When('I choose {string} as employer', async function (Other) {
  await page.selectOption('#employer_select', Other);
});

When('I click next button', async function () {
  await page.locator('#next_button').scrollIntoViewIfNeeded();
  await page.waitForSelector('button#next_button:not([disabled])',{timeout: 16000});
  await page.locator('#next_button').click({timeout:10000});
});

//Then
Then('I should be able to select a verification option', async function () {
  await page.waitForSelector("'Eligibility Checker'");
  if (await page.locator('id=1').isVisible()) {
    page.locator('id=1').click();
  }

  if (await page.locator('id=work_email').isVisible()) {
    page.locator('id=work_email').click();
  }
});

Then('I click submit button', async function () {
  await page.getByRole('button', { name: 'Submit' }).click();
});

Then('I see the sign-up button', async function () {
  await page.getByRole('button', { name: 'Sign up now' }).isVisible();
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

When('given {string} should be visible', async function (verifications) {
  const verification_methods = verifications.split(',');
  for (var verification_method of verification_methods) {
    await expect(page.getByText(verification_method)).toBeVisible({ timeout: 10000 });
  }
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
