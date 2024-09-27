import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MemberProfilesService } from '../../services/memberProfilesService';
import { MemberProfileApp } from '../../models/memberProfileModel';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../repositories/memberProfilesRepository');
jest.mock('../../services/memberProfilesService');

const mockGetMembersProfiles = jest.fn();
MemberProfilesService.prototype.getMemberProfiles = mockGetMembersProfiles;

describe('Get Member Profile Lambda Handler', () => {
  let handler: (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeAll(async () => {
    const module = await import('../profile/getMembersProfiles');
    handler = module.handler;
  });

  beforeEach(() => {
    mockEvent = {
      queryStringParameters: { memberUUID: '456' },
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;

    jest.clearAllMocks();
  });

  it('should return member profile successfully', async () => {
    const mockProfile: MemberProfileApp = {
      uuid: '456',
      firstname: 'John',
      surname: 'Doe',
      dob: '1990-01-01',
      gender: 'male',
      mobile: '1234567890',
      email: 'john@example.com',
      emailValidated: 1,
      spareEmail: 'john.spare@example.com',
      spareEmailValidated: 0,
      organisation: 'TestOrg',
      employer: 'TestEmployer',
      employerId: '123',
      gaKey: 'test-ga-key',
      mergedTime: '2023-01-01T12:00:00Z',
      mergedUid: 'merged-123',
      county: 'TestCounty',
      employmentType: 'Full-time',
      jobTitle: 'Developer',
      reference: 'REF123',
      signupDate: '2023-01-01',
      signupSource: 'Web',
      lastIp: '192.168.1.1',
      lastLogin: '2023-09-01',
      blocked: false,
      cardNumber: '1234',
      cardExpire: '2025-12-31',
      cardStatus: 'Active',
      cardPaymentStatus: 'Paid',
    };

    mockGetMembersProfiles.mockResolvedValue(mockProfile);

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Member profile found',
      data: mockProfile,
    });
  });

  it('should return 400 if memberUUID is missing', async () => {
    mockEvent.queryStringParameters = {};

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Bad Request: memberUUID is required',
    });
  });

  it('should return 404 if member profile not found', async () => {
    mockGetMembersProfiles.mockResolvedValue(null);

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ message: 'Member profile not found' });
  });

  it('should return 500 on internal error', async () => {
    mockGetMembersProfiles.mockRejectedValue(new Error('Internal error'));

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Internal error',
      message: 'Error',
    });
  });
});
