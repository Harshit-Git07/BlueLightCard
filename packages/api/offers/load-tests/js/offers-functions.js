module.exports = {
  setCognitoCredentials: setCognitoCredentials,
  authenticateUser: authenticateUser,
}

require('dotenv').config();
const CryptoJS = require('crypto-js');
const crypto = require("crypto");
const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

let globalAccessToken = null;

function setCognitoCredentials(userContext, events, done) {
  const userName = encodeURI(process.env.COGNITO_STAGING_USERNAME);
  const password = encodeURI(process.env.COGNITO_STAGING_PASSWORD);
  const clientId = encodeURI(process.env.COGNITO_STAGING_CLIENT_ID);
  const clientSecret = encodeURI(process.env.COGNITO_STAGING_CLIENT_SECRET);
  const hmac_sha_256 = CryptoJS.HmacSHA256(userName + clientId, clientSecret);
  userContext.vars.cognitoUsername = userName;
  userContext.vars.cognitoPassword = password;
  userContext.vars.cognitoSecretHash = CryptoJS.enc.Base64.stringify(hmac_sha_256);
  userContext.vars.cognitoClientId = clientId;

  return done();
}

async function authenticateUser(context, events, done) {

  const userName = encodeURI(process.env.COGNITO_STAGING_USERNAME);
  const password = encodeURI(process.env.COGNITO_STAGING_PASSWORD);
  const clientId = encodeURI(process.env.COGNITO_STAGING_CLIENT_ID);
  const clientSecret = encodeURI(process.env.COGNITO_STAGING_CLIENT_SECRET);
  const awsRegion = encodeURI(process.env.COGNITO_STAGING_AWS_REGION);

  const client = new CognitoIdentityProviderClient({ region: awsRegion });

  const secretHash = crypto
    .createHmac("SHA256", clientSecret)
    .update(userName + clientId)
    .digest("base64");

  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: userName,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  });

  try {
    console.log("Authenticating user");
    const response = await client.send(command);
    globalAccessToken = response.AuthenticationResult.AccessToken;
    context.vars.token = globalAccessToken;
  } catch (err) {
    console.log(err);
    return done(err);
  }

  return done();

}
