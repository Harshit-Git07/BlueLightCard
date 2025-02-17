import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import {
  promoCodeService,
  PromoCodesService,
} from '@blc-mono/members/application/services/promoCodesService';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/services/promoCodesService');
jest.mock('@blc-mono/members/application/services/email/emailService');

const memberId = uuidv4();
const applicationId = uuidv4();
const path = `/members/${memberId}/applications/${applicationId}/code/apply`;
const httpMethod = 'PUT';

const promoCodeServiceMock = jest.mocked(promoCodeService);
const applyPromoCodeMock = jest.fn<typeof PromoCodesService.prototype.applyPromoCode, unknown[]>();

describe('applyPromoCode handler', () => {
  beforeEach(() => {
    promoCodeServiceMock.mockReturnValue({
      applyPromoCode: applyPromoCodeMock,
    } as unknown as PromoCodesService);
  });

  it('should return 400 if required parameters are missing', async () => {
    const event = {
      path,
      httpMethod,
      pathParameters: { memberId },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body is missing', async () => {
    const event = { path, httpMethod } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
  });

  it('should return 400 if request body does not includes promo code', async () => {
    const response = await handler(
      eventWithApplication({
        address1: '123 Example Street',
      }),
    );

    expect(response.statusCode).toEqual(400);
  });

  it('should return 204 on successful update', async () => {
    const response = await handler(
      eventWithApplication({
        promoCode: 'NHS12345',
        promoCodeApplied: true,
      }),
    );

    expect(response.statusCode).toEqual(204);
    expect(applyPromoCodeMock).toHaveBeenCalledWith(memberId, applicationId, 'NHS12345', true);
  });

  const eventWithApplication = (applicationModel: UpdateApplicationModel): APIGatewayProxyEvent => {
    return {
      path,
      httpMethod,
      pathParameters: { memberId, applicationId },
      body: JSON.stringify(applicationModel),
    } as unknown as APIGatewayProxyEvent;
  };
});

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return await (await import('../memberApplicationHandler')).handler(event, emptyContextStub);
}
