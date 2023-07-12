import { Given, When, Then } from '@cucumber/cucumber'
import{ chromium, Browser, expect} from "@playwright/test"
import { page } from "../support/world";


Given('I navigates to demoblaze website', async function () {
    await page.goto('https://www.demoblaze.com/')
  });

  Given('I click on {string}', async function (string) {
    await page.locator("#login2").click();
  });

  Given('I enter username as {string}', async function (username) {
    await page.locator("#loginusername").type(username);
  });

  Given('I enter password as {string}', async function (password) {
    await page.locator("#loginpassword").type(password);
  });

  When('I click on the login button', async function () {
    await page.locator("//button[text()='Log in']").click() ;
  });

  When('I click categories link', async () =>{
    await page.locator('//div[@class="list-group"]//a[1]').click();
  });

  When('I choose {string}', async function (category) {
    await page.click(`text=${category}`);
  });  

  Then('Login should be success', async function () {
    await page.locator("#nameofuser").textContent();
  });

Then('Login should fail', async function () {
    page.on('dialog', dialog => dialog.accept());
});

Then('I see {string},{string} and {string}', async (string, string2, string3) => {
  const actualSublink = await page.locator('//div[@class="list-group"]//a[not(@id="cat")]').allTextContents();
  const expectSublinks = [string,string2,string3];
  expect(actualSublink).toEqual(expectSublinks);
});

Then('I see {string} in displayed', async (actualProduct) => {
  const product = page.locator(`//a[contains(text(),"${actualProduct}"`);
  await expect(product).toBeTruthy();
});
