import { v4 as uuidv4 } from 'uuid';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { Gender } from '@blc-mono/shared/models/members/enums/Gender';
import { TrustedDomainService } from '@blc-mono/members/application/services/trustedDomainService';
import { OrganisationRepository } from '@blc-mono/members/application/repositories/organisationRepository';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';

jest.mock('@blc-mono/members/application/repositories/organisationRepository');
jest.mock('@blc-mono/members/application/repositories/profileRepository');
jest.mock('@blc-mono/members/application/providers/Tables', () => ({
  getMemberProfilesTableName: () => 'TestTableProfiles',
  memberOrganisationsTableName: () => 'TestTableOrganisations',
}));

describe('TrustedDomainService', () => {
  let service: TrustedDomainService;
  let organisationRepositoryMock: jest.Mocked<OrganisationRepository>;
  let profileRepositoryMock: jest.Mocked<ProfileRepository>;

  const memberId = uuidv4();
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const trustedDomainEmail = 'user@example.com';
  const validDomain = 'example.com';

  const employer: EmployerModel = {
    employerId: employerId,
    name: 'Test Employer',
    type: 'Type',
    active: true,
    organisationId: organisationId,
    trustedDomains: [validDomain],
  };
  const organisation: OrganisationModel = {
    organisationId: organisationId,
    name: 'Test Organisation',
    type: 'Type',
    active: true,
    trustedDomains: [validDomain],
  };
  const profile: ProfileModel = {
    memberId,
    firstName: 'John',
    lastName: 'Doe',
    organisationId: organisation.organisationId,
    employerId: employer.employerId,
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    dateOfBirth: '1990-01-01',
    gender: Gender.MALE,
    applications: [],
  };

  beforeEach(() => {
    organisationRepositoryMock =
      new OrganisationRepository() as jest.Mocked<OrganisationRepository>;
    profileRepositoryMock = new ProfileRepository() as jest.Mocked<ProfileRepository>;
    service = new TrustedDomainService(profileRepositoryMock, organisationRepositoryMock);

    organisationRepositoryMock.getEmployer.mockResolvedValue(employer);
    organisationRepositoryMock.getOrganisation.mockResolvedValue(organisation);
    profileRepositoryMock.getProfile.mockResolvedValue(profile);
  });

  describe('validateTrustedDomain', () => {
    it('should not throw an error if the email domain is in the employer, but not on organisation', async () => {
      organisationRepositoryMock.getOrganisation.mockResolvedValue({
        ...organisation,
        trustedDomains: [],
      });

      await expect(
        service.validateTrustedDomainEmail(memberId, trustedDomainEmail),
      ).resolves.not.toThrow();
    });

    it('should not throw an error if the email domain is not in employer, but is in the organisation', async () => {
      organisationRepositoryMock.getEmployer.mockResolvedValue({
        ...employer,
        trustedDomains: [],
      });

      await expect(
        service.validateTrustedDomainEmail(memberId, trustedDomainEmail),
      ).resolves.not.toThrow();
    });

    it('should not throw error if no employer on profile, and email exists in organisation', async () => {
      profileRepositoryMock.getProfile.mockResolvedValue({
        ...profile,
        employerId: undefined,
      });
      organisationRepositoryMock.getEmployer.mockRejectedValue(
        new Error('Employer not found stub error'),
      );

      await expect(
        service.validateTrustedDomainEmail(memberId, trustedDomainEmail),
      ).resolves.not.toThrow();
    });

    it('should throw ValidationError if the email domain is not in the employer or organisation', async () => {
      organisationRepositoryMock.getOrganisation.mockResolvedValue({
        ...organisation,
        trustedDomains: [],
      });
      organisationRepositoryMock.getEmployer.mockResolvedValue({
        ...employer,
        trustedDomains: [],
      });

      await expect(
        service.validateTrustedDomainEmail(profile.memberId, trustedDomainEmail),
      ).rejects.toThrow(
        'Trusted domain does not exist for e-mail on employer or organisation trusted domain list',
      );
    });
  });
});
