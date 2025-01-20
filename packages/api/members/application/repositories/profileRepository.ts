import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';
import { v4 as uuidv4 } from 'uuid';
import { EligibilityStatus } from '../models/enums/EligibilityStatus';
import { ApplicationReason } from '../models/enums/ApplicationReason';
import { CreateNoteModel, NoteModel } from '../models/noteModel';
import { CardModel } from '../models/cardModel';
import { ApplicationModel } from '../models/applicationModel';
import { CreateProfileModel, ProfileModel } from '../models/profileModel';
import { APPLICATION, MEMBER, memberKey, NOTE, noteKey, PROFILE, Repository } from './repository';
import { NotFoundError } from '../errors/NotFoundError';
import { omit } from 'lodash';

export class ProfileRepository extends Repository {
  constructor(
    dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {
    super(dynamoDB);
  }

  async createProfile(profile: CreateProfileModel): Promise<string> {
    const memberId = uuidv4();
    const applicationId = uuidv4();

    const params = {
      TransactItems: [
        {
          Put: {
            TableName: this.tableName,
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
            TableName: this.tableName,
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

  async updateProfile(memberId: string, profile: Partial<ProfileModel>): Promise<void> {
    const profileWithoutApplicationsOrCards = omit(profile, ['applications', 'cards']);
    await this.partialUpdate({
      tableName: this.tableName,
      pk: memberKey(memberId),
      sk: PROFILE,
      data: {
        ...profileWithoutApplicationsOrCards,
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  // This is temporary until we have OpenSearch in place
  async getProfiles(): Promise<ProfileModel[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
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
      TableName: this.tableName,
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
      TableName: this.tableName,
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
      TableName: this.tableName,
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
      tableName: this.tableName,
      pk: memberKey(memberId),
      sk: noteKey(noteId),
      data: {
        ...note,
        lastUpdated: new Date().toISOString(),
      },
    });
  }
}
