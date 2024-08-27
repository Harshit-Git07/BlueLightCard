import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CardStatusHelper } from './cardStatus';

describe('CardStatusHelper', () => {
  let logger: ILogger;
  let cardStatusHelper: CardStatusHelper;

  beforeEach(() => {
    logger = createSilentLogger();
    process.env.IDENTITY_API_URL = 'https://test-endpoint';
    cardStatusHelper = new CardStatusHelper(logger);
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.IDENTITY_API_URL;
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
    expect(logger.warn).toHaveBeenCalledWith({
      message: 'Warning User cannot redeem offer',
    });
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
      error: TypeError("Cannot read properties of undefined (reading 'canRedeemOffer')"),
      message: 'Error fetching user data from the User Identity Service',
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
      error: TypeError("Cannot read properties of null (reading 'canRedeemOffer')"),
      message: 'Error fetching user data from the User Identity Service',
    });
  });

  it('should return false and log an error if an exception is thrown during fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch failed')));

    const result = await cardStatusHelper.validateCardStatus('test-token');
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith({
      error: Error('Fetch failed'),
      message: 'Error fetching user data from the User Identity Service',
    });
  });
});
