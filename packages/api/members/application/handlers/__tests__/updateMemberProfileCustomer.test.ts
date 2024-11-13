import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../profile/updateMemberProfileCustomer';
import { validateRequest } from '../../utils/requestValidator';
import { MemberProfileCustomerService } from '../../services/memberProfileCustomerService';
import { Response } from '../../utils/restResponse/response';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';

jest.mock('../../utils/requestValidator');
jest.mock('../../services/memberProfileCustomerService');
jest.mock('../../utils/restResponse/response');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');

const mockValidateRequest = validateRequest as jest.MockedFunction<typeof validateRequest>;
const mockProfileCustomerService = MemberProfileCustomerService.prototype;
const mockResponse = Response as jest.Mocked<typeof Response>;

describe('updateMemberProfile handler', () => {
  const mockEvent = {
    pathParameters: {
      memberUUID: '12345678-1234-1234-1234-123456789012',
      profileId: '12345678-1234-1234-1234-123456789013',
    },
    httpMethod: 'PUT',
    body: JSON.stringify({ key: 'value' }),
  } as unknown as APIGatewayProxyEvent;

  const mockContext = {} as Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return bad request if memberUUID or profileId is missing', async () => {
    const event = { ...mockEvent, pathParameters: {} };

    const result = await handler(event, mockContext, () => {});

    expect(mockResponse.BadRequest).toHaveBeenCalledWith({
      message: 'Error: Missing required query parameters',
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'memberUUID',
          'memberUUID is required',
        ),
        new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
        new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'profileId', 'profileId is required'),
      ],
    });
    expect(result).toEqual(mockResponse.BadRequest.mock.results[0].value);
  });

  it('should return validation result if validation fails', async () => {
    const validationResult = { statusCode: 400, body: 'Validation Error' };
    mockValidateRequest.mockReturnValue(validationResult);

    const result = await handler(mockEvent, mockContext, () => {});

    expect(result).toEqual(validationResult);
  });

  it('should return success response if profile is updated successfully', async () => {
    mockValidateRequest.mockReturnValue({
      memberUUID: '12345678-1234-1234-1234-123456789012',
      body: JSON.stringify({ key: 'value' }),
    });

    const result = await handler(mockEvent, mockContext, () => {});

    expect(mockProfileCustomerService.upsertMemberProfileCustomer).toHaveBeenCalledWith(
      {
        memberUUID: '12345678-1234-1234-1234-123456789012',
        profileId: '12345678-1234-1234-1234-123456789013',
      },
      JSON.stringify({ key: 'value' }),
      false,
      expect.any(Array),
    );
    expect(mockResponse.OK).toHaveBeenCalledWith({
      message: 'Member profile updated successfully',
    });
    expect(result).toEqual(mockResponse.OK.mock.results[0].value);
  });

  it('should return bad request if profile already exists during insert', async () => {
    mockValidateRequest.mockReturnValue({
      memberUUID: '12345678-1234-1234-1234-123456789012',
      body: JSON.stringify({ key: 'value' }),
    });
    jest.spyOn(mockProfileCustomerService, 'upsertMemberProfileCustomer').mockRejectedValue(
      Object.assign(new Error('Member profile already exists'), {
        code: 'ConditionalCheckFailedException',
      }),
    );

    const event = { ...mockEvent, httpMethod: 'POST' };
    const result = await handler(event, mockContext, () => {});

    expect(mockResponse.BadRequest).toHaveBeenCalledWith({
      message: 'Member profile already exists',
      errors: [
        new APIError(APIErrorCode.RESOURCE_NOT_FOUND, 'profileId', 'Member profile already exists'),
      ],
    });
    expect(result).toEqual(mockResponse.BadRequest.mock.results[0].value);
  });

  it('should return not found if profile does not exist during update', async () => {
    mockValidateRequest.mockReturnValue({
      memberUUID: '12345678-1234-1234-1234-123456789012',
      body: JSON.stringify({ key: 'value' }),
    });
    jest.spyOn(mockProfileCustomerService, 'upsertMemberProfileCustomer').mockRejectedValue(
      Object.assign(new Error('Member profile and/or profile not found'), {
        code: 'ConditionalCheckFailedException',
      }),
    );

    const result = await handler(mockEvent, mockContext, () => {});

    expect(mockResponse.NotFound).toHaveBeenCalledWith({
      message: 'Member profile and/or profile not found',
      errors: [
        new APIError(
          APIErrorCode.RESOURCE_NOT_FOUND,
          'profileId',
          'Member profile and/or profile not found',
        ),
      ],
    });
    expect(result).toEqual(mockResponse.NotFound.mock.results[0].value);
  });

  it('should return error response for general errors', async () => {
    mockValidateRequest.mockReturnValue({
      memberUUID: '12345678-1234-1234-1234-123456789012',
      body: JSON.stringify({ key: 'value' }),
    });
    const error = new Error('General Error');
    jest.spyOn(mockProfileCustomerService, 'upsertMemberProfileCustomer').mockRejectedValue(error);

    const result = await handler(mockEvent, mockContext, () => {});

    expect(mockResponse.Error).toHaveBeenCalledWith(error);
    expect(result).toEqual(mockResponse.Error.mock.results[0].value);
  });
});
