import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { OrganisationRepository } from '../organisationRepository';
import {
  OrganisationModel,
  CreateOrganisationModel,
} from '@blc-mono/shared/models/members/organisationModel';
import { NotFoundError } from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const organisationId = '2c84e384-5a36-4453-9cef-e343d080e5f0';
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
const organisation: OrganisationModel = {
  organisationId: organisationId,
  name: 'Test Organisation',
  type: 'Non-Profit',
  active: true,
  employmentStatus: [EmploymentStatus.EMPLOYED],
  employedIdRequirements: idRequirements,
  retiredIdRequirements: idRequirements,
  volunteerIdRequirements: idRequirements,
  idUploadCount: 0,
  trustedDomains: [],
  bypassPayment: false,
  bypassId: false,
  lastUpdated: '2023-01-01T00:00:00Z',
};
const idRequirement: GetIdRequirementDocsModel = {
  type: IdType.IMAGE_UPLOAD,
  idKey: 'passportNumber',
  description: 'Passport ID',
};

const employerId = 'bd5db78f-bc9a-4523-80fc-af7853510186';
const employer: EmployerModel = {
  organisationId,
  employerId,
  name: 'Test Employer',
  active: true,
  idUploadCount: 0,
  bypassPayment: false,
  bypassId: false,
  lastUpdated: '2023-01-01T00:00:00Z',
  trustedDomains: [],
};

let repository: OrganisationRepository;
let dynamoDBMock = {
  send: jest.fn(),
};
const putCommandMock = PutCommand as jest.MockedClass<typeof PutCommand>;
const batchWriteCommandMock = BatchWriteCommand as jest.MockedClass<typeof BatchWriteCommand>;
const updateCommandMock = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;

