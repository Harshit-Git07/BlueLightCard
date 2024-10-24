import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { OrganisationService } from '../../services/organisationsService';
import { APIError } from '../../models/APIError';
import { OrganisationModel } from '../../models/organisationModel';
import { APIErrorCode } from '../../enums/APIErrorCode';

jest.mock('../../../../core/src/utils/logger/lambdaLogger');
jest.mock('../../repositories/organisationsRepository');
jest.mock('../../services/organisationsService');

const mockGetOrgs = jest.fn();
OrganisationService.prototype.getOrganisations = mockGetOrgs;

describe('Get Organisations Lambda Handler', () => {
  let handler: (event: APIGatewayProxyEvent, context: Context) => Promise<any>;
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeAll(async () => {
    const orgModule = await import('../organisations/getOrganisations');
    handler = orgModule.handler;
  });

  beforeEach(() => {
    mockContext = {} as Context;
    jest.clearAllMocks();
  });

  it('should return a list of organisations', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
    } as unknown as APIGatewayProxyEvent;

    const organisationList = [
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

    const errorSet: APIError[] = [];

    mockGetOrgs.mockResolvedValue({ organisationList, errorSet });
    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Organisation(s) successfully retrieved',
      organisations: organisationList,
    });
  });

  it('should return a 400 if brand is missing from pathParameters', async () => {
    const mockMissingParamsError = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error: Missing required query parameters',
        errors: [
          new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
        ],
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    mockEvent = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response).toEqual(mockMissingParamsError);
    expect(mockGetOrgs).not.toHaveBeenCalled();
  });

  it('should return a 500 if orgService throws an error', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
    } as unknown as APIGatewayProxyEvent;

    const mockError = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error',
        error: 'Error occurred while fetching organisations',
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const organisationList: OrganisationModel[] = [];
    const errorSet: APIError[] = [
      new APIError(
        APIErrorCode.RESOURCE_NOT_FOUND,
        'getOrganisations',
        'Error fetching organisations',
      ),
    ];
    mockGetOrgs.mockResolvedValue({ organisationList, errorSet });

    const response = await handler(mockEvent, mockContext);
    expect(response).toEqual(mockError);
    expect(mockGetOrgs).toHaveBeenCalled();
  });

  it('should return a 404 if orgList is empty and organisation id is set', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK', organisationId: '1234' },
    } as unknown as APIGatewayProxyEvent;

    const mockNotFound = {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Requested organisation not found',
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const organisationList: OrganisationModel[] = [];
    const errorSet: APIError[] = [];

    mockGetOrgs.mockResolvedValue({ organisationList, errorSet });

    const response = await handler(mockEvent, mockContext);
    expect(response).toEqual(mockNotFound);
    expect(mockGetOrgs).toHaveBeenCalled();
  });
});
