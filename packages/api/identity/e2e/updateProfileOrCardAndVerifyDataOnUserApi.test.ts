import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';

import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import exp from 'constants';
import { v4 } from 'uuid';

const randomCardNumber = Math.floor(Math.random() * 8888888888888888 + 1111111111111111);
const brands = ['BLC_UK', 'DDS_UK', 'BLC_AU'];
const randomBrand = brands[Math.floor(Math.random() * brands.length)];

async function delay(ms: number): Promise<object> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadParameter(parameterName: string): Promise<string> {
  const ssmClient = new SecretsManagerClient({ region: 'eu-west-2' });
  const command = new GetSecretValueCommand({ SecretId: `blc-mono-identity/staging/${parameterName}` });
  try {
    // Retrieve a single secret
    const response = await ssmClient.send(command);
    return response.SecretString ?? '';
  } catch (e) {
    console.log(e);
    return '';
  }
}

function generateString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
const randomSurname = generateString(12);
const randomFirstname = generateString(12);
const randomUUId = v4();
let client: any = {};
let cognito: any = {};
let data: { user_api_url: ''; event_bus: ''; table_name: ''; aws_region: ''; user_uuid: ''; user_email: '', user_pass: '', cognito_user_pool_id: '', cognito_app_client_id: '', cognito_app_client_secret: '' };
let url = '';
let body: Record<string, unknown> = {};
let headers: Record<string, unknown> = {};
let res: any = {};
const timeOut = 100;
let sum = 0;
let userCardId = 0;
let cardPostedDate = '';
let cardExpiresDate = '';

describe('Fetch env variables', () => {
  afterEach(async () => {
    sum += timeOut + timeOut;
    await delay(sum);
  });
  test('Env variable are not null', async () => {
    loadParameter('e2e')
      .then((value) => {
        data = JSON.parse(value);
        console.log(data.aws_region);
        process.env.E2E_AWS_REGION = data.aws_region;
        process.env.E2E_USER_API_URL = data.user_api_url;
        process.env.E2E_TABLE_NAME = data.table_name;
        process.env.E2E_EVENT_BUS = data.event_bus;
        process.env.E2E_USER_UUID = data.user_uuid;
        process.env.E2E_USER_EMAIL = data.user_email;
        process.env.E2E_USER_PASS = data.user_pass;
        process.env.E2E_COGNITO_USER_POOL_ID = data.cognito_user_pool_id;
        process.env.E2E_COGNITO_APP_CLIENT_ID = data.cognito_app_client_id;
        process.env.E2E_COGNITO_APP_CLIENT_SECRET = data.cognito_app_client_secret;

        expect(process.env.E2E_AWS_REGION).toBeTruthy();
        expect(process.env.E2E_USER_API_URL).toBeTruthy();
        expect(process.env.E2E_TABLE_NAME).toBeTruthy();
        expect(process.env.E2E_EVENT_BUS).toBeTruthy();
        expect(process.env.E2E_USER_UUID).toBeTruthy();
        expect(process.env.E2E_USER_EMAIL).toBeTruthy();
        expect(process.env.E2E_USER_PASS).toBeTruthy();
        expect(process.env.E2E_COGNITO_USER_POOL_ID).toBeTruthy();
        expect(process.env.E2E_COGNITO_APP_CLIENT_ID).toBeTruthy();
        expect(process.env.E2E_COGNITO_APP_CLIENT_SECRET).toBeTruthy();

        client = new EventBridgeClient({ region: process.env.E2E_AWS_REGION });
        cognito = new CognitoIdentityProviderClient({ 
          apiVersion: '2016-04-18',
          region: process.env.E2E_AWS_REGION
      });
      })
      .catch((err) => {
        console.log(err);
      });
    await delay(5000);
  }, 10000);
});

let dataToSend: Record<string, string | number> = {};

