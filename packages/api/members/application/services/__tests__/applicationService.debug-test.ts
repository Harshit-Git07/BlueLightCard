/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */

import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { ApplicationRepository } from '@blc-mono/members/application/repositories/applicationRepository';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';

jest.mock('../emailService');

const repository = new ApplicationRepository(
  defaultDynamoDbClient,
  'pr-3666-blc-mono-blc-mono-memberProfiles',
);

const applicationService = new ApplicationService(repository);

it('should create an application for signup', async () => {
  const memberId = '19921f4f-9d17-11ef-b68d-506b8d536548';

  const applicationId = await applicationService.createApplication(memberId, {
    startDate: '2024-07-25T22:49:42.134Z',
    eligibilityStatus: EligibilityStatus.ELIGIBLE,
    applicationReason: ApplicationReason.SIGNUP,
  });

  console.log({ applicationId });
  expect(applicationId).toEqual(expect.any(String));
});

it('should get an application', async () => {
  const memberId = '19921f4f-9d17-11ef-b68d-506b8d536548';
  const applicationId = '1f5d801f-44b1-4961-8b4e-df1d8c0c8572';

  const application = await applicationService.getApplication(memberId, applicationId);

  console.log({ application });
  expect(application).not.toBeUndefined();
});
