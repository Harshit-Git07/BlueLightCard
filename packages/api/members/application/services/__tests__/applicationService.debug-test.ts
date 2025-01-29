/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';

const repository = new ApplicationRepository(
  defaultDynamoDbClient,
  'pr-3629-blc-mono-blc-mono-memberProfiles',
);

const applicationService = new ApplicationService(repository);

it('should create an application for signup', async () => {
  const memberId = '3bb9a58b-4e80-4626-9285-fa3eddfff7fe'; // Update this to whatever member id you want to create

  const applicationId = await applicationService.createApplication(memberId, {
    startDate: '2024-07-25T22:49:42.134Z',
    eligibilityStatus: EligibilityStatus.ELIGIBLE,
    applicationReason: ApplicationReason.SIGNUP,
  });

  expect(applicationId).toEqual(expect.any(String));
  console.log({ applicationId });
});