describe('Send user profile update event, and test user api to match data', () => {
  beforeEach(async () => {
    res = {};
    sum += timeOut;
    await delay(sum);
  });
  test('Event bus - user profile update should create row', async () => {
    dataToSend.gender = 'P';
    dataToSend.uuid = String(process.env.E2E_USER_UUID);
    dataToSend.brand = randomBrand;
    dataToSend.firstname = `E2E-${randomFirstname}`;
    dataToSend.surname = `E2E-${randomSurname}`;
    dataToSend.dob = '12/12/1990';
    dataToSend.mobile = '07000000000';
    const entry = {
      Entries: [
        {
          EventBusName: process.env.E2E_EVENT_BUS,
          Source: 'user.profile.updated',
          DetailType: 'BLC_UK User Profile Updated',
          Detail: JSON.stringify(dataToSend),
          Time: new Date(),
        },
      ],
    };

    const command = new PutEventsCommand(entry);
    try {
      res = await client.send(command);
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data.data.message).toEqual('user profile data added');
    } catch (error) {}

  });

  test('User api - returns expected data', async () => {
    const hasher = createHmac('sha256', `${process.env.E2E_COGNITO_APP_CLIENT_SECRET}`);
  
    hasher.update(`${process.env.E2E_USER_EMAIL}${process.env.E2E_COGNITO_APP_CLIENT_ID}`);
    const input = {
      AuthFlow : 'USER_PASSWORD_AUTH', 
      AuthParameters: {
      USERNAME : `${process.env.E2E_USER_EMAIL}`,
      PASSWORD : `${process.env.E2E_USER_PASS}`,
      SECRET_HASH: `${hasher.digest('base64')}`
      },
      UserPoolId : `${process.env.E2E_COGNITO_USER_POOL_ID}`,
      ClientId : `${process.env.E2E_COGNITO_APP_CLIENT_ID}`
  };
  
    const command = new InitiateAuthCommand(input);
    try {
      const response = await cognito.send(command);
      process.env.identityTableName = process.env.E2E_TABLE_NAME;
      if(response.AuthenticationResult.IdToken !== undefined || response.AuthenticationResult.IdToken !== ''){
        try{
          res = await axios.get(`${process.env.E2E_USER_API_URL}`, {
          headers: { "Authorization": `Bearer ${response.AuthenticationResult.IdToken}` }
        });
      }catch (err: any) {}
      }
    } catch (err: any) {console.log(err);}
    expect(res.status).toEqual(200);
    expect(res.data.message).toEqual('User Found');
    expect(res.data.data.profile.gender).toEqual('P');
    expect(res.data.data.profile.firstname).toEqual(dataToSend.firstname);
    expect(res.data.data.profile.surname).toEqual(dataToSend.surname);
    expect(res.data.data.profile.dob).toEqual('1990-12-12');
    expect(res.data.data.profile.mobile).toEqual('07000000000');
    expect(res.data.data.profile.twoFactorAuthentication).not.toBeNull();
    expect(res.data.data.cards[0].cardId).not.toBeNull();
    expect(res.data.data.cards[0].expires).not.toBeNull();
    expect(res.data.data.cards[0].cardStatus).not.toBeNull();
    expect(res.data.data.cards[0].datePosted).not.toBeNull();
    userCardId = res.data.data.cards[0].cardId;
    cardPostedDate = res.data.data.cards[0].datePosted;
    cardExpiresDate = res.data.data.cards[0].expires;

  });
});

