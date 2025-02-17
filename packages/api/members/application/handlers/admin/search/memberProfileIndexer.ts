import { SQSEvent, SQSRecord } from 'aws-lambda';
import {
  logger,
  sqsMiddleware,
} from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import {
  AttributeValue as StreamAttributeValue,
  DynamoDBRecord,
} from 'aws-lambda/trigger/dynamodb-stream';
import { MemberDocumentModel } from '@blc-mono/shared/models/members/memberDocument';
import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchService';
import { createMemberProfileOpenSearchDocuments } from '@blc-mono/members/application/handlers/admin/search/service/opensearchMemberProfileDocument';
import {
  getDocumentFromApplicationRecord,
  getDocumentFromCardRecord,
  getDocumentFromProfileRecord,
} from '@blc-mono/members/application/handlers/admin/search/service/parseDocumentFromRecord';
import { OrganisationService } from '@blc-mono/members/application/services/organisation/organisationService';
import { getStreamRecordType } from '@blc-mono/members/application/types/steamRecordTypes';

const openSearchService = new MembersOpenSearchService();
const organisationService = new OrganisationService();

const unwrappedHandler = async (event: SQSEvent) => {
  const memberProfileDocuments: MemberDocumentModel[] = [];

  for (const record of event.Records) {
    const enrichedMemberProfileDocument = await processRecord(record);
    if (enrichedMemberProfileDocument) {
      memberProfileDocuments.push(enrichedMemberProfileDocument);
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
    logger.error(`Error upserting records in index : ${error}`);
    throw error;
  }
};

async function processRecord(record: SQSRecord): Promise<MemberDocumentModel | undefined> {
  const dynamoDBStreamRecord = JSON.parse(record.body) as DynamoDBRecord;

  const sortKey = parseRecordSortKey(dynamoDBStreamRecord.dynamodb?.Keys?.sk);
  if (!sortKey) throw new Error(`Stream record missing sortKey: '${sortKey}'`);

  const recordType = getStreamRecordType(sortKey);

  switch (recordType) {
    case 'Profile': {
      const profile = getDocumentFromProfileRecord(dynamoDBStreamRecord);
      return await enrichMemberProfileDocument(
        profile.memberDocument,
        profile.organisationIdChanged,
        profile.employerIdChanged,
        profile.profileEmployerName,
      );
    }
    case 'Application':
      return await enrichMemberProfileDocument(
        getDocumentFromApplicationRecord(dynamoDBStreamRecord),
      );
    case 'Card':
      return await enrichMemberProfileDocument(getDocumentFromCardRecord(dynamoDBStreamRecord));
    case 'Note':
      // TODO: Implement note related functionality
      return undefined;
  }
}

function parseRecordSortKey(sortKey: StreamAttributeValue | undefined): string {
  if (!sortKey) throw new ValidationError(`Stream record missing sortKey: '${sortKey}'`);

  const sortKeyAsString = sortKey.S;
  if (!sortKeyAsString) throw new Error(`Stream record missing sortKey: '${sortKeyAsString}'`);

  return sortKeyAsString;
}

async function enrichMemberProfileDocument(
  memberProfileDocument: MemberDocumentModel | undefined,
  shouldUpdateOrganisation: boolean = false,
  shouldUpdateEmployer: boolean = false,
  profileEmployerName: string | undefined = undefined,
): Promise<MemberDocumentModel | undefined> {
  if (memberProfileDocument === undefined) return undefined;

  return {
    ...memberProfileDocument,
    organisationName: await getOrganisationName(
      shouldUpdateOrganisation,
      memberProfileDocument.organisationId,
    ),
    employerName: await getEmployerName(
      shouldUpdateEmployer,
      memberProfileDocument.organisationId,
      memberProfileDocument.employerId,
      profileEmployerName,
    ),
  };
}

async function getOrganisationName(
  shouldUpdateOrganisation: boolean,
  organisationId: string | undefined,
): Promise<string | undefined> {
  if (!shouldUpdateOrganisation || !organisationId) return undefined;

  try {
    return (await organisationService.getOrganisation(organisationId)).name;
  } catch (error) {
    logger.debug(`Error fetching organisation with ID: ${organisationId}`);
    return undefined;
  }
}

async function getEmployerName(
  shouldUpdateEmployer: boolean,
  organisationId: string | undefined,
  employerId: string | undefined,
  profileEmployerName: string | undefined,
): Promise<string | undefined> {
  if (profileEmployerName && !employerId) return profileEmployerName;
  if (!organisationId || !employerId || !shouldUpdateEmployer) return undefined;

  try {
    return (await organisationService.getEmployer(organisationId, employerId)).name;
  } catch (error) {
    logger.debug(`Error fetching employer with ID: ${employerId}`);
    return undefined;
  }
}

export const handler = sqsMiddleware(unwrappedHandler);
