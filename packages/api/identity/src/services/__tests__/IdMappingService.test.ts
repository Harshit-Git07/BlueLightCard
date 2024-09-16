import { IdMappingRepository } from 'src/repositories/idMappingRepository';
import { IdMappingService, IIdMappingService } from '../IdMappingService';

const MockIdMappingRepository = IdMappingRepository as jest.Mock<IdMappingRepository>;

const idMappingService: IIdMappingService = new IdMappingService();

beforeEach(() => {
  jest.clearAllMocks();
});

const user: Record<string, string> = {
  uuid: 'someUuid',
  legacy_id: 'someLegacyId',
};

describe('findByLegacyId', () => {
  test('should return response from findByLegacyId ', async () => {
    jest.spyOn(MockIdMappingRepository.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    const result = await idMappingService.findByLegacyId('brand', 'legacyId');

    expect(result).toEqual(user);
  });

  test('should return null if findByLegacyId return no items', async () => {
    jest.spyOn(MockIdMappingRepository.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [],
      };
    });

    const result = await idMappingService.findByLegacyId('brand', 'legacyId');

    expect(result).toBeNull();
  });

  test('should return null if findByLegacyId return null items', async () => {
    jest.spyOn(MockIdMappingRepository.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: null,
      };
    });

    const result = await idMappingService.findByLegacyId('brand', 'legacyId');

    expect(result).toBeNull();
  });

  test('should call findByLegacyId', async () => {
    jest.spyOn(MockIdMappingRepository.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [],
      };
    });

    await idMappingService.findByLegacyId('brand', 'legacyId');

    expect(MockIdMappingRepository.prototype.findByLegacyId).toHaveBeenCalledTimes(1);
    expect(MockIdMappingRepository.prototype.findByLegacyId).toHaveBeenCalledWith(
      'brand',
      'legacyId',
    );
  });
});
