import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CardStatusHelper } from './cardStatus';

describe('CardStatusHelper', () => {
  let logger: ILogger;
  let cardStatusHelper: CardStatusHelper;

  beforeEach(() => {
    logger = createSilentLogger();
    process.env.USER_IDENTITY_ENDPOINT = 'https://test-endpoint';
    cardStatusHelper = new CardStatusHelper(logger);
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.USER_IDENTITY_ENDPOINT;
  });

  it('should return true if the user can redeem offer', async () => {
    const mockUserApiResponse = {
      message: 'User Found',
      data: {
        canRedeemOffer: true,
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserApiResponse),
      } as Response),
    );

    const result = await cardStatusHelper.validateCardStatus('test-token');
    expect(result).toBe(true);
  });

  it('should return false if the user cannot redeem offer', async () => {
    const mockUserApiResponse = {
      message: 'User Found',
      data: {
        canRedeemOffer: false,
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserApiResponse),
      } as Response),
    );

    const result = await cardStatusHelper.validateCardStatus('test-token');
    expect(result).toBe(false);
  });

  it('should return false and log an error if the response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      } as Response),
    );

    const result = await cardStatusHelper.validateCardStatus('test-token');
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith({
      message: 'fetch failed for user api',
    });
  });

  it('should return false and log an error if there is no data and a message is provided', async () => {
    const mockUserApiResponse = {
      message: 'Some error occurred',
      data: null,
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserApiResponse),
      } as Response),
    );

    const result = await cardStatusHelper.validateCardStatus('test-token');
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith({
      message: 'Error fetching user data from user identity service',
      error: 'Some error occurred',
    });
  });

  it('should return false and log an error if an exception is thrown during fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch failed')));

    const result = await cardStatusHelper.validateCardStatus('test-token');
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith({
      message: 'Error fetching user data from user identity service',
    });
  });
});
