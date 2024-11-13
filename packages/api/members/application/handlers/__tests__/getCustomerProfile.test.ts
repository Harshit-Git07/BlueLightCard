import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import { MemberProfileCustomerGetService } from '../../services/memberProfileCustomerGetService';
import { Response } from '../../utils/restResponse/response';
import { APIError } from '../../models/APIError';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { profile } from 'console';

jest.mock('../../repositories/memberProfileCustomerGetRepository');
jest.mock('../../services/memberProfileCustomerGetService');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');

const mockGetCustomerProfile = jest.fn();
MemberProfileCustomerGetService.prototype.getCustomerProfile = mockGetCustomerProfile;

describe('Customer Profile Handler', () => {
  let handler: (event: APIGatewayProxyEvent) => Promise<any>;
  let mockEvent: APIGatewayProxyEvent;

  beforeAll(async () => {
    try {
      const customerProfileModule = await import('../profile/getCustomerProfile');
      handler = customerProfileModule.handler;
    } catch (error) {
      console.log(`Failed to import the handler module: ${error}`);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a successful response when customer profile is retrieved', async () => {
    const mockCustomerProfile = {
      profile: {
        firstName: 'fname',
        lastName: 'lname',
        dateOfBirth: '2025-12-31',
        gender: 'gender',
        phoneNumber: 'number',
        emailAddress: 'email',
        county: 'county',
        employmentType: 'type',
        organisationId: 'id',
        employerId: 'id',
        jobTitle: 'title',
        reference: 'ref',
      },
      card: {
        cardNumber: '1234',
        cardExpiry: new Date(1726097583),
        cardStatus: 'cardStatus',
        cardPaymentStatus: 'cardStatus',
      },
      applications: [],
    };

    mockGetCustomerProfile.mockResolvedValue({
      customerProfile: mockCustomerProfile,
      errorSet: [],
    });

    mockEvent = {
      pathParameters: { brand: 'BLC_UK', memberUuid: '12345', profileUuid: '56789' },
    } as unknown as APIGatewayEvent;

    const response = await handler(mockEvent);

    expect(mockGetCustomerProfile).toHaveBeenCalledWith({
      brand: 'BLC_UK',
      memberUuid: '12345',
      profileUuid: '56789',
    });

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Customer successfully retrieved',
        customerProfile: mockCustomerProfile,
      }),
    });
  });

  it('should return an error response when brand or memberUuid is missing', async () => {
    const expectedResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Error: Missing required query parameters',
        errors: [
          new APIError(
            APIErrorCode.MISSING_REQUIRED_PARAMETER,
            'memberUuid',
            'memberUuid is required',
          ),
          new APIError(
            APIErrorCode.MISSING_REQUIRED_PARAMETER,
            'profileUuid',
            'profileUuid is required',
          ),
          new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
        ],
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
    } as unknown as APIGatewayEvent;

    const response = await handler(mockEvent);

    expect(response).toEqual(expectedResponse);
    expect(mockGetCustomerProfile).not.toHaveBeenCalled();
  });

  it('should return an error response when errorSet contains generic errors', async () => {
    const mockEvent = {
      pathParameters: { brand: 'BLC_UK', memberUuid: '12345', profileUuid: '56789' },
    } as unknown as APIGatewayEvent;

    mockGetCustomerProfile.mockResolvedValue({
      customerProfile: {},
      errorSet: [new APIError(APIErrorCode.GENERIC_ERROR, 'Test Error', 'Test Error')],
    });
    const expectedError = Response.Error(new Error('Error occurred while fetching employers'));

    const response = await handler(mockEvent);

    expect(mockGetCustomerProfile).toHaveBeenCalledWith({
      brand: 'BLC_UK',
      memberUuid: '12345',
      profileUuid: '56789',
    });

    expect(response).toEqual(expectedError);
  });

  it('should return a not found response when errorSet contains not found error', async () => {
    const mockEvent = {
      pathParameters: { brand: 'BLC_UK', memberUuid: '12345', profileUuid: '56789' },
    } as unknown as APIGatewayEvent;

    mockGetCustomerProfile.mockResolvedValue({
      customerProfile: {},
      errorSet: [new APIError(APIErrorCode.RESOURCE_NOT_FOUND, 'Test Error', 'Test Error')],
    });
    const expectedError = Response.NotFound({ message: 'Member profile not found' });

    const response = await handler(mockEvent);

    expect(mockGetCustomerProfile).toHaveBeenCalledWith({
      brand: 'BLC_UK',
      memberUuid: '12345',
      profileUuid: '56789',
    });

    expect(response).toEqual(expectedError);
  });
});
