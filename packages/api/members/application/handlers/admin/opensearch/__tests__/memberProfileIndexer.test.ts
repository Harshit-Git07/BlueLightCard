import * as getEnv from '@blc-mono/core/utils/getEnv';
import { Context, SQSEvent, SQSRecord } from 'aws-lambda';
import {
  getDocumentFromApplicationRecord,
  getDocumentFromCardRecord,
  getDocumentFromProfileRecord,
} from '@blc-mono/members/application/handlers/admin/opensearch/service/parseDocumentFromRecord';
import { APPLICATION, CARD, PROFILE } from '@blc-mono/members/application/repositories/repository';
import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/opensearch/service/membersOpenSearchService';
import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';
import {
  createMemberProfileOpenSearchDocuments,
  OpenSearchBulkUpdateCommand,
} from '@blc-mono/members/application/handlers/admin/opensearch/service/opensearchMemberProfileDocument';

jest.mock(
  '@blc-mono/members/application/handlers/admin/opensearch/service/parseDocumentFromRecord',
);
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock(
  '@blc-mono/members/application/handlers/admin/opensearch/service/opensearchMemberProfileDocument',
);

const getDocumentFromProfileRecordMock = jest.mocked(getDocumentFromProfileRecord);
const getDocumentFromApplicationRecordMock = jest.mocked(getDocumentFromApplicationRecord);
const getDocumentFromCardRecordMock = jest.mocked(getDocumentFromCardRecord);

const createMemberProfileOpenSearchDocumentsMock = jest.mocked(
  createMemberProfileOpenSearchDocuments,
);

const memberDocument: MemberDocumentModel = {
  memberId: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  emailAddress: 'email',
  signupDate: 'signupDate',
  organisationId: 'organisationId',
  employerId: 'employerId',
  userStatus: 'userStatus',
  applicationId: 'applicationId',
  startDate: 'startDate',
  eligibilityStatus: 'eligibilityStatus',
  paymentStatus: 'paymentStatus',
  cardNumber: 'cardNumber',
  expiryDate: 'expiryDate',
  cardStatus: 'cardStatus',
};
const openSearchBulkCommand: OpenSearchBulkUpdateCommand = {
  update: { _id: 'id' },
};

describe('memberProfileIndexer handler', () => {
  const context = {} as Context;
  let upsertDocumentsToIndexSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => 'example-variable');

    jest
      .spyOn(MembersOpenSearchService.prototype, 'getMemberProfilesIndexName')
      .mockReturnValue('indexName');
    upsertDocumentsToIndexSpy = jest
      .spyOn(MembersOpenSearchService.prototype, 'upsertDocumentsToIndex')
      .mockResolvedValue(undefined);
  });

  it('should map profile record to document if sortKey is "Profile"', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue(memberDocument);
    const event = buildSQSEventFor(PROFILE);

    await handler(event, context);

    expect(getDocumentFromProfileRecordMock).toHaveBeenCalledWith({
      dynamodb: {
        Keys: {
          sk: { S: `${PROFILE}#1234` },
        },
      },
    });
  });

  it('should map application record to document if sortKey is "Application"', async () => {
    getDocumentFromApplicationRecordMock.mockReturnValue(memberDocument);
    const event = buildSQSEventFor(APPLICATION);

    await handler(event, context);

    expect(getDocumentFromApplicationRecordMock).toHaveBeenCalledWith({
      dynamodb: {
        Keys: {
          sk: { S: `${APPLICATION}#1234` },
        },
      },
    });
  });

  it('should map card record to document if sortKey is "Card"', async () => {
    getDocumentFromCardRecordMock.mockReturnValue(memberDocument);
    const event = buildSQSEventFor(CARD);

    await handler(event, context);

    expect(getDocumentFromCardRecordMock).toHaveBeenCalledWith({
      dynamodb: {
        Keys: {
          sk: { S: `${CARD}#1234` },
        },
      },
    });
  });

  it('should throw an error if sortKey is not recognised', async () => {
    const event = buildSQSEventFor('Unknown');

    await expect(handler(event, context)).rejects.toThrow('Unknown sortKey prefix: Unknown#1234');
  });

  it('should throw an error if no sortKey on record', async () => {
    const event = buildSQSEventWithoutSortKey();

    await expect(handler(event, context)).rejects.toThrow('Stream record missing sortKey: sk');
  });

  it('should call opensearch service with documents', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue(memberDocument);
    createMemberProfileOpenSearchDocumentsMock.mockReturnValue([
      openSearchBulkCommand,
      openSearchBulkCommand,
    ]);
    const event = buildSQSEventFor(PROFILE);

    await handler(event, context);

    expect(upsertDocumentsToIndexSpy).toHaveBeenCalledWith(
      [openSearchBulkCommand, openSearchBulkCommand],
      'indexName',
    );
  });
});

const buildSQSEventFor = (sortKeyPrefix: string): SQSEvent => {
  return {
    Records: [
      {
        body: JSON.stringify({
          dynamodb: {
            Keys: {
              sk: { S: `${sortKeyPrefix}#1234` },
            },
          },
        }),
      } as SQSRecord,
    ],
  };
};
const buildSQSEventWithoutSortKey = (): SQSEvent => {
  return {
    Records: [
      {
        body: JSON.stringify({
          dynamodb: {
            Keys: {},
          },
        }),
      } as SQSRecord,
    ],
  };
};

async function handler(event: SQSEvent, context: Context) {
  return (await import('../memberProfileIndexer')).handler(event, context);
}
