import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { v4 as uuidv4 } from 'uuid';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { OrganisationRepository } from '@blc-mono/members/application/repositories/organisationRepository';

jest.mock('@blc-mono/members/application/repositories/organisationRepository');

describe('OrganisationService', () => {
  const organisationId = uuidv4();
  const employerId = uuidv4();
  const supportedDocument = {
    idKey: 'passport',
    title: 'Passport',
    description: 'Passport Document',
    type: IdType.IMAGE_UPLOAD,
    guidelines: 'Upload your passport',
    required: false,
  };
  const idRequirements = {
    minimumRequired: 1,
    supportedDocuments: [supportedDocument],
  };
  const organisations: OrganisationModel[] = [
    {
      organisationId,
      name: 'Org1',
      active: true,
      employmentStatus: [EmploymentStatus.EMPLOYED],
      employedIdRequirements: idRequirements,
      retiredIdRequirements: idRequirements,
      volunteerIdRequirements: idRequirements,
      trustedDomains: [],
    },
  ];
  const employers: EmployerModel[] = [
    {
      organisationId,
      employerId,
      name: 'Employer1',
      active: true,
      trustedDomains: [],
    },
  ];

  let organisationRepositoryMock: jest.Mocked<OrganisationRepository>;
  let organisationService: OrganisationService;

  beforeEach(() => {
    organisationRepositoryMock =
      new OrganisationRepository() as jest.Mocked<OrganisationRepository>;
    organisationService = new OrganisationService(organisationRepositoryMock);
  });

  describe('getOrganisations', () => {
    it('should return organisations', async () => {
      organisationRepositoryMock.getOrganisations.mockResolvedValue(organisations);

      const result = await organisationService.getOrganisations();

      expect(result).toEqual(organisations);
    });

    it('should throw an error if fetching organisations fails', async () => {
      organisationRepositoryMock.getOrganisations.mockRejectedValue(new Error('Failed to fetch'));

      await expect(organisationService.getOrganisations()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('getOrganisation', () => {
    it('should return an organisation', async () => {
      organisationRepositoryMock.getOrganisation.mockResolvedValue(organisations[0]);

      const result = await organisationService.getOrganisation(organisationId);

      expect(result).toEqual(organisations[0]);
    });

    it('should throw an error if fetching organisation fails', async () => {
      organisationRepositoryMock.getOrganisation.mockRejectedValue(new Error('Failed to fetch'));

      await expect(organisationService.getOrganisation(organisationId)).rejects.toThrow(
        'Failed to fetch',
      );
    });
  });

  describe('getEmployers', () => {
    it('should return employers', async () => {
      organisationRepositoryMock.getEmployers.mockResolvedValue(employers);

      const result = await organisationService.getEmployers(organisationId);

      expect(result).toEqual(employers);
    });

    it('should throw an error if fetching employers fails', async () => {
      organisationRepositoryMock.getEmployers.mockRejectedValue(new Error('Failed to fetch'));

      await expect(organisationService.getEmployers(organisationId)).rejects.toThrow(
        'Failed to fetch',
      );
    });
  });

  describe('getEmployer', () => {
    it('should return an employer', async () => {
      organisationRepositoryMock.getEmployer.mockResolvedValue(employers[0]);

      const result = await organisationService.getEmployer(organisationId, employerId);

      expect(result).toEqual(employers[0]);
    });

    it('should throw an error if fetching employer fails', async () => {
      organisationRepositoryMock.getEmployer.mockRejectedValue(new Error('Failed to fetch'));

      await expect(organisationService.getEmployer(organisationId, employerId)).rejects.toThrow(
        'Failed to fetch',
      );
    });
  });
});
