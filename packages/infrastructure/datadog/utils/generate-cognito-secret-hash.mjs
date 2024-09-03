import { createHmac } from 'crypto';
// grab all the constant variables from the user pool
const CLIENT_SECRET = '';
const CLIENT_ID = '';
// this should be the email address associated with the user in Cognito;
const USERNAME = '';

const hasher = createHmac('sha256', CLIENT_SECRET);
hasher.update(`${USERNAME}${CLIENT_ID}`);
const secretHash = hasher.digest('base64');
console.log(secretHash)
