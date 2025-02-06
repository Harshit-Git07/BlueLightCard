import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  promoCodeService,
  PromoCodesService,
} from '@blc-mono/members/application/services/promoCodesService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { jest } from '@jest/globals';

jest.mock('@blc-mono/members/application/services/promoCodesService');
jest.mock('@blc-mono/members/application/services/emailService');

const memberId = uuidv4();
const applicationId = uuidv4();
const promoCode = 'NHS12345';
const path = `/members/${memberId}/applications/${applicationId}/code/validate/${promoCode}`;
const httpMethod = 'POST';

const promoCodeServiceMock = jest.mocked(promoCodeService);
const validatePromoCodeMock = jest.fn<typeof PromoCodesService.prototype.validatePromoCode>();

describe('validatePromoCode handler', () => {
  beforeEach(() => {
    promoCodeServiceMock.mockReturnValue({
      validatePromoCode: validatePromoCodeMock,
    } as unknown as PromoCodesService);
  });

  it('should return 400 if required parameters are missing', async () => {
    const event = { path, httpMethod, pathParameters: {} } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful validation', async () => {
    const event = {
      path,
      httpMethod,
      pathParameters: { memberId, applicationId, promoCode },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(204);
  });
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
