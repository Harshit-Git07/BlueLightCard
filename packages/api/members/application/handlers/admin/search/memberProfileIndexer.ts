import { SQSEvent } from 'aws-lambda';
import { logger, sqsMiddleware } from '../../../middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import {
  AttributeValue as StreamAttributeValue,
  DynamoDBRecord,
} from 'aws-lambda/trigger/dynamodb-stream';
import { APPLICATION, CARD, PROFILE } from '@blc-mono/members/application/repositories/repository';
import { MemberDocumentModel } from '@blc-mono/members/application/models/memberDocument';
import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchService';
import { createMemberProfileOpenSearchDocuments } from '@blc-mono/members/application/handlers/admin/search/service/opensearchMemberProfileDocument';
import {
  getDocumentFromApplicationRecord,
  getDocumentFromCardRecord,
  getDocumentFromProfileRecord,
} from '@blc-mono/members/application/handlers/admin/search/service/parseDocumentFromRecord';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';

type StreamRecordTypes = 'Profile' | 'Application' | 'Card';

const openSearchService = new MembersOpenSearchService();
const organisationService = new OrganisationService();

const unwrappedHandler = async (event: SQSEvent) => {
  const memberProfileDocuments: MemberDocumentModel[] = [];

  for (const record of event.Records) {
    const dynamoDBStreamRecord = JSON.parse(record.body) as DynamoDBRecord;

    const sortKey = parseRecordSortKey(dynamoDBStreamRecord.dynamodb?.Keys?.sk);
    const recordType = getStreamRecordType(sortKey);

    let memberProfileDocument: MemberDocumentModel | undefined;
    let updateEmployer: boolean = false;
    let updateOrganisation: boolean = false;
    let profileEmployerName: string | undefined;

    switch (recordType) {
      case 'Profile':
        const {
          memberDocument,
          employerIdChanged,
          organisationIdChanged,
          profileEmployerName: employerName,
        } = getDocumentFromProfileRecord(dynamoDBStreamRecord);
        memberProfileDocument = memberDocument;
        updateEmployer = employerIdChanged;
        updateOrganisation = organisationIdChanged;
        profileEmployerName = employerName;
        break;
      case 'Application':
        memberProfileDocument = getDocumentFromApplicationRecord(dynamoDBStreamRecord);
        break;
      case 'Card':
        memberProfileDocument = getDocumentFromCardRecord(dynamoDBStreamRecord);
        break;
    }

    if (memberProfileDocument) {
      const enrichedMemberProfileDocument = await enrichMemberProfileDocument(
        memberProfileDocument,
        updateEmployer,
        updateOrganisation,
        profileEmployerName,
      );
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

const enrichMemberProfileDocument = async (
  memberProfileDocument: MemberDocumentModel,
  updateEmployer: boolean,
  updateOrganisation: boolean,
  profileEmployerName: string | undefined,
) => {
  return {
    ...memberProfileDocument,
    organisationName: await getOrganisationName(
      updateOrganisation,
      memberProfileDocument.organisationId,
    ),
    employerName: await getEmployerName(
      updateEmployer,
      memberProfileDocument.organisationId,
      memberProfileDocument.employerId,
      profileEmployerName,
    ),
  };
};

const getOrganisationName = async (
  updateOrganisationId: boolean,
  organisationId: string | undefined,
): Promise<string | undefined> => {
  if (!organisationId || !updateOrganisationId) return undefined;

  try {
    return (await organisationService.getOrganisation(organisationId)).name;
  } catch (error) {
    logger.debug(`Error fetching organisation with ID: ${organisationId}.`);
    return undefined;
  }
};

const getEmployerName = async (
  updateEmployer: boolean,
  organisationId: string | undefined,
  employerId: string | undefined,
  profileEmployerName: string | undefined,
): Promise<string | undefined> => {
  if (profileEmployerName && !employerId) return profileEmployerName;

  if (!organisationId || !employerId || !updateEmployer) return undefined;

  try {
    return (await organisationService.getEmployer(organisationId, employerId)).name;
  } catch (error) {
    logger.debug(`Error fetching employer with ID: ${employerId}.`);
    return undefined;
  }
};

export const handler = sqsMiddleware(unwrappedHandler);
