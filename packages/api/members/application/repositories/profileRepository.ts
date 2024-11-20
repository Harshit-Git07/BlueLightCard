import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from './dynamoClient';
import { Table } from 'sst/node/table';
import { v4 as uuidv4 } from 'uuid';
import { EligibilityStatus } from '../models/enums/EligibilityStatus';
import { ApplicationReason } from '../models/enums/ApplicationReason';
import { NoteModel } from '../models/noteModel';
import { CardModel } from '../models/cardModel';
import { ApplicationModel } from '../models/applicationModel';
import { CreateProfileModel, ProfileModel, UpdateProfileModel } from '../models/profileModel';
import { APPLICATION, memberKey, PROFILE, CARD, MEMBER } from './repository';
import { NotFoundError } from '../errors/NotFoundError';

export class ProfileRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberProfiles.tableName,
  ) {}

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
              firstName: profile.firstName,
              lastName: profile.lastName,
              ...(profile.dateOfBirth && { dateOfBirth: profile.dateOfBirth }),
              emailAddress: profile.email,
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
              verificationMethod: '',
            },
          },
        },
      ],
    };

    await this.dynamoDB.send(new TransactWriteCommand(params));
    return memberId;
  }

  async updateProfile(memberId: string, profile: Partial<ProfileModel>): Promise<void> {
    const updateExpression: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(profile) as (keyof ProfileModel)[]) {
      if (profile[field] !== undefined) {
        updateExpression.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = profile[field];
      }
    }

    const params = {
      TableName: this.tableName,
      Key: {
        pk: memberKey(memberId),
        sk: PROFILE,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await this.dynamoDB.send(new UpdateCommand(params));
  }

  // This is temporary until we have OpenSearch in place
  async getProfiles(): Promise<ProfileModel[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression: 'begins_with(pk, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': MEMBER,
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
    let applications: ApplicationModel[] = [];

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

      profile.card = cards[0];
    }

    profile.applications = applications;

    return profile;
  }

  async getNotes(memberId: string): Promise<NoteModel[]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': memberKey(memberId),
        ':sk': 'NOTE#',
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));

    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) => NoteModel.parse(item));
  }

  async createNote(memberId: string, note: NoteModel): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        pk: memberKey(memberId),
        sk: `NOTE#${Date.now()}`,
        ...note,
        timestamp: new Date().toISOString(),
      },
    };
    await this.dynamoDB.send(new PutCommand(params));
  }
}
