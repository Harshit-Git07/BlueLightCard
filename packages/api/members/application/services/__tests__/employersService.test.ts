import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';
import { EmployersRepository } from '../../repositories/employersRepository';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { EmployersService } from '../employersService';
import { LambdaLogger as Logger } from '../../../../core/src/utils/logger/lambdaLogger';

jest.mock('../../repositories/organisationsRepository.ts');
jest.mock('../../repositories/employersRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');

describe('employersService', () => {
  let mockOrganisationsRepository: jest.MockedObject<OrganisationsRepository>;
  let mockEmployerRepository: jest.MockedObject<EmployersRepository>;
  let mockLogger: jest.MockedObject<Logger>;
  let employersService: EmployersService;

  beforeEach(() => {
    mockOrganisationsRepository = {
      getOrganisations: jest.fn(),
    } as unknown as jest.MockedObject<OrganisationsRepository>;

    mockEmployerRepository = {
      getEmployers: jest.fn(),
    } as unknown as jest.MockedObject<EmployersRepository>;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.MockedObject<Logger>;

    employersService = new EmployersService(
      mockEmployerRepository,
      mockOrganisationsRepository,
      mockLogger,
    );
  });

  it('should return a list of employers when getEmployers is called successfully', async () => {
    const mockOrganisationData = [
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
    ];
    const mockData = [
      {
        employerId: '123',
        name: 'HM Coastguard',
        type: 'HIGHWAYS',
        active: true,
        volunteer: false,
        idRequirements: '',
        retired: false,
        trustedDomains: [],
      },
    ] as never;
    mockOrganisationsRepository.getOrganisations.mockResolvedValue(mockOrganisationData);
    mockEmployerRepository.getEmployers.mockResolvedValue(mockData);

    const { employerList, errorSet } = await employersService.getEmployers({
      brand: 'BLC_UK',
      organisationId: '123',
      employerId: '123',
    });

    const expectedErrorSet: APIError[] = [];

    expect(employerList).toEqual(mockData);
    expect(errorSet).toEqual(expectedErrorSet);
    expect(mockEmployerRepository.getEmployers).toHaveBeenCalledWith({
      brand: 'BLC_UK',
      organisationId: '123',
      employerId: '123',
    });
  });

  it('should return an empty array and an error when getOrganisations returns an empty array', async () => {
    const mockData = [
      {
        employerId: '123',
        name: 'HM Coastguard',
        type: 'HIGHWAYS',
        active: true,
        volunteer: false,
        idRequirements: '',
        retired: false,
        trustedDomains: [],
      },
    ] as never;

    mockOrganisationsRepository.getOrganisations.mockResolvedValue([]);
    mockEmployerRepository.getEmployers.mockResolvedValue(mockData);

    const { employerList, errorSet } = await employersService.getEmployers({
      brand: 'BLC_UK',
      organisationId: '123',
      employerId: '123',
    });
    const expectedErrorSet: APIError[] = [
      new APIError(
        APIErrorCode.RESOURCE_NOT_FOUND,
        'getEmployers',
        'No organisation found for brand: BLC_UK with ID: 123.',
      ),
    ];

    expect(employerList).toEqual([]);
    expect(errorSet).toEqual(expectedErrorSet);
    expect(mockEmployerRepository.getEmployers).not.toHaveBeenCalled();
  });

  it('should log an error and throw when getEmployers fails', async () => {
    const mockOrganisationData = [
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
    ];
    const errorMessage = 'Error fetching employers';

    mockOrganisationsRepository.getOrganisations.mockResolvedValue(mockOrganisationData);
    mockEmployerRepository.getEmployers.mockRejectedValue(new Error(errorMessage));

    const { employerList, errorSet } = await employersService.getEmployers({
      brand: 'BLC_UK',
      organisationId: '123',
      employerId: '123',
    });
    const expectedErrorSet: APIError[] = [
      new APIError(
        APIErrorCode.GENERIC_ERROR,
        'getEmployers',
        'Error fetching employers for brand: BLC_UK with ID: 123.',
      ),
    ];

    expect(employerList).toEqual([]);
    expect(errorSet).toEqual(expectedErrorSet);
    expect(mockEmployerRepository.getEmployers).toHaveBeenCalled();
  });

  it('should log an error and throw when getOrganisations fails', async () => {
    const errorMessage = 'Error fetching employers';

    mockOrganisationsRepository.getOrganisations.mockRejectedValue(new Error(errorMessage));

    const { employerList, errorSet } = await employersService.getEmployers({
      brand: 'BLC_UK',
      organisationId: '123',
      employerId: '123',
    });
    const expectedErrorSet: APIError[] = [
      new APIError(
        APIErrorCode.GENERIC_ERROR,
        'getEmployers',
        'Error fetching employers for brand: BLC_UK with ID: 123.',
      ),
    ];

    expect(employerList).toEqual([]);
    expect(errorSet).toEqual(expectedErrorSet);
    expect(mockEmployerRepository.getEmployers).not.toHaveBeenCalled();
  });
});
