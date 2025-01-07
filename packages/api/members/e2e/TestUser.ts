const authDomain = process.env.E2E_TESTS_DOMAIN;
const clientId = process.env.E2E_TESTS_CLIENT_ID;
const clientSecret = process.env.E2E_TESTS_CLIENT_SECRET;

export const getTestUserBearerToken = async () => {
  const auth0TokenUrl = `${authDomain}/oauth/token`;
  const requestBody = {
    client_id: clientId,
    client_secret: clientSecret,
    audience: `${authDomain}/api/v2/`,
    grant_type: 'client_credentials',
  };

  const response = await fetch(auth0TokenUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  return (await response.json()).access_token;
};
