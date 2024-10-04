import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { OrganisationService } from '../organisationsService';
import { Logger } from '@aws-lambda-powertools/logger';

jest.mock('../../repositories/organisationsRepository');
jest.mock('@aws-lambda-powertools/logger');

describe('organisationService', () => {
  let mockRepository: jest.MockedObject<OrganisationsRepository>;
  let mockLogger: jest.MockedObject<Logger>;
  let organisationService: OrganisationService;

  beforeEach(() => {
    mockRepository = {
      getOrganisations: jest.fn(),
    } as unknown as jest.MockedObject<OrganisationsRepository>;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.MockedObject<Logger>;
    organisationService = new OrganisationService(mockRepository, mockLogger);
  });

  test('should return data when getOrgs is called successfully', async () => {
    const mockData = [
      {
        organisationId: '123',
        name: 'Highway Traffic Officers',
        type: 'HIGHWAYS',
        active: true,
        volunteer: true,
        retired: false,
        idRequirements: 'idRequirements',
        trustedDomains: ['string1', 'string2'],
      },
    ] as never;

    mockRepository.getOrganisations.mockResolvedValue(mockData);

    const result = await organisationService.getOrganisations({
      brand: 'BLC_UK',
      organisationId: '123',
    });

    expect(result).toEqual(mockData);
    expect(mockRepository.getOrganisations).toHaveBeenCalledWith({
      brand: 'BLC_UK',
      organisationId: '123',
    });
  });

  test('should log an error and throw when get fails', async () => {
    const errorMessage = 'Error fetching organisations';
    mockRepository.getOrganisations.mockRejectedValue(new Error(errorMessage));
    try {
      await expect(
        organisationService.getOrganisations({ brand: 'BLC_UK', organisationId: '123' }),
      ).rejects.toThrow('Error fetching organisations');
    } catch (error) {
      expect(mockLogger.error).toHaveBeenCalled();
      expect((error as Error).message).toEqual(errorMessage);
    }
  });
});
