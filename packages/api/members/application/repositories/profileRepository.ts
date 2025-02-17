import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { CreateNoteModel, NoteModel } from '@blc-mono/shared/models/members/noteModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import {
  CreateProfileModel,
  ProfileModel,
  UpdateProfileModel,
} from '@blc-mono/shared/models/members/profileModel';
import {
  APPLICATION,
  MEMBER,
  memberKey,
  NOTE,
  noteKey,
  PROFILE,
  Repository,
} from '@blc-mono/members/application/repositories/base/repository';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/DeleteCommand';
import { defaultDynamoDbClient } from '@blc-mono/members/application/providers/DynamoDb';
import { memberProfilesTableName } from '@blc-mono/members/application/providers/Tables';

export class ProfileRepository extends Repository {
  constructor(dynamoDB = defaultDynamoDbClient) {
    super(dynamoDB);
  }

  async createProfile(profile: CreateProfileModel): Promise<string> {
    const memberId = uuidv4();
    const applicationId = uuidv4();

    const params = {
      TransactItems: [
        {
          Put: {
            TableName: memberProfilesTableName(),
            Item: {
              pk: memberKey(memberId),
              sk: PROFILE,
              memberId,
              ...profile,
            },
          },
        },
        {
          Put: {
            TableName: memberProfilesTableName(),
            Item: {
              pk: memberKey(memberId),
              sk: `${APPLICATION}#${applicationId}`,
              memberId,
              applicationId,
              startDate: new Date().toISOString(),
              eligibilityStatus: EligibilityStatus.INELIGIBLE,
              applicationReason: ApplicationReason.SIGNUP,
            },
          },
        },
      ],
    };

    await this.dynamoDB.send(new TransactWriteCommand(params));
    return memberId;
  }

  async deleteProfile(memberId: string): Promise<void> {
    const params: DeleteCommandInput = {
      TableName: memberProfilesTableName(),
      Key: {
        pk: memberKey(memberId),
        sk: PROFILE,
      },
    };

    await this.dynamoDB.send(new DeleteCommand(params));
  }

  async updateProfile(memberId: string, profile: Partial<UpdateProfileModel>): Promise<void> {
    await this.partialUpdate({
      tableName: memberProfilesTableName(),
      pk: memberKey(memberId),
      sk: PROFILE,
      data: {
        ...profile,
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  // This is temporary until we have OpenSearch in place
  async getProfiles(): Promise<ProfileModel[]> {
    const params: ScanCommandInput = {
      TableName: memberProfilesTableName(),
      FilterExpression: 'begins_with(pk, :member) AND begins_with(sk, :profile)',
      ExpressionAttributeValues: {
        ':member': MEMBER,
        ':profile': PROFILE,
      },
      Limit: 100,
    };

    const result = await this.dynamoDB.send(new ScanCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => ProfileModel.parse(item));
  }

  async getProfile(memberId: string): Promise<ProfileModel> {
    const params: QueryCommandInput = {
      TableName: memberProfilesTableName(),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
      },
    };

    let profile: ProfileModel | undefined;
    let cards: CardModel[] = [];
    const applications: ApplicationModel[] = [];

    const result = await this.dynamoDB.send(new QueryCommand(params));
    result.Items?.forEach((item) => {
      if (item.sk.includes('PROFILE')) {
        profile = ProfileModel.parse(item);
      } else if (item.sk.includes('CARD#')) {
        cards.push(CardModel.parse(item));
      } else if (item.sk.includes('APPLICATION#')) {
        applications.push(ApplicationModel.parse(item));
      }
    });

    if (!profile) {
      throw new NotFoundError('Member profile not found');
    }

    if (cards.length > 1) {
      cards = cards.sort((a, b) => {
        if (a.expiryDate === null || a.expiryDate === undefined) return 1;
        if (b.expiryDate === null || b.expiryDate === undefined) return -1;
        return b.expiryDate.localeCompare(a.expiryDate);
      });
    }

    profile.cards = cards;
    profile.applications = applications;

    return profile;
  }

  async getNotes(memberId: string): Promise<NoteModel[]> {
    const params: QueryCommandInput = {
      TableName: memberProfilesTableName(),
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':sk': NOTE,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) => NoteModel.parse(item));
  }

  async createNote(memberId: string, note: CreateNoteModel): Promise<string> {
    const noteId = uuidv4();
    const params = {
      TableName: memberProfilesTableName(),
      Item: {
        pk: memberKey(memberId),
        sk: noteKey(noteId),
        noteId,
        ...note,
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    };
    await this.dynamoDB.send(new PutCommand(params));

    return noteId;
  }

  async updateNote(memberId: string, noteId: string, note: Partial<NoteModel>): Promise<void> {
    await this.partialUpdate({
      tableName: memberProfilesTableName(),
      pk: memberKey(memberId),
      sk: noteKey(noteId),
      data: {
        ...note,
        lastUpdated: new Date().toISOString(),
      },
    });
  }
}
