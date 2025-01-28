import * as getEnv from '@blc-mono/core/utils/getEnv';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import {
  getDocumentFromApplicationRecord,
  getDocumentFromCardRecord,
  getDocumentFromProfileRecord,
} from '@blc-mono/members/application/handlers/admin/search/service/parseDocumentFromRecord';
import { APPLICATION, CARD, PROFILE } from '@blc-mono/members/application/repositories/repository';
import { MembersOpenSearchService } from '@blc-mono/members/application/handlers/admin/search/service/membersOpenSearchService';
import { MemberDocumentModel } from '@blc-mono/shared/models/members/memberDocument';
import {
  createMemberProfileOpenSearchDocuments,
  OpenSearchBulkUpdateCommand,
} from '@blc-mono/members/application/handlers/admin/search/service/opensearchMemberProfileDocument';
import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';

jest.mock('@blc-mono/members/application/handlers/admin/search/service/parseDocumentFromRecord');
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock(
  '@blc-mono/members/application/handlers/admin/search/service/opensearchMemberProfileDocument',
);
jest.mock('@blc-mono/members/application/services/organisationService');

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
  email: 'email',
  signupDate: 'signupDate',
  organisationId: 'organisationId',
  employerId: 'employerId',
  userStatus: 'userStatus',
  applicationId: 'applicationId',
  startDate: 'startDate',
  eligibilityStatus: EligibilityStatus.ELIGIBLE,
  paymentStatus: PaymentStatus.AWAITING_PAYMENT,
  cardNumber: 'cardNumber',
  expiryDate: 'expiryDate',
  cardStatus: CardStatus.VIRTUAL_CARD,
};
const openSearchBulkCommand: OpenSearchBulkUpdateCommand = {
  update: { _id: 'id' },
};
const organisation: OrganisationModel = {
  name: 'Organisation1',
} as OrganisationModel;
const employer: EmployerModel = {
  name: 'Employer1',
} as EmployerModel;

const getOrganisationMock = jest.spyOn(OrganisationService.prototype, 'getOrganisation');
const getEmployerMock = jest.spyOn(OrganisationService.prototype, 'getEmployer');

describe('memberProfileIndexer handler', () => {
  let upsertDocumentsToIndexSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => 'example-variable');

    jest
      .spyOn(MembersOpenSearchService.prototype, 'getMemberProfilesIndexName')
      .mockReturnValue('indexName');
    upsertDocumentsToIndexSpy = jest
      .spyOn(MembersOpenSearchService.prototype, 'upsertDocumentsToIndex')
      .mockResolvedValue(undefined);

    getOrganisationMock.mockResolvedValue(organisation);
    getEmployerMock.mockResolvedValue(employer);
  });

  it('should map profile record to document if sortKey is "Profile"', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue({
      memberDocument,
      employerIdChanged: false,
      organisationIdChanged: false,
    });
    const event = buildSQSEventFor(PROFILE);

    await handler(event);

    expect(getDocumentFromProfileRecordMock).toHaveBeenCalledWith({
      dynamodb: {
        Keys: {
          sk: { S: `${PROFILE}#1234` },
        },
      },
    });
  });

  it('should enrich member profile document with employer and organisation details', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue({
      memberDocument,
      employerIdChanged: true,
      organisationIdChanged: true,
    });
    const event = buildSQSEventFor(PROFILE);

    await handler(event);

    expect(createMemberProfileOpenSearchDocumentsMock).toHaveBeenCalledWith([
      {
        ...memberDocument,
        employerName: 'Employer1',
        organisationName: 'Organisation1',
      },
    ]);
  });

  it('should set "employerName" as undefined if no employer found', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue({
      memberDocument,
      employerIdChanged: true,
      organisationIdChanged: false,
    });
    getEmployerMock.mockRejectedValue(new Error('Employer not found'));
    const event = buildSQSEventFor(PROFILE);

    await handler(event);

    expect(createMemberProfileOpenSearchDocumentsMock).toHaveBeenCalledWith([
      {
        ...memberDocument,
        employerName: undefined,
      },
    ]);
  });

  it('should set "organisationName" as undefined if no organisation found', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue({
      memberDocument,
      employerIdChanged: false,
      organisationIdChanged: true,
    });
    getOrganisationMock.mockRejectedValue(new Error('Employer not found'));
    const event = buildSQSEventFor(PROFILE);

    await handler(event);

    expect(createMemberProfileOpenSearchDocumentsMock).toHaveBeenCalledWith([
      {
        ...memberDocument,
        organisationName: undefined,
      },
    ]);
  });

  it('should enrich member profile document with profile employer name if no employerId', async () => {
    const memberDocumentWithoutEmployerId = {
      ...memberDocument,
      employerId: undefined,
    };
    getDocumentFromProfileRecordMock.mockReturnValue({
      memberDocument: memberDocumentWithoutEmployerId,
      employerIdChanged: true,
      organisationIdChanged: true,
      profileEmployerName: 'employerNameString',
    });
    const event = buildSQSEventFor(PROFILE);

    await handler(event);

    expect(createMemberProfileOpenSearchDocumentsMock).toHaveBeenCalledWith([
      {
        ...memberDocument,
        employerName: 'employerNameString',
        employerId: undefined,
        organisationName: 'Organisation1',
      },
    ]);
  });

  it('should map application record to document if sortKey is "Application"', async () => {
    getDocumentFromApplicationRecordMock.mockReturnValue(memberDocument);
    const event = buildSQSEventFor(APPLICATION);

    await handler(event);

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

    await handler(event);

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

    await expect(handler(event)).rejects.toThrow("Unknown sortKey prefix: 'Unknown#1234'");
  });

  it('should throw an error if no sortKey on record', async () => {
    const event = buildSQSEventWithoutSortKey();

    await expect(handler(event)).rejects.toThrow("Stream record missing sortKey: 'undefined'");
  });

  it('should call opensearch service with documents', async () => {
    getDocumentFromProfileRecordMock.mockReturnValue({
      memberDocument,
      organisationIdChanged: false,
      employerIdChanged: false,
    });
    createMemberProfileOpenSearchDocumentsMock.mockReturnValue([
      openSearchBulkCommand,
      openSearchBulkCommand,
    ]);
    const event = buildSQSEventFor(PROFILE);

    await handler(event);

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

async function handler(event: SQSEvent) {
  return await (await import('../memberProfileIndexer')).handler(event, emptyContextStub);
}
