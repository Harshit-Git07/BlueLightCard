import {
  DynamoDBDocumentClient,
  PutCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/shared/models/members/profileModel';
import { memberKey, noteKey } from '@blc-mono/members/application/repositories/base/repository';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { CreateNoteModel, NoteModel } from '@blc-mono/shared/models/members/noteModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { ProfileRepository } from '@blc-mono/members/application/repositories/profileRepository';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('@blc-mono/members/application/providers/Tables', () => ({
  memberProfilesTableName: () => 'memberProfiles',
}));

const memberId = '7d92ad80-8691-4fc7-839a-715384a8a5e0';
const profile: ProfileModel = {
  memberId: memberId,
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  email: 'john.doe@example.com',
};

const applicationId = '7f83574c-67fd-4e8c-9395-e0b33415b89c';
const application: ApplicationModel = {
  memberId,
  applicationId,
  applicationReason: ApplicationReason.SIGNUP,
};

const noteId = '9d2632fb-8983-4f09-bfa1-f652b17e9ca1';

let repository: ProfileRepository;

const dynamoDbSend = jest.fn();
const dynamoDBMock = {
  send: dynamoDbSend,
} as unknown as DynamoDBDocumentClient;
const transactWriteCommandMock = TransactWriteCommand as jest.MockedClass<
  typeof TransactWriteCommand
>;
const putCommandMock = PutCommand as jest.MockedClass<typeof PutCommand>;
const updateCommandMock = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;

describe('ProfileRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
    repository = new ProfileRepository(dynamoDBMock);
  });

  describe('createProfile', () => {
    it('should create a new profile', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce(memberId).mockReturnValueOnce(applicationId);
      dynamoDbSend.mockResolvedValue({});
      const createProfile: CreateProfileModel = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dateOfBirth: '1990-01-01',
      };

      const result = await repository.createProfile(createProfile);

      expect(result).toBe(memberId);
      expect(transactWriteCommandMock).toHaveBeenCalledWith({
        TransactItems: [
          {
            Put: {
              TableName: 'memberProfiles',
              Item: {
                pk: memberKey(memberId),
                sk: 'PROFILE',
                memberId,
                ...createProfile,
              },
            },
          },
          {
            Put: {
              TableName: 'memberProfiles',
              Item: {
                pk: memberKey(memberId),
                sk: `APPLICATION#${applicationId}`,
                memberId,
                applicationId,
                startDate: '2023-01-01T00:00:00.000Z',
                eligibilityStatus: EligibilityStatus.INELIGIBLE,
                applicationReason: ApplicationReason.SIGNUP,
              },
            },
          },
        ],
      });
    });
  });

  describe('updateProfile', () => {
    it('should update an existing profile', async () => {
      dynamoDbSend.mockResolvedValue({});
      const updateData: Partial<UpdateProfileModel> = { firstName: 'Jane' };

      await repository.updateProfile(memberId, updateData);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: 'PROFILE',
        },
        UpdateExpression: 'SET #firstName = :firstName, #lastUpdated = :lastUpdated ',
        ExpressionAttributeNames: {
          '#firstName': 'firstName',
          '#lastUpdated': 'lastUpdated',
        },
        ExpressionAttributeValues: {
          ':firstName': 'Jane',
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
        },
      });
    });
  });

  describe('getProfiles', () => {
    it('should return an empty array if no profiles are found', async () => {
      dynamoDbSend.mockResolvedValue({ Items: [] });

      const result = await repository.getProfiles();

      expect(result).toEqual([]);
    });

    it('should return profiles', async () => {
      const items = [profile];
      dynamoDbSend.mockResolvedValue({ Items: items });

      const result = await repository.getProfiles();

      expect(result).toEqual(items.map((item) => ProfileModel.parse(item)));
    });
  });

  describe('getProfile', () => {
    it('should throw NotFoundError if profile is not found', async () => {
      dynamoDbSend.mockResolvedValue({ Items: [] });

      await expect(repository.getProfile(memberId)).rejects.toThrow(NotFoundError);
    });

    it('should return the profile if found', async () => {
      dynamoDbSend.mockResolvedValue({
        Items: [
          {
            ...profile,
            pk: memberKey(memberId),
            sk: 'PROFILE',
          },
          {
            ...application,
            pk: memberKey(memberId),
            sk: `APPLICATION#${applicationId}`,
          },
        ],
      });

      const result = await repository.getProfile(memberId);

      expect(result).toEqual(
        ProfileModel.parse({ ...profile, applications: [application], cards: [] }),
      );
    });
  });

  describe('getNotes', () => {
    it('should return an empty array if no notes are found', async () => {
      dynamoDbSend.mockResolvedValue({ Items: [] });

      const result = await repository.getNotes(memberId);

      expect(result).toEqual([]);
    });

    it('should return notes', async () => {
      const note: NoteModel = {
        noteId: noteId,
        text: 'Test note',
        created: '2023-01-01T00:00:00.000Z',
        lastUpdated: '2023-01-01T00:00:00.000Z',
      };
      const items = [note];
      dynamoDbSend.mockResolvedValue({ Items: items });

      const result = await repository.getNotes(memberId);

      expect(result).toEqual(items.map((item) => NoteModel.parse(item)));
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      (uuidv4 as jest.Mock).mockReturnValueOnce(noteId);
      dynamoDbSend.mockResolvedValue({});
      const createNote: CreateNoteModel = {
        text: 'Test note',
      };

      const result = await repository.createNote(memberId, createNote);

      expect(result).toBe(noteId);
      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(putCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Item: {
          created: '2023-01-01T00:00:00.000Z',
          lastUpdated: '2023-01-01T00:00:00.000Z',
          noteId: noteId,
          pk: memberKey(memberId),
          sk: noteKey(noteId),
          text: 'Test note',
        },
      });
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      dynamoDbSend.mockResolvedValue({});
      const updateData = { text: 'Updated note' };

      await repository.updateNote(memberId, noteId, updateData);

      expect(dynamoDBMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(updateCommandMock).toHaveBeenCalledWith({
        TableName: 'memberProfiles',
        Key: {
          pk: memberKey(memberId),
          sk: noteKey(noteId),
        },
        UpdateExpression: 'SET #text = :text, #lastUpdated = :lastUpdated ',
        ExpressionAttributeNames: {
          '#text': 'text',
          '#lastUpdated': 'lastUpdated',
        },
        ExpressionAttributeValues: {
          ':lastUpdated': '2023-01-01T00:00:00.000Z',
          ':text': 'Updated note',
        },
      });
    });
  });
});
