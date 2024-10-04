import { APIGatewayProxyEvent } from 'aws-lambda';
import { Context } from 'vm';
import { OrganisationService } from '../../services/organisationsService';

jest.mock('@aws-lambda-powertools/logger');
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

    const orgs = [
      {
        orgId: '123',
        orgName: 'Highway Traffic Officers',
        orgType: 'HIGHWAYS',
        ative: true,
        volunteers: true,
        retired: false,
        idRequirements: [],
        trustedDomains: [],
      },
    ];

    mockGetOrgs.mockResolvedValue(orgs);
    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Organisation(s) successfully retrieved',
      organisations: orgs,
    });
  });

  it('should return a 400 if brand is missing from pathParameters', async () => {
    mockEvent = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response).toEqual(null);
    expect(mockGetOrgs).not.toHaveBeenCalled();
  });

  it('should return a 500 if orgService throws an error', async () => {
    const errorMessage = 'Error fetching organisations';
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
    } as unknown as APIGatewayProxyEvent;

    mockGetOrgs.mockRejectedValueOnce(new Error(errorMessage));

    const response = await handler(mockEvent, mockContext);
    expect(response).toEqual(null);
    expect(mockGetOrgs).toHaveBeenCalled();
  });
});