describe('OrganisationRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
    repository = new OrganisationRepository(
      dynamoDBMock as any as DynamoDBDocumentClient,
      'memberOrganisations',
    );
  });

  describe('getIdRequirementDocs', () => {
    it('should return an empty array if no ID requirements are found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Items: [] });
      const result = await repository.getIdRequirementDocs();
      expect(result).toEqual([]);
    });

    it('should return ID requirements', async () => {
      const items = [idRequirement];
      dynamoDBMock.send.mockResolvedValue({ Items: items });
      const result = await repository.getIdRequirementDocs();
      expect(result).toEqual(items.map((item) => GetIdRequirementDocsModel.parse(item)));
    });
  });

  describe('createOrganisation', () => {
    const expectedPutRequestItem = {
      active: true,
      bypassId: false,
      bypassPayment: false,
      employedIdRequirements: {
        minimumRequired: 1,
        supportedDocuments: [
          {
            idKey: 'passport',
            required: false,
            guidelines: 'Upload your passport',
            description: 'Passport Document',
            title: 'Passport',
            type: 'IMAGE_UPLOAD',
          },
        ],
      },
      employmentStatus: ['EMPLOYED'],
      lastUpdated: '2023-01-01T00:00:00.000Z',
      name: 'New Organisation',
      organisationId: '2c84e384-5a36-4453-9cef-e343d080e5f0',
      pk: 'ORGANISATION#2c84e384-5a36-4453-9cef-e343d080e5f0',
      retiredIdRequirements: {
        minimumRequired: 1,
        supportedDocuments: [
          {
            idKey: 'passport',
            required: false,
            guidelines: 'Upload your passport',
            description: 'Passport Document',
            title: 'Passport',
            type: 'IMAGE_UPLOAD',
          },
        ],
      },
      sk: 'ORGANISATION',
      trustedDomains: [],
      type: 'Non-Profit',
      volunteerIdRequirements: {
        minimumRequired: 1,
        supportedDocuments: [
          {
            idKey: 'passport',
            required: false,
            guidelines: 'Upload your passport',
            description: 'Passport Document',
            title: 'Passport',
            type: 'IMAGE_UPLOAD',
          },
        ],
      },
    };

    const createOrganisation: CreateOrganisationModel = {
      name: 'New Organisation',
      type: 'Non-Profit',
      active: true,
      employmentStatus: [EmploymentStatus.EMPLOYED],
      employedIdRequirements: idRequirements,
      retiredIdRequirements: idRequirements,
      volunteerIdRequirements: idRequirements,
      trustedDomains: [],
      bypassPayment: false,
      bypassId: false,
    };

    it('should create a new organisation', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce(organisationId);
      dynamoDBMock.send.mockResolvedValue({});
      const result = await repository.createOrganisation(createOrganisation);

      expect(result).toBe(organisationId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        TableName: 'memberOrganisations',
        Item: expectedPutRequestItem,
      });
    });
    it('should create multiple organisations', async () => {
      (uuidv4 as jest.Mock).mockReturnValue(organisationId);
      dynamoDBMock.send.mockResolvedValue({});
      const createOrganisation1: CreateOrganisationModel = {
        ...createOrganisation,
        name: 'New Organisation 1',
      };
      const createOrganisation2: CreateOrganisationModel = {
        ...createOrganisation,
        name: 'New Organisation 2',
      };
      const result = await repository.createOrganisations([
        createOrganisation1,
        createOrganisation2,
      ]);

      expect(result).toStrictEqual([organisationId, organisationId]);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(BatchWriteCommand));
      expect(batchWriteCommandMock).toHaveBeenCalledWith({
        RequestItems: {
          memberOrganisations: [
            {
              PutRequest: {
                Item: {
                  ...expectedPutRequestItem,
                  name: 'New Organisation 1',
                },
              },
            },
            {
              PutRequest: {
                Item: {
                  ...expectedPutRequestItem,
                  name: 'New Organisation 2',
                },
              },
            },
          ],
        },
      });
    });
  });

  describe('getOrganisation', () => {
    it('should throw NotFoundError if organisation is not found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Item: null });
      await expect(repository.getOrganisation(organisationId)).rejects.toThrow(NotFoundError);
    });

    it('should return the organisation if found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Item: organisation });
      const result = await repository.getOrganisation(organisationId);
      expect(result).toEqual(OrganisationModel.parse(organisation));
    });
  });

  describe('getOrganisations', () => {
    it('should return an empty array if no organisations are found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Items: [] });
      const result = await repository.getOrganisations();
      expect(result).toEqual([]);
    });

    it('should return organisations', async () => {
      const items = [organisation];
      dynamoDBMock.send.mockResolvedValue({ Items: items });
      const result = await repository.getOrganisations();
      expect(result).toEqual(items.map((item) => OrganisationModel.parse(item)));
    });
  });

  describe('updateOrganisation', () => {
    it('should update an existing organisation', async () => {
      dynamoDBMock.send.mockResolvedValue({});
      const updateData = { name: 'Updated Organisation' };
      await repository.updateOrganisation(organisationId, updateData);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberOrganisations',
        Key: {
          pk: 'ORGANISATION#2c84e384-5a36-4453-9cef-e343d080e5f0',
          sk: 'ORGANISATION',
        },
        UpdateExpression: 'SET #name = :name, #lastUpdated = :lastUpdated ',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#lastUpdated': 'lastUpdated',
        },
        ExpressionAttributeValues: {
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
          ':name': 'Updated Organisation',
        },
      });
    });
  });

  describe('createEmployer', () => {
    const createEmployer = {
      name: 'New Employer',
      active: true,
      employmentStatus: [],
      trustedDomains: [],
      bypassPayment: false,
      bypassId: false,
    };
    const expectedPutRequestItem = {
      active: true,
      bypassId: false,
      bypassPayment: false,
      employmentStatus: [],
      lastUpdated: '2023-01-01T00:00:00.000Z',
      name: 'New Employer',
      organisationId: 'bd5db78f-bc9a-4523-80fc-af7853510186',
      pk: 'ORGANISATION#bd5db78f-bc9a-4523-80fc-af7853510186',
      sk: 'ORGANISATION',
      trustedDomains: [],
    };

    it('should create a new employer', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce(employerId);
      dynamoDBMock.send.mockResolvedValue({});
      const result = await repository.createOrganisation(createEmployer);

      expect(result).toBe(employerId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        TableName: 'memberOrganisations',
        Item: expectedPutRequestItem,
      });
    });
    it('should create multiple employers', async () => {
      (uuidv4 as jest.Mock).mockReturnValue(employerId);
      dynamoDBMock.send.mockResolvedValue({});
      const createEmployer1 = {
        ...createEmployer,
        name: 'New Employer 1',
      };
      const createEmployer2 = {
        ...createEmployer,
        name: 'New Employer 2',
      };

      const result = await repository.createOrganisations([createEmployer1, createEmployer2]);

      expect(result).toStrictEqual([employerId, employerId]);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(BatchWriteCommand));
      expect(batchWriteCommandMock).toHaveBeenCalledWith({
        RequestItems: {
          memberOrganisations: [
            {
              PutRequest: {
                Item: {
                  ...expectedPutRequestItem,
                  name: 'New Employer 1',
                },
              },
            },
            {
              PutRequest: {
                Item: {
                  ...expectedPutRequestItem,
                  name: 'New Employer 2',
                },
              },
            },
          ],
        },
      });
    });
  });

  describe('getEmployer', () => {
    it('should throw NotFoundError if employer is not found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Item: null });
      await expect(repository.getOrganisation(employerId)).rejects.toThrow(NotFoundError);
    });

    it('should return the employer if found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Item: employer });
      const result = await repository.getOrganisation(employerId);
      expect(result).toEqual(OrganisationModel.parse(employer));
    });
  });

  describe('getEmployers', () => {
    it('should return an empty array if no employers are found', async () => {
      dynamoDBMock.send.mockResolvedValue({ Items: [] });
      const result = await repository.getOrganisations();
      expect(result).toEqual([]);
    });

    it('should return employers', async () => {
      const items = [employer];
      dynamoDBMock.send.mockResolvedValue({ Items: items });
      const result = await repository.getOrganisations();
      expect(result).toEqual(items.map((item) => OrganisationModel.parse(item)));
    });
  });

  describe('updateEmployer', () => {
    it('should update an existing employer', async () => {
      dynamoDBMock.send.mockResolvedValue({});
      const updateData = { name: 'Updated Employer' };
      await repository.updateOrganisation(employerId, updateData);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberOrganisations',
        Key: {
          pk: 'ORGANISATION#bd5db78f-bc9a-4523-80fc-af7853510186',
          sk: 'ORGANISATION',
        },
        UpdateExpression: 'SET #name = :name, #lastUpdated = :lastUpdated ',
        ExpressionAttributeNames: {
          '#lastUpdated': 'lastUpdated',
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
          ':name': 'Updated Employer',
        },
      });
    });
  });
});
