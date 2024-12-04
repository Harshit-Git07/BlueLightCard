import {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { OrganisationRepository } from '../organisationRepository';
import { OrganisationModel, CreateOrganisationModel } from '../../models/organisationModel';
import { NotFoundError } from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { IdRequirementModel } from '../../models/idRequirementsModel';
import { IdType } from '../../models/enums/IdType';
import { EmployerModel } from '../../models/employerModel';
import { EmploymentStatus } from '../../models/enums/EmploymentStatus';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const organisationId = '2c84e384-5a36-4453-9cef-e343d080e5f0';
const organisation: OrganisationModel = {
  organisationId: organisationId,
  name: 'Test Organisation',
  type: 'Non-Profit',
  active: true,
  employmentStatus: [EmploymentStatus.EMPLOYED],
  employedIdRequirements: {
    minimumRequired: 1,
    supportedDocuments: [
      { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
    ],
  },
  retiredIdRequirements: {
    minimumRequired: 1,
    supportedDocuments: [
      { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
    ],
  },
  volunteerIdRequirements: {
    minimumRequired: 1,
    supportedDocuments: [
      { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
    ],
  },
  idUploadCount: 0,
  trustedDomains: [],
  bypassPayment: false,
  bypassId: false,
  lastUpdated: '2023-01-01T00:00:00Z',
};
const idRequirement: IdRequirementModel = {
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
};

let repository: OrganisationRepository;
let dynamoDBMock = {
  send: jest.fn(),
};
const putCommandMock = PutCommand as jest.MockedClass<typeof PutCommand>;
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
      expect(result).toEqual(items.map((item) => IdRequirementModel.parse(item)));
    });
  });

  describe('createOrganisation', () => {
    it('should create a new organisation', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce(organisationId);
      dynamoDBMock.send.mockResolvedValue({});
      const createOrganisation: CreateOrganisationModel = {
        name: 'New Organisation',
        type: 'Non-Profit',
        active: true,
        employmentStatus: [EmploymentStatus.EMPLOYED],
        employedIdRequirements: {
          minimumRequired: 1,
          supportedDocuments: [
            { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
          ],
        },
        retiredIdRequirements: {
          minimumRequired: 1,
          supportedDocuments: [
            { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
          ],
        },
        volunteerIdRequirements: {
          minimumRequired: 1,
          supportedDocuments: [
            { idKey: 'passport', type: IdType.IMAGE_UPLOAD, guidelines: '', required: false },
          ],
        },
        trustedDomains: [],
        bypassPayment: false,
        bypassId: false,
      };
      const result = await repository.createOrganisation(createOrganisation);

      expect(result).toBe(organisationId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        TableName: 'memberOrganisations',
        Item: {
          active: true,
          bypassId: false,
          bypassPayment: false,
          employedIdRequirements: {
            minimumRequired: 1,
            supportedDocuments: [
              {
                idKey: 'passport',
                required: false,
                guidelines: '',
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
                guidelines: '',
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
                guidelines: '',
                type: 'IMAGE_UPLOAD',
              },
            ],
          },
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
    it('should create a new employer', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce(employerId);
      dynamoDBMock.send.mockResolvedValue({});
      const createEmployer = {
        name: 'New Employer',
        active: true,
        employmentStatus: [],
        trustedDomains: [],
        bypassPayment: false,
        bypassId: false,
      };
      const result = await repository.createOrganisation(createEmployer);

      expect(result).toBe(employerId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        TableName: 'memberOrganisations',
        Item: {
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
