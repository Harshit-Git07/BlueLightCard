import { describe, expect, test } from '@jest/globals';
import { UserService } from '../../services/UserService';
import { handler } from '../getUserDataHandler';

jest.mock('jwt-decode', () => () => ({ client_id: 1234, 'custom:blc_old_uuid': 'testUUID' }));
jest.mock('../../services/UserService');

describe('User Profile, Brand and Card data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if user details are null', async () => {
    jest.spyOn(UserService.prototype, 'findUserDetails').mockResolvedValue(null);

    const result = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: { Authorization: 'test' },
      },
      {},
    );

    expect(result).toEqual({
      statusCode: 404,
      body: JSON.stringify({ message: 'User not found' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  it('should return 200 if user details are found', async () => {
    const expectedUserDetails = {
      canRedeemOffer: true,
      profile: {},
      cards: [
        {
          cardId: 'some-card-id',
          expires: 'some-expires-date',
          cardPrefix: 'some-card-prefix',
          cardStatus: 'AWAITING_ID_APPROVAL',
          datePosted: 'some-date-posted',
        },
      ],
      companies_follows: [],
    };

    jest.spyOn(UserService.prototype, 'findUserDetails').mockResolvedValue({
      canRedeemOffer: true,
      profile: {},
      cards: [
        {
          cardId: 'some-card-id',
          expires: 'some-expires-date',
          cardPrefix: 'some-card-prefix',
          cardStatus: 'AWAITING_ID_APPROVAL',
          datePosted: 'some-date-posted',
        },
      ],
      companies_follows: [],
    });
    const result = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: { Authorization: 'test' },
      },
      {},
    );

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'User Found', data: expectedUserDetails }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  it('should return 500 if an error occurs', async () => {
    jest.spyOn(UserService.prototype, 'findUserDetails').mockRejectedValue(new Error('some-error'));

    const result = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: { Authorization: 'test' },
      },
      {},
    );

    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'Error', error: 'some-error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });
});
