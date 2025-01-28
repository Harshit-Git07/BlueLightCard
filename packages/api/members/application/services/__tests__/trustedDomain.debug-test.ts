/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */
import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { TrustedDomainService } from '@blc-mono/members/application/services/trustedDomainService';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { OrganisationRepository } from '@blc-mono/members/application/repositories/organisationRepository';

const profileRepository = new ProfileRepository(
  defaultDynamoDbClient,
  'staging-blc-mono-memberProfiles',
);
const organisationRepository = new OrganisationRepository(
  defaultDynamoDbClient,
  'staging-blc-mono-memberProfiles',
);

const trustedDomainService = new TrustedDomainService(profileRepository, organisationRepository);

it('should validate a trusted domain for a given profile', async () => {
  const memberId = '19921f4f-9d17-11ef-b68d-506b8d536548';

  await expect(
    trustedDomainService.validateTrustedDomainEmail(memberId, 'neil.armstrong@instil.co'),
  ).resolves.not.toThrow();
});
