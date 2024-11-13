import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { OrganisationService } from '../organisationsService';
import { LambdaLogger as Logger } from '@blc-mono/core/src/utils/logger/lambdaLogger';

jest.mock('../../repositories/organisationsRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');

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

  test('should return data when getOrganisations is called successfully', async () => {
    const mockData = [
      {
        organisationId: '0001',
        name: 'Highway Traffic Officers',
        type: 'HIGHWAYS',
        active: true,
        volunteer: false,
        idRequirements: 'idRequirement',
        retired: false,
        trustedDomains: [],
      },
    ] as never;

    mockRepository.getOrganisations.mockResolvedValue(mockData);

    const { organisationList, errorSet } = await organisationService.getOrganisations({
      brand: 'BLC_UK',
      organisationId: '123',
    });

    const expectedErrorSet: APIError[] = [];

    expect(organisationList).toEqual(mockData);
    expect(errorSet).toEqual(expectedErrorSet);
    expect(mockRepository.getOrganisations).toHaveBeenCalledWith({
      brand: 'BLC_UK',
      organisationId: '123',
    });
  });

  test('should log an error and return empty list when getOrganisations fails', async () => {
    const errorMessage = 'Error fetching organisations';
    mockRepository.getOrganisations.mockRejectedValue(new Error(errorMessage));

    const { organisationList, errorSet } = await organisationService.getOrganisations({
      brand: 'BLC_UK',
      organisationId: '123',
    });
    const expectedErrorSet: APIError[] = [
      new APIError(APIErrorCode.GENERIC_ERROR, 'getOrganisations', 'Error fetching organisations'),
    ];

    expect(organisationList).toEqual([]);
    expect(errorSet).toEqual(expectedErrorSet);
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
