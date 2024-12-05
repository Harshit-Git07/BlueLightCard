import { SQSEvent } from 'aws-lambda';
import { sqsMiddleware } from '../../../middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import {
  AttributeValue as StreamAttributeValue,
  DynamoDBRecord,
} from 'aws-lambda/trigger/dynamodb-stream';
import { APPLICATION, CARD, PROFILE } from '@blc-mono/members/application/repositories/repository';
import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';
import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/opensearch/service/membersOpenSearchService';
import { createMemberProfileOpenSearchDocuments } from '@blc-mono/members/application/handlers/admin/opensearch/service/opensearchMemberProfileDocument';
import {
  getDocumentFromApplicationRecord,
  getDocumentFromCardRecord,
  getDocumentFromProfileRecord,
} from '@blc-mono/members/application/handlers/admin/opensearch/service/parseDocumentFromRecord';

type StreamRecordTypes = 'Profile' | 'Application' | 'Card';

const openSearchService = new MembersOpenSearchService();

const unwrappedHandler = async (event: SQSEvent) => {
  const memberProfileDocuments: MemberDocumentModel[] = [];

  for (const record of event.Records) {
    const dynamoDBStreamRecord = JSON.parse(record.body) as DynamoDBRecord;

    const sortKey = parseRecordSortKey(dynamoDBStreamRecord.dynamodb?.Keys?.sk);
    const recordType = getStreamRecordType(sortKey);

    let memberProfileDocument: MemberDocumentModel | undefined;

    switch (recordType) {
      case 'Profile':
        memberProfileDocument = getDocumentFromProfileRecord(dynamoDBStreamRecord);
        break;
      case 'Application':
        memberProfileDocument = getDocumentFromApplicationRecord(dynamoDBStreamRecord);
        break;
      case 'Card':
        memberProfileDocument = getDocumentFromCardRecord(dynamoDBStreamRecord);
        break;
    }

    if (memberProfileDocument) {
      memberProfileDocuments.push(memberProfileDocument);
    }
  }

  try {
    if (memberProfileDocuments.length > 0) {
      const openSearchDocuments = createMemberProfileOpenSearchDocuments(memberProfileDocuments);
      await openSearchService.upsertDocumentsToIndex(
        openSearchDocuments,
        openSearchService.getMemberProfilesIndexName(),
      );
    }
  } catch (error) {
    console.error('Error upserting records in index', JSON.stringify(error));
    throw error;
  }
};

const parseRecordSortKey = (sortKey: StreamAttributeValue | undefined): string => {
  if (!sortKey) throw new ValidationError('Stream record missing sortKey: sk');

  return sortKey.S as string;
};

const getStreamRecordType = (sortKey: string | undefined): StreamRecordTypes => {
  if (!sortKey) throw new Error('Stream record missing sortKey: sk');

  if (sortKey.startsWith(PROFILE)) {
    return 'Profile';
  } else if (sortKey.startsWith(APPLICATION)) {
    return 'Application';
  } else if (sortKey.startsWith(CARD)) {
    return 'Card';
  }

  throw new Error(`Unknown sortKey prefix: ${sortKey}`);
};

export const handler = sqsMiddleware(unwrappedHandler);
