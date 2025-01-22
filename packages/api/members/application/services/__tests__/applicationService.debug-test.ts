/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';
import { ApplicationReason } from '@blc-mono/members/application/models/enums/ApplicationReason';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';

const repository = new ApplicationRepository(
  defaultDynamoDbClient,
  'pr-3501-blc-mono-blc-mono-memberProfiles',
);

const applicationService = new ApplicationService(repository);

it('should create an application for signup', async () => {
  const memberId = 'e57d0310-140c-4487-abe5-71e30f4efac7'; // Update this to whatever member id you want to create

  const applicationId = await applicationService.createApplication(memberId, {
    startDate: '2024-07-25T22:49:42.134Z',
    eligibilityStatus: EligibilityStatus.INELIGIBLE,
    applicationReason: ApplicationReason.SIGNUP,
  });

  expect(applicationId).toEqual(expect.any(String));
  console.log({ applicationId });
});
