/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';
import { verifyTrustedDomainHandler } from '@blc-mono/members/application/handlers/member/applications/handlers/verifyTrustedDomainHandler';
import { APIGatewayProxyEvent } from 'aws-lambda';

const repository = new ApplicationRepository(
  defaultDynamoDbClient,
  'pr-3666-blc-mono-blc-mono-memberProfiles',
);
const applicationService = new ApplicationService(repository);
jest.mock('@blc-mono/members/application/services/applicationService', () => ({
  ...jest.requireActual('@blc-mono/members/application/services/applicationService'),
  applicationService: () => applicationService,
}));

it('should verify trusted domain', async () => {
  const memberId = '19921f4f-9d17-11ef-b68d-506b8d536548';
  const applicationId = '1f5d801f-44b1-4961-8b4e-df1d8c0c8572';
  const trustedDomainVerificationUid = '0d1de6b5-4e9a-4225-bfa7-065be9a650fb';
  const event = {
    pathParameters: {
      memberId,
      applicationId,
      trustedDomainVerificationUid,
    },
  } as unknown as APIGatewayProxyEvent;

  const result = await verifyTrustedDomainHandler(event);

  expect(result).toEqual({
    statusCode: 302,
    headers: {
      Location: 'https://www.bluelightcard.co.uk/',
      'content-type': 'text/html',
    },
  });
});
