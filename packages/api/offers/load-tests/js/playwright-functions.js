module.exports = {
  loginAndGoToMemberHomepage
}

const userName = encodeURI(process.env.COGNITO_STAGING_USERNAME);
const password = encodeURI(process.env.COGNITO_STAGING_PASSWORD);

async function loginAndGoToMemberHomepage(page, userContext, events) {
  console.log('Perform LOGIN');
  const BASE_URL = userContext.vars.target;

  await page.goto(`${BASE_URL}/login.php`);
  await page.getByPlaceholder('Enter your email').fill(userName)
  await page.getByPlaceholder('Type your password').fill(password)
  await page.evaluate(() => {
    document.querySelector('form[name="login"]').submit();
  });
  await page.waitForNavigation();
  await page.goto(`${BASE_URL}/memhome.php`);
}
