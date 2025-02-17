import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  applicationService,
  ApplicationService,
} from '@blc-mono/members/application/services/applicationService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { jest } from '@jest/globals';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';

jest.mock('@blc-mono/members/application/services/applicationService');
jest.mock('@blc-mono/members/application/services/email/emailService');

const memberId = uuidv4();
const applicationId = uuidv4();
const path = `/members/${memberId}/applications/${applicationId}/paymentConfirmed`;
const httpMethod = 'PUT';

const applicationServiceMock = jest.mocked(applicationService);
const updateApplicationMock = jest.fn<typeof ApplicationService.prototype.updateApplication>();

beforeEach(() => {
  applicationServiceMock.mockReturnValue({
    updateApplication: updateApplicationMock,
  } as unknown as ApplicationService);
});

it('should return 204 on successful update', async () => {
  const event = {
    path,
    httpMethod,
    pathParameters: { memberId, applicationId },
  } as unknown as APIGatewayProxyEvent;

  const response = await handler(event);

  expect(response.statusCode).toEqual(204);
  expect(updateApplicationMock).toHaveBeenCalledWith(memberId, applicationId, {
    paymentStatus: PaymentStatus.AWAITING_PAYMENT_CONFIRMATION,
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
