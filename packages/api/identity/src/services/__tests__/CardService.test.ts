import { CardService } from '../CardService';
import { QueryCommandOutput, PutCommandOutput } from '@aws-sdk/lib-dynamodb';

class MockCardRepository {
  getUserCurrentCard = jest.fn();
  updateUsersCard = jest.fn();
}

describe('CardService', () => {
  let cardService: CardService;
  let mockRepository: MockCardRepository;
  const mockTableName = 'MockTable';
  const mockRegion = 'eu-west-2';

  beforeEach(() => {
    mockRepository = new MockCardRepository();
    cardService = new CardService(mockTableName, mockRegion);
    cardService['cardRepository'] = mockRepository as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('getUserCurrentCard', () => {
    it('should call getUserCurrentCard on repository with correct parameters', async () => {
      const mockEvent = {
        detail: {
          uuid: 'uuid',
          cardNumber: 'legacyCardId'
        }
      };
      
      const mockResponse: QueryCommandOutput = {
        $metadata: {},
        Items: [],
        Count: 1,
        ScannedCount: 1
      };
      mockRepository.getUserCurrentCard.mockResolvedValue(mockResponse);

      const result = await cardService.getUserCurrentCard(mockEvent);

      expect(mockRepository.getUserCurrentCard).toHaveBeenCalledWith('uuid', 'legacyCardId');
      expect(result).toBe(mockResponse);
    });
  });

  describe('updateUsersCard', () => {
    it('should call updateUsersCard on repository with correct parameters', async () => {
      const mockPrevious: QueryCommandOutput = {
        $metadata: {},
        Items: [],
        Count: 1,
        ScannedCount: 1
      };

      const mockEvent = {
        detail: {
          uuid: 'uuid',
          cardNumber: 'legacyCardId',
          expires: 'expires',
          posted: 'posted',
          cardStatus: 'cardStatus'
        }
      };
      
      const mockResponse: PutCommandOutput = {
        $metadata: {},
        Attributes: {}
      };
      
      mockRepository.updateUsersCard.mockResolvedValue(mockResponse);

      const result = await cardService.updateUsersCard(mockPrevious, mockEvent);

      expect(mockRepository.updateUsersCard).toHaveBeenCalledWith(
        mockPrevious,
        'expires',
        'posted',
        'uuid',
        'legacyCardId',
        'cardStatus'
      );
      expect(result).toBe(mockResponse);
    });
  });
});
