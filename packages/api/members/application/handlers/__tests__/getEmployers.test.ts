import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { EmployersService } from '../../services/employersService';
import { APIError } from '../../models/APIError';
import { EmployerModel } from '../../models/employerModel';
import { APIErrorCode } from '../../enums/APIErrorCode';

jest.mock('../../../../core/src/utils/logger/lambdaLogger');
jest.mock('../../repositories/employersRepository');
jest.mock('../../services/employersService');

const mockGetEmployers = jest.fn();
EmployersService.prototype.getEmployers = mockGetEmployers;

const mockMissingParamsError = {
  statusCode: 400,
  body: JSON.stringify({
    message: 'Error: Missing required query parameters',
    errors: [
      new APIError(
        APIErrorCode.MISSING_REQUIRED_PARAMETER,
        'organisationId',
        'organisationId is required',
      ),
      new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
    ],
  }),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

describe('Get Employers Lambda Handler', () => {
  let handler: (event: APIGatewayProxyEvent, context: Context) => Promise<any>;
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeAll(async () => {
    try {
      const employerModule = await import('../employers/getEmployers');
      handler = employerModule.handler;
    } catch (error) {
      console.log(`Failed to import the handler module: ${error}`);
    }
  });

  beforeEach(() => {
    mockContext = {} as Context;
    jest.clearAllMocks();
  });

  it('should return a list of employers', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK', organisationId: '123', employerId: '456' },
    } as unknown as APIGatewayProxyEvent;

    const employerList = [
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
    ];

    const errorSet: APIError[] = [];

    mockGetEmployers.mockResolvedValue({ employerList, errorSet });
    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Employers successfully retrieved',
      employers: employerList,
    });
  });

  it('should return a list of employers if employerId is missing', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK', organisationId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const employerList = [
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
    ];

    const errorSet: APIError[] = [];

    mockGetEmployers.mockResolvedValue({ employerList, errorSet });
    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Employers successfully retrieved',
      employers: employerList,
    });
  });

  it('should return array of errors if brand is missing from pathParameters', async () => {
    mockEvent = {
      pathParameters: { organisationId: '123' },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response).toEqual(mockMissingParamsError);
    expect(mockGetEmployers).not.toHaveBeenCalled();
  });

  it('should return null if organisationId is missing from pathParameters', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response).toEqual(mockMissingParamsError);
    expect(mockGetEmployers).not.toHaveBeenCalled();
  });

  it('should return a 404 if employerService cant find organisation', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK', organisationId: '123', employerId: '456' },
    } as unknown as APIGatewayProxyEvent;

    const mockOrgNotFound = {
      statusCode: 404,
      body: JSON.stringify({ message: 'Requested employer list not found for organisation' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const employerList: EmployerModel[] = [];
    const errorSet: APIError[] = [
      new APIError(
        APIErrorCode.RESOURCE_NOT_FOUND,
        'getEmployers',
        'No organisation found for brand: BLC_UK with ID: 123.',
      ),
    ];

    mockGetEmployers.mockResolvedValue({ employerList, errorSet });

    const response = await handler(mockEvent, mockContext);
    expect(response).toEqual(mockOrgNotFound);
    expect(mockGetEmployers).toHaveBeenCalled();
  });

  it('should return a 404 if employerService returns empty array and employerId is set', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK', organisationId: '123', employerId: '456' },
    } as unknown as APIGatewayProxyEvent;

    const mockEmployerNotFound = {
      statusCode: 404,
      body: JSON.stringify({ message: 'Requested employer not found' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const employerList: EmployerModel[] = [];
    const errorSet: APIError[] = [];

    mockGetEmployers.mockResolvedValue({ employerList, errorSet });

    const response = await handler(mockEvent, mockContext);
    expect(response).toEqual(mockEmployerNotFound);
    expect(mockGetEmployers).toHaveBeenCalled();
  });

  it('should return a 500 if employersService throws an error', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK', organisationId: '123', employerId: '456' },
    } as unknown as APIGatewayProxyEvent;

    const mockError = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error occurred processing request' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    const employerList: EmployerModel[] = [];
    const errorSet: APIError[] = [
      new APIError(
        APIErrorCode.GENERIC_ERROR,
        'getEmployers',
        'Error fetching employers for brand: BLC_UK with ID: 123.',
      ),
    ];

    mockGetEmployers.mockResolvedValue({ employerList, errorSet });

    const response = await handler(mockEvent, mockContext);
    expect(response).toEqual(mockError);
    expect(mockGetEmployers).toHaveBeenCalled();
  });
});
