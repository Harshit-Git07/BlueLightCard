import {
  getOrganisationIdMappings,
  mapOrganisationsAndEmployers,
  OrganisationIdMapping,
} from '../organisationIdMapping';
import { parseCsvFile } from '@blc-mono/members/application/utils/csvParser';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';

jest.mock('@blc-mono/members/application/utils/csvParser');
jest.mock('@blc-mono/core/utils/checkBrand');

const parseCsvFileMock = jest.mocked(parseCsvFile);
jest.mock('uuid', () => ({ v4: () => '123456789' }));

const testOrg = {
  brand: 'BLC_UK',
  employmentStatus: 'employed',
  organisation: 'OrgA',
  employer: 'EmpA',
  idKey: 'ID1',
  idType: 'Type1',
  idTitle: 'Title1',
  idDescription: 'Ambulance Work ID Card',
  idGuidelines: 'Upload your document',
  moreThanOneId: 'true',
  minimumRequired: 2,
  required: 'true',
  supportedDocuments: 'true',
};

const getBrandFromEnvMock = jest.mocked(getBrandFromEnv);

describe('Organisation ID Mapping', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));

    getBrandFromEnvMock.mockReturnValue('BLC_UK');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('getOrganisationIdMappings', () => {
    it('should parse CSV and return organisation ID map', async () => {
      const mockCsvData = [
        {
          Brand: 'BLC_UK',
          'Employment Status': 'employed',
          Organisation: 'OrgA',
          Employer: 'EmpA',
          idKey: 'ID1',
          idType: 'Type1',
          idTitle: 'Title1',
          'Selected option copy': 'Upload your document',
          'Selector Copy': 'Ambulance Work ID Card',
          'More than 1 ID': 'true',
          minimumRequired: '2',
          required: 'true',
          supportedDocuments: 'true',
        },
        {
          Brand: 'BLC_AU',
          'Employment Status': 'employed',
          Organisation: 'OrgA',
          Employer: 'EmpA',
          idKey: 'ID1',
          idType: 'Type1',
          idTitle: 'Title1',
          'Selected option copy': 'Upload your document',
          'Selector Copy': 'Ambulance Work ID Card',
          'More than 1 ID': 'true',
          minimumRequired: '2',
          required: 'true',
          supportedDocuments: 'true',
        },
      ];
      parseCsvFileMock.mockResolvedValue(mockCsvData);

      const result = await getOrganisationIdMappings();
      expect(result.size).toBe(1);
      expect(result.get('OrgA')).toEqual([
        {
          ...testOrg,
        },
      ]);
    });
  });

  describe('mapOrganisationsAndEmployers', () => {
    const eligibilityRules = new Map<string, OrganisationIdMapping[]>();
    eligibilityRules.set('OrgA', [
      {
        ...testOrg,
      },
      {
        ...testOrg,
        employmentStatus: 'volunteer',
        idType: 'Type2',
      },
      {
        ...testOrg,
        employmentStatus: 'retired',
        idType: 'Type3',
      },
      {
        ...testOrg,
        employer: 'EmpB',
        employmentStatus: 'retired',
        idType: 'Type3',
      },
      {
        ...testOrg,
        employer: 'EmpB',
        employmentStatus: 'retired',
        idType: 'Type4',
      },
    ]);

    const expectedEmployerA = {
      active: true,
      employedIdRequirements: {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type1',
          },
        ],
      },
      employmentStatus: ['EMPLOYED', 'VOLUNTEER', 'RETIRED'],
      name: 'EmpA',
      retiredIdRequirements: {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type3',
          },
        ],
      },
      volunteerIdRequirements: {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type2',
          },
        ],
      },
    };

    const expectedEmployerB = {
      active: true,
      employmentStatus: ['RETIRED'],
      name: 'EmpB',
      volunteerIdRequirements: undefined,
      employedIdRequirements: undefined,
      retiredIdRequirements: {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type3',
          },
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type4',
          },
        ],
      },
    };

    it('should map eligibility rules to organisations', () => {
      const expectedOrg = {
        active: true,
        employmentStatus: ['EMPLOYED', 'VOLUNTEER', 'RETIRED'],
        name: 'OrgA',
        organisationId: '123456789',
        employedIdRequirements: {
          minimumRequired: 2,
          supportedDocuments: [
            {
              description: 'Ambulance Work ID Card',
              guidelines: 'Upload your document',
              idKey: 'ID1',
              required: true,
              title: 'Title1',
              type: 'Type1',
            },
          ],
        },
        retiredIdRequirements: {
          minimumRequired: 2,
          supportedDocuments: [
            {
              description: 'Ambulance Work ID Card',
              guidelines: 'Upload your document',
              idKey: 'ID1',
              required: true,
              title: 'Title1',
              type: 'Type3',
            },
          ],
        },
        volunteerIdRequirements: {
          minimumRequired: 2,
          supportedDocuments: [
            {
              description: 'Ambulance Work ID Card',
              guidelines: 'Upload your document',
              idKey: 'ID1',
              required: true,
              title: 'Title1',
              type: 'Type2',
            },
          ],
        },
        lastUpdated: '2023-01-01T00:00:00.000Z',
      };

      const { organisations } = mapOrganisationsAndEmployers(eligibilityRules);

      expect(organisations.length).toBe(1);
      expect(organisations[0]).toEqual(expectedOrg);
    });
    it('should map eligibility rules to employers', () => {
      const { employers } = mapOrganisationsAndEmployers(eligibilityRules);
      const orgKey = employers.keys().next().value ?? '';

      expect(employers.size).toBe(1);
      expect(employers.get(orgKey)).toEqual([expectedEmployerA, expectedEmployerB]);
    });
    it('should map common employer ID requirements to the organisation', () => {
      const expectedRetiredIdRequirements = {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type3',
          },
        ],
      };

      const expectedEmployedIdRequirements = {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type1',
          },
        ],
      };

      const expectedVolunteerIdRequirements = {
        minimumRequired: 2,
        supportedDocuments: [
          {
            guidelines: 'Upload your document',
            idKey: 'ID1',
            title: 'Title1',
            description: 'Ambulance Work ID Card',
            required: true,
            type: 'Type2',
          },
        ],
      };

      const { organisations } = mapOrganisationsAndEmployers(eligibilityRules);

      expect(organisations[0].employedIdRequirements).toEqual(expectedEmployedIdRequirements);
      expect(organisations[0].volunteerIdRequirements).toEqual(expectedVolunteerIdRequirements);
      expect(organisations[0].retiredIdRequirements).toEqual(expectedRetiredIdRequirements);
    });
  });
});
