import MarketingService from '../../services/marketingService';
import BrazeClient from '../../braze/brazeClient';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../braze/brazeClient');

describe('MarketingService', () => {
  const memberId = uuidv4();
  const attributes = ['attr1', 'attr2'];
  const environment = 'web';
  let brazeClientMock: jest.Mocked<BrazeClient>;
  let marketingService: MarketingService;

  beforeEach(() => {
    brazeClientMock = new BrazeClient() as jest.Mocked<BrazeClient>;
    marketingService = new MarketingService(brazeClientMock);
  });

  describe('getAttributes', () => {
    it('should throw an error if fetching attributes fails', async () => {
      brazeClientMock.getAttributes = jest
        .fn()
        .mockRejectedValue(new Error('Failed to fetch attributes'));
      await expect(marketingService.getAttributes(memberId, attributes)).rejects.toThrow(
        'Failed to fetch attributes',
      );
    });

    it('should return attributes if fetching is successful', async () => {
      const mockAttributes = { attr1: 'value1', attr2: 'value2' };
      brazeClientMock.getAttributes = jest.fn().mockResolvedValue(mockAttributes);
      await expect(marketingService.getAttributes(memberId, attributes)).resolves.toEqual(
        mockAttributes,
      );
    });
  });

  describe('getPreferences', () => {
    it('should throw an error if fetching preferences fails', async () => {
      brazeClientMock.getMarketingPreferences = jest
        .fn()
        .mockRejectedValue(new Error('Failed to fetch preferences'));
      await expect(marketingService.getPreferences(memberId, environment)).rejects.toThrow(
        'Failed to fetch preferences',
      );
    });

    it('should return preferences if fetching is successful', async () => {
      const mockPreferences = { preference1: true, preference2: false };
      brazeClientMock.getMarketingPreferences = jest.fn().mockResolvedValue(mockPreferences);
      await expect(marketingService.getPreferences(memberId, environment)).resolves.toEqual(
        mockPreferences,
      );
    });
  });
});
