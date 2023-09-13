import { handler } from '../banner';
import { Logger } from '@aws-lambda-powertools/logger';
import { BannerHandler } from '../banner/bannerHandler';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../banner/bannerHandler');

describe('Banner Lambda Handler', () => {
  let mockHandleBannerCreated: jest.Mock;
  let mockHandleBannerUpdated: jest.Mock;
  let mockHandleBannerDeleted: jest.Mock;

  beforeEach(() => {
    (Logger as jest.MockedClass<typeof Logger>).mockClear();
    (BannerHandler as jest.MockedClass<typeof BannerHandler>).mockClear();

    mockHandleBannerCreated = jest.fn();
    mockHandleBannerUpdated = jest.fn();
    mockHandleBannerDeleted = jest.fn();

    (BannerHandler as jest.MockedClass<typeof BannerHandler>).mockImplementation(() => {
      return {
        handleBannerCreated: mockHandleBannerCreated,
        handleBannerUpdated: mockHandleBannerUpdated,
        handleBannerDeleted: mockHandleBannerDeleted,
      } as any;
    });
  });

  test('should call handleBannerCreated when event source is banner.created', async () => {
    const event = {
      source: 'banner.created',
    };

    await handler(event);

    expect(BannerHandler).toHaveBeenCalledTimes(1);
    expect(mockHandleBannerCreated).toHaveBeenCalledTimes(1);
    expect(mockHandleBannerUpdated).toHaveBeenCalledTimes(0);
    expect(mockHandleBannerDeleted).toHaveBeenCalledTimes(0);
  });

  test('should call handleBannerUpdated when event source is banner.updated', async () => {
    const event = {
      source: 'banner.updated',
    };

    await handler(event);

    expect(BannerHandler).toHaveBeenCalledTimes(1);
    expect(mockHandleBannerCreated).toHaveBeenCalledTimes(0);
    expect(mockHandleBannerUpdated).toHaveBeenCalledTimes(1);
    expect(mockHandleBannerDeleted).toHaveBeenCalledTimes(0);
  });

  test('should call handleBannerDeleted when event source is banner.deleted', async () => {
    const event = {
      source: 'banner.deleted',
    };

    await handler(event);

    expect(BannerHandler).toHaveBeenCalledTimes(1);
    expect(mockHandleBannerCreated).toHaveBeenCalledTimes(0);
    expect(mockHandleBannerUpdated).toHaveBeenCalledTimes(0);
    expect(mockHandleBannerDeleted).toHaveBeenCalledTimes(1);
  });

  test('should throw error when event source is invalid', async () => {
    const event = {
      source: 'invalid',
    };

    await expect(handler(event)).rejects.toThrow('Invalid event source');
  });
});
