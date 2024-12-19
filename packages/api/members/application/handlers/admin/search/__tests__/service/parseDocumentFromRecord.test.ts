import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import {
  getDocumentFromApplicationRecord,
  getDocumentFromCardRecord,
  getDocumentFromProfileRecord,
} from '../../service/parseDocumentFromRecord';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda/trigger/dynamodb-stream';
import { subDays } from 'date-fns';

jest.mock('@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages');

const unmarshallStreamImagesMock = jest.mocked(unmarshallStreamImages);

const streamRecord: StreamRecord = {
  Keys: {
    pk: {
      S: '123',
    },
  },
};

const insertRecord: DynamoDBRecord = {
  eventName: 'INSERT',
  dynamodb: streamRecord,
} as DynamoDBRecord;
const removeRecord: DynamoDBRecord = {
  eventName: 'REMOVE',
  dynamodb: streamRecord,
} as DynamoDBRecord;

describe('getDocumentFromProfileRecord', () => {
  it('should throw validation error if new profile not found in stream record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: undefined,
      newImage: undefined,
    });

    expect(() => getDocumentFromProfileRecord(insertRecord)).toThrow(
      'New profile image not found in stream record: 123',
    );
  });

  it('should return undefined if "REMOVE" record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {},
      newImage: undefined,
    });

    const result = getDocumentFromProfileRecord(removeRecord);

    expect(result).toEqual({
      memberDocument: undefined,
      employerIdChanged: false,
      organisationIdChanged: false,
    });
  });

  it('should include properties from new profile', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        firstName: 'John',
        employerId: 'employerId',
        organisationId: 'organisationId',
      },
      newImage: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
      },
    });

    const result = getDocumentFromProfileRecord(insertRecord);

    expect(result).toEqual({
      memberDocument: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
      },
      employerIdChanged: false,
      organisationIdChanged: false,
      profileEmployerName: undefined,
    });
  });

  it('should return organisation & employer as "changed" if no old record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: undefined,
      newImage: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
      },
    });

    const result = getDocumentFromProfileRecord(insertRecord);

    expect(result).toEqual({
      memberDocument: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
      },
      employerIdChanged: true,
      organisationIdChanged: true,
      profileEmployerName: undefined,
    });
  });

  it('should return organisation as "changed" if value changed', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId1',
      },
      newImage: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId2',
      },
    });

    const result = getDocumentFromProfileRecord(insertRecord);

    expect(result).toEqual({
      memberDocument: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId2',
      },
      employerIdChanged: false,
      organisationIdChanged: true,
      profileEmployerName: undefined,
    });
  });

  it('should return organisation as "changed" if full ingestion triggered', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
        ingestionLastTriggered: subDays(new Date(), 2).toISOString(),
      },
      newImage: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
        ingestionLastTriggered: new Date().toISOString(),
      },
    });

    const result = getDocumentFromProfileRecord(insertRecord);

    expect(result).toEqual({
      memberDocument: {
        memberId: '123',
        firstName: 'Sam',
        employerId: 'employerId',
        organisationId: 'organisationId',
      },
      employerIdChanged: true,
      organisationIdChanged: true,
      profileEmployerName: undefined,
    });
  });

  it('should return include profileEmployerName if available', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        firstName: 'Sam',
        organisationId: 'organisationId',
      },
      newImage: {
        memberId: '123',
        firstName: 'Sam',
        organisationId: 'organisationId',
        employerName: 'Free Text Employer',
      },
    });

    const result = getDocumentFromProfileRecord(insertRecord);

    expect(result).toEqual({
      memberDocument: {
        memberId: '123',
        firstName: 'Sam',
        organisationId: 'organisationId',
      },
      employerIdChanged: false,
      organisationIdChanged: false,
      profileEmployerName: 'Free Text Employer',
    });
  });
});

describe('getDocumentFromApplicationRecord', () => {
  it('should throw validation error if old application not found in stream record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: undefined,
      newImage: {},
    });

    expect(() => getDocumentFromApplicationRecord(removeRecord)).toThrow(
      'Old application not found in stream record: 123',
    );
  });

  it('should throw validation error if new profile not found in stream record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: undefined,
      newImage: undefined,
    });

    expect(() => getDocumentFromApplicationRecord(insertRecord)).toThrow(
      'New application image not found in stream record: 123',
    );
  });

  it('should return empty "applicationId" if eventName is "REMOVE"', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        applicationId: '456',
      },
      newImage: {},
    });

    const result = getDocumentFromApplicationRecord({
      ...insertRecord,
      eventName: 'REMOVE',
    });

    expect(result).toEqual({
      memberId: '123',
      applicationId: '',
    });
  });

  it('should include properties from new application', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        eligibilityStatus: 'ELIGIBLE',
      },
      newImage: {
        memberId: '123',
        eligibilityStatus: 'INELIGIBLE',
      },
    });

    const result = getDocumentFromApplicationRecord(insertRecord);

    expect(result).toEqual({
      memberId: '123',
      eligibilityStatus: 'INELIGIBLE',
    });
  });
});

describe('getDocumentFromCardRecord', () => {
  it('should throw validation error if new card not found in stream record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: undefined,
      newImage: undefined,
    });

    expect(() => getDocumentFromCardRecord(insertRecord)).toThrow(
      'New card image not found in stream record: 123',
    );
  });

  it('should return undefined if "REMOVE" record', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {},
      newImage: undefined,
    });

    const result = getDocumentFromCardRecord(removeRecord);

    expect(result).toBeUndefined();
  });

  it('should include properties from new card', () => {
    unmarshallStreamImagesMock.mockReturnValue({
      oldImage: {
        memberId: '123',
        cardStatus: 'ACTIVE',
      },
      newImage: {
        memberId: '123',
        cardStatus: 'INACTIVE',
      },
    });

    const result = getDocumentFromCardRecord(insertRecord);

    expect(result).toEqual({
      memberId: '123',
      cardStatus: 'INACTIVE',
    });
  });
});