describe('Send user card update event, and test user api to match data', () => {
  beforeEach(async () => {
    res = {};
    sum += timeOut;
    await delay(sum);
  });
  test('Event bus - user card update sets correct date format and update/create row', async () => {
    dataToSend.uuid = String(process.env.E2E_USER_UUID);
    dataToSend.cardNumber = userCardId;
    dataToSend.cardStatus = 4;
    dataToSend.expires = '';
    dataToSend.posted = '2019 jan 01 )';
    const entry = {
      Entries: [
        {
          EventBusName: process.env.E2E_EVENT_BUS,
          Source: 'user.card.status.updated',
          DetailType: 'BLC_UK User Card Status Updated',
          Detail: JSON.stringify(dataToSend),
          Time: new Date(),
        },
      ],
    };

    const command = new PutEventsCommand(entry);
    try {
      res = await client.send(command);
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data.data.message).toEqual('user card data updated');
    } catch (error) {}

  });

  test('User api - returns expected data for card', async () => {
    const hasher = createHmac('sha256', `${process.env.E2E_COGNITO_APP_CLIENT_SECRET}`);
  
    hasher.update(`${process.env.E2E_USER_EMAIL}${process.env.E2E_COGNITO_APP_CLIENT_ID}`);
    const input = {
      AuthFlow : 'USER_PASSWORD_AUTH', 
      AuthParameters: {
      USERNAME : `${process.env.E2E_USER_EMAIL}`,
      PASSWORD : `${process.env.E2E_USER_PASS}`,
      SECRET_HASH: `${hasher.digest('base64')}`
      },
      UserPoolId : `${process.env.E2E_COGNITO_USER_POOL_ID}`,
      ClientId : `${process.env.E2E_COGNITO_APP_CLIENT_ID}`
  };
  
    const command = new InitiateAuthCommand(input);
    try {
      const response = await cognito.send(command);
      process.env.identityTableName = process.env.E2E_TABLE_NAME;
      if(response.AuthenticationResult.IdToken !== undefined || response.AuthenticationResult.IdToken !== ''){
        try{
          res = await axios.get(`${process.env.E2E_USER_API_URL}`, {
          headers: { "Authorization": `Bearer ${response.AuthenticationResult.IdToken}` }
        });
      }catch (err: any) {}
      }
    } catch (err: any) {console.log(err);}
    expect(res.status).toEqual(200);
    expect(res.data.message).toEqual('User Found');
    expect(res.data.data.uuid).not.toBeNull();
    expect(res.data.data.cards).toHaveLength(2);
    expect(res.data.data.cards[0].cardId).toEqual(userCardId);
    if(cardExpiresDate === '0000000000000000'){
      expect(res.data.data.cards[0].expires).toEqual('0000000000000000');
    }else{
      expect(res.data.data.cards[0].expires).not.toBe('0000000000000000');
    }
    expect(res.data.data.cards[0].cardStatus).toEqual('ADDED_TO_BATCH');
    if(cardPostedDate === '0000000000000000'){
      expect(res.data.data.cards[0].datePosted).toEqual('0000000000000000');
    }else{
      expect(res.data.data.cards[0].datePosted).not.toBe('0000000000000000');
    }

  });

  test('Event bus - user card update sets card status, expires and posted in correct format', async () => {
    dataToSend.uuid = String(process.env.E2E_USER_UUID);
    dataToSend.cardNumber = userCardId;
    dataToSend.cardStatus = 6;
    dataToSend.expires = '2027-12-12 23:59:59';
    dataToSend.posted = '2023-10-08 15:30:00';
    const entry = {
      Entries: [
        {
          EventBusName: process.env.E2E_EVENT_BUS,
          Source: 'user.card.status.updated',
          DetailType: 'BLC_UK User Card Status Updated',
          Detail: JSON.stringify(dataToSend),
          Time: new Date(),
        },
      ],
    };

    const command = new PutEventsCommand(entry);
    try {
      res = await client.send(command);
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data.data.message).toEqual('user card data updated');
    } catch (error) {}

  });

  test('User api - returns expected data for card', async () => {
    const hasher = createHmac('sha256', `${process.env.E2E_COGNITO_APP_CLIENT_SECRET}`);
  
    hasher.update(`${process.env.E2E_USER_EMAIL}${process.env.E2E_COGNITO_APP_CLIENT_ID}`);
    const input = {
      AuthFlow : 'USER_PASSWORD_AUTH', 
      AuthParameters: {
      USERNAME : `${process.env.E2E_USER_EMAIL}`,
      PASSWORD : `${process.env.E2E_USER_PASS}`,
      SECRET_HASH: `${hasher.digest('base64')}`
      },
      UserPoolId : `${process.env.E2E_COGNITO_USER_POOL_ID}`,
      ClientId : `${process.env.E2E_COGNITO_APP_CLIENT_ID}`
  };
  
    const command = new InitiateAuthCommand(input);
    try {
      const response = await cognito.send(command);
      process.env.identityTableName = process.env.E2E_TABLE_NAME;
      if(response.AuthenticationResult.IdToken !== undefined || response.AuthenticationResult.IdToken !== ''){
        try{
          res = await axios.get(`${process.env.E2E_USER_API_URL}`, {
          headers: { "Authorization": `Bearer ${response.AuthenticationResult.IdToken}` }
        });
      }catch (err: any) {}
      }
    } catch (err: any) {console.log(err);}
    expect(res.status).toEqual(200);
    expect(res.data.message).toEqual('User Found');
    expect(res.data.data.cards[0].cardId).toEqual(userCardId);
    expect(res.data.data.cards[0].expires).not.toBe('0000000000000000');
    expect(res.data.data.cards[0].cardStatus).toEqual('PHYSICAL_CARD');
    expect(res.data.data.cards[0].datePosted).not.toBe('0000000000000000');

  });
});

