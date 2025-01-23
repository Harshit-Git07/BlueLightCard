import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { afterEach, describe, expect, test } from '@jest/globals';
import { UserRepository } from '../userRepository';
import { handler } from '../../user-management/getUserDataHandler';

const mockDynamoDB = mockClient(DynamoDBDocumentClient);
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn().mockReturnValue({ client_id: 1234, 'custom:blc_old_uuid': 'testUUID' }),
}));

describe('UserRepository', () => {
  const tableName = 'test-identity-user-table';
  beforeEach(() => {
    jest.clearAllMocks();
    mockDynamoDB.on(QueryCommand).resolves({
      Items: [
        {
          sk: 'BRAND#BLC_UK',
          legacy_id: 2853201,
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
        {
          sk: 'CARD#3470584',
          expires: '1758365897',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          posted: '1695220641',
          status: 'PHYSICAL_CARD',
        },
        {
          sk: 'COMPANYFOLLOWS#123',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          likeType: 'Like',
        },
        {
          email: 'rlimbu+work1@bluelightcard.co.uk',
          spare_email: 'rlimbu+work1@bluelightcard.co.uk',
          merged_uid: false,
          organisation: 'AMBU',
          employer_id: '0',
          gender: 'F',
          email_validated: 1,
          spare_email_validated: 1,
          mobile: '+447915507274',
          surname: 'limbu',
          ga_key: ' ',
          dob: null,
          merged_time: '0000000000000000',
          firstname: 'rubi',
          sk: 'PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec',
          employer: ' ',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
      ],
    });
  });

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb GET items call fails', async () => {
    mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));
    const repo = new UserRepository(tableName, 'dummy-region');
    await expect(repo.findItemsByUuid('1234')).rejects.toThrow('DynamoDB error');
  });

  test('DynamoDB is called and response is valid with 200 status when request is valid', async () => {
    const repo = new UserRepository(tableName, 'dummy-region');
    const result = await repo.findItemsByUuid('0000005');
    // Assert that the result is correct
    expect(result).toEqual({
      Items: [
        {
          sk: 'BRAND#BLC_UK',
          legacy_id: 2853201,
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
        {
          sk: 'CARD#3470584',
          expires: '1758365897',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          posted: '1695220641',
          status: 'PHYSICAL_CARD',
        },
        {
          sk: 'COMPANYFOLLOWS#123',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          likeType: 'Like',
        },
        {
          email: 'rlimbu+work1@bluelightcard.co.uk',
          spare_email: 'rlimbu+work1@bluelightcard.co.uk',
          merged_uid: false,
          organisation: 'AMBU',
          employer_id: '0',
          gender: 'F',
          email_validated: 1,
          spare_email_validated: 1,
          mobile: '+447915507274',
          surname: 'limbu',
          ga_key: ' ',
          dob: null,
          merged_time: '0000000000000000',
          firstname: 'rubi',
          sk: 'PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec',
          employer: ' ',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
      ],
    });
  });

  test('provided invalid response when DB result fails to map to zod object, 500 is returned', async () => {
    mockDynamoDB.on(QueryCommand).resolves({
      Items: [
        {
          pk: 'fakeId',
        },
      ],
    });
    const res = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: { Authorization: 'test' },
      },
      {},
    );

    expect(res).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error',
        error: 'error while fetching data from DB',
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  test('provided data with null for nullable fields, zod processes it correctly and 200 is returned with correct response body', async () => {
    mockDynamoDB.on(QueryCommand).resolves({
      Items: [
        {
          sk: 'BRAND#BLC_UK',
          legacy_id: 2853201,
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
        {
          sk: 'CARD#3470584',
          expires: '1758365897',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          posted: null,
          status: 'PHYSICAL_CARD',
        },
        {
          sk: 'COMPANYFOLLOWS#123',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          likeType: 'Like',
        },
        {
          spare_email: 'rlimbu+work1@bluelightcard.co.uk',
          merged_uid: null,
          organisation: 'AMBU',
          employer_id: '0',
          gender: null,
          email: 'rlimbu+work1@bluelightcard.co.uk',
          email_validated: 1,
          spare_email_validated: 1,
          mobile: null,
          surname: 'limbu',
          ga_key: ' ',
          dob: null,
          merged_time: null,
          firstname: 'rubi',
          sk: 'PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec',
          employer: ' ',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
      ],
    });
    const res = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: { Authorization: 'test' },
      },
      {},
    );
    expect(res).toEqual({
      statusCode: 200,
      body: '{"message":"User Found","data":{"profile":{"firstname":"rubi","surname":"limbu","organisation":"AMBU","dob":null,"gender":null,"mobile":null,"email":"rlimbu+work1@bluelightcard.co.uk","emailValidated":1,"spareEmail":"rlimbu+work1@bluelightcard.co.uk","spareEmailValidated":1,"twoFactorAuthentication":false},"cards":[{"cardId":"3470584","expires":"1758365897","cardStatus":"PHYSICAL_CARD","datePosted":null}],"companies_follows":[{"companyId":"123","likeType":"Like"}],"legacyId":2853201,"uuid":"068385bb-b370-4153-9474-51dd0bfac9dc","brand":"BLC_UK","canRedeemOffer":true}}',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  test('provided date is empty then 200 is returned with date being null and correct response body', async () => {
    mockDynamoDB.on(QueryCommand).resolves({
      Items: [
        {
          sk: 'BRAND#BLC_UK',
          legacy_id: 2853201,
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
        {
          sk: 'CARD#3470584',
          expires: '1758365897',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          posted: null,
          status: 'PHYSICAL_CARD',
        },
        {
          sk: 'COMPANYFOLLOWS#123',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
          likeType: 'Like',
        },
        {
          spare_email: 'rlimbu+work1@bluelightcard.co.uk',
          merged_uid: null,
          organisation: 'AMBU',
          employer_id: '0',
          gender: null,
          email: 'rlimbu+work1@bluelightcard.co.uk',
          email_validated: 1,
          spare_email_validated: 1,
          mobile: null,
          surname: 'limbu',
          ga_key: ' ',
          dob: ' ',
          merged_time: null,
          firstname: 'rubi',
          sk: 'PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec',
          employer: ' ',
          pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
        },
      ],
    });
    const res = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: { Authorization: 'test' },
      },
      {},
    );
    expect(res).toEqual({
      statusCode: 200,
      body: '{"message":"User Found","data":{"profile":{"firstname":"rubi","surname":"limbu","organisation":"AMBU","dob":null,"gender":null,"mobile":null,"email":"rlimbu+work1@bluelightcard.co.uk","emailValidated":1,"spareEmail":"rlimbu+work1@bluelightcard.co.uk","spareEmailValidated":1,"twoFactorAuthentication":false},"cards":[{"cardId":"3470584","expires":"1758365897","cardStatus":"PHYSICAL_CARD","datePosted":null}],"companies_follows":[{"companyId":"123","likeType":"Like"}],"legacyId":2853201,"uuid":"068385bb-b370-4153-9474-51dd0bfac9dc","brand":"BLC_UK","canRedeemOffer":true}}',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  // new test for canRedeemOffer key

  test('No card present', async () => {
    const cards: any = [];
    await performTest(cards, false);
  });

  test('single card present with ID_APPROVED', async () => {
    const cards = [
      {
        cardStatus: 'ID_APPROVED',
        expires: '1758365897',
      },
    ];
    await performTest(cards, false);
  });

  test('single card present with PHYSICAL_CARD', async () => {
    const cards = [
      {
        cardStatus: 'PHYSICAL_CARD',
        expires: '1758365897',
      },
    ];
    await performTest(cards, true);
  });

  test('single card present with USER_BATCHED', async () => {
    const cards = [
      {
        cardStatus: 'USER_BATCHED',
        expires: '1758365897',
      },
    ];
    await performTest(cards, true);
  });

  test('single card present with ADDED_TO_BATCH', async () => {
    const cards = [
      {
        cardStatus: 'USER_BATCHED',
        expires: '1758365897',
      },
    ];
    await performTest(cards, true);
  });

  test('single card present with ADDED_TO_BATCH', async () => {
    const cards = [
      {
        cardStatus: 'CARD_EXPIRED',
        expires: '1720669137', // any date in past
      },
    ];
    await performTest(cards, false);
  });

  test('Multiple cards grace period check, date should be within last 30 days', async () => {
    const now = new Date();
    const dateWithinLast30Days = new Date(now.setDate(now.getDate() - 20));
    const epochTimeInMilliseconds = dateWithinLast30Days.getTime().toString();
    const cards = [
      {
        cardId: '3470584',
        cardStatus: 'CARD_EXPIRED',
        expires: `${epochTimeInMilliseconds}`,
      },
      {
        cardId: '3470585',
        cardStatus: 'AWAITING_ID_APPROVAL',
        expires: '1758365897',
      },
    ];
    await performTest(cards, true);
  });

  test('Multiple cards grace period over i.e expiry date of expired card > last 30 days', async () => {
    const cards = [
      {
        cardId: '3470584',
        cardStatus: 'CARD_EXPIRED',
        expires: `1720669137`,
      },
      {
        cardId: '3470585',
        cardStatus: 'AWAITING_ID_APPROVAL',
        expires: '1758365897',
      },
    ];
    await performTest(cards, false);
  });

  test('Multiple cards, it should return response basis on latest card', async () => {
    const cards = [
      {
        cardId: '3470584',
        cardStatus: 'AWAITING_ID_APPROVAL',
        expires: `1758365897`,
      },
      {
        cardId: '3470585',
        cardStatus: 'PHYSICAL_CARD',
        expires: '1758365897',
      },
    ];
    await performTest(cards, true);
  });
});

// Helper function to create mock items
// function createMockItems(cardStatus: string, expires: string) {
function createMockItems(cardDetails: any) {
  let cards = [];
  for (const cardDetail of cardDetails) {
    cards.push({
      sk: cardDetail.cardId ? `CARD#${cardDetail.cardId}` : `CARD#3470584`,
      expires: cardDetail.expires,
      pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
      posted: null,
      status: cardDetail.cardStatus,
    });
  }
  return [
    {
      sk: 'BRAND#BLC_UK',
      legacy_id: 2853201,
      pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
    },
    ...cards,
    {
      sk: 'COMPANYFOLLOWS#123',
      pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
      likeType: 'Like',
    },
    {
      spare_email: 'rlimbu+work1@bluelightcard.co.uk',
      merged_uid: null,
      organisation: 'AMBU',
      employer_id: '0',
      gender: null,
      email: 'rlimbu+work1@bluelightcard.co.uk',
      email_validated: 1,
      spare_email_validated: 1,
      mobile: null,
      surname: 'limbu',
      ga_key: ' ',
      dob: ' ',
      merged_time: null,
      firstname: 'rubi',
      sk: 'PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec',
      employer: ' ',
      pk: 'MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc',
    },
  ];
}

// Helper function to perform test
async function performTest(cards: any, expectedCanRedeemOffer: boolean) {
  mockDynamoDB.on(QueryCommand).resolves({
    Items: createMockItems(cards),
  });
  const res = await handler(
    // @ts-expect-error - We're not testing the event object
    {
      headers: { Authorization: 'test' },
    },
    {},
  );
  const resBody = JSON.parse(res.body as string);
  expect(resBody.data.canRedeemOffer).toBe(expectedCanRedeemOffer);
}
