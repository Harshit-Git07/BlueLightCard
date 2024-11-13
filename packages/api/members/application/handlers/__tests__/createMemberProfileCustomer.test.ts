import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as LambdaContext } from 'aws-lambda';
import { memberProfileCustomerCreateService } from '../../services/memberProfileCustomerCreateService';
import { CreateProfilePayload } from '../../types/memberProfilesTypes';

jest.mock('../../../../core/src/utils/logger/lambdaLogger');
jest.mock('../../repositories/memberProfileCustomerCreateRepository');
jest.mock('../../services/memberProfileCustomerCreateService');

const mockCreateCustomerProfiles = jest.fn();
memberProfileCustomerCreateService.prototype.createCustomerProfiles = mockCreateCustomerProfiles;

describe('Create Profile Lambda Handler', () => {
  let handler: (
    event: APIGatewayProxyEvent,
    context: LambdaContext,
  ) => Promise<APIGatewayProxyResult>;
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: LambdaContext;
  const body: CreateProfilePayload = {
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john.doe@example.com',
    dateOfBirth: '01/01/2000',
  };

  beforeAll(async () => {
    const profileModule = await import('../profile/createMemberProfileCustomer');
    handler = profileModule.handler;
  });

  beforeEach(() => {
    mockContext = {} as LambdaContext;
    jest.clearAllMocks();
  });

  it('should return a member UUID when profile is successfully created', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
      body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEvent;

    const memberUuid = '123e4567-e89b-12d3-a456-426614174000';
    const profileUuid = '223e4567-e89b-12d3-a456-426614174000';
    mockCreateCustomerProfiles.mockResolvedValue([memberUuid, profileUuid]);

    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ memberUuid: memberUuid, profileUuid: profileUuid });
  });

  it('should return a 400 if brand is missing from pathParameters', async () => {
    mockEvent = {
      pathParameters: {},
      body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Missing brand' });
    expect(mockCreateCustomerProfiles).not.toHaveBeenCalled();
  });

  it('should return a 400 if request body is missing', async () => {
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Missing request body' });
    expect(mockCreateCustomerProfiles).not.toHaveBeenCalled();
  });

  it('should return a 500 if profileService throws an error', async () => {
    const errorMessage = 'Error creating customer profile';
    mockEvent = {
      pathParameters: { brand: 'BLC_UK' },
      body: JSON.stringify(body),
    } as unknown as APIGatewayProxyEvent;

    mockCreateCustomerProfiles.mockRejectedValueOnce(new Error(errorMessage));

    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal server error' });
    expect(mockCreateCustomerProfiles).toHaveBeenCalled();
  });
});
