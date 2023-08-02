
import { Given, When, Then } from '@cucumber/cucumber'
import{ chromium, Browser, expect} from "@playwright/test"
import { page } from "../support/world";


//Given
  Given('I navigate to Eligibility Checker website', async function () {
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
    await page.getByRole('combobox', { name: 'drop-down selector' }).selectOption({label:organisation});
 });


 When('I choose an {string}', async function (employer) {
  await page.selectOption('#employer_select', {label:employer});
});


When('I enter {string}', async function (jobRole) {
  await page.getByPlaceholder('What do you work as?').click();
  await page.getByPlaceholder('What do you work as?').fill(jobRole);
  await page.locator("#next_button").click();  
  });
  
//Then
  Then('I should be able to select a verification options', async function () {
    await page.locator("id=work_email").textContent();
    
    if( page.locator("id=1"))
      { page.locator("id=1").textContent();
    } else if(page.locator("id=2")) {
       page.locator("id=2").textContent();
    } else if(page.locator("id=3")){
       page.locator("id=3").textContent();
    }
    /*
    await expect(page.locator("id=1")).toBeTruthy && page.locator("id=1").textContent();
    await expect(page.locator("id=2")).toBeTruthy && page.locator("id=2").textContent();
    await expect(page.locator("id=3")).toBeTruthy && page.locator("id=3").textContent();
    */
    await page.locator("id=no_id").textContent();
    await page.locator("id=work_email").click();
    
  });

  Then('I should see an option to sign up', async function () {
    await page.locator("#submit_button").click();
    await page.locator("#signup_button").textContent();
  });
 
  Then('I can close the Checker', async function () {
    await page.locator("#finish_button").click();
  });

  Then('I should be able quit', async function () {
    await page.locator("#quit_button").click();
    await page.locator("#quit_eligibility").textContent();
    await page.locator("#modal_quit_button").click();    
  });

  Then('I should be able quit, change mind and continue', async function () {
    await page.locator("#quit_button").click();
    await page.locator("#quit_eligibility").textContent();
    await page.locator("#continue_button").click();
    await page.getByRole('heading', { name: 'Eligibility Checker' });
  });

  Then('I go back to previous page', async function () {
    await page.locator("#back_button").click();
  });
  