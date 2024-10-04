import { mockClient } from 'aws-sdk-client-mock';
import { OrganisationsRepository } from '../organisationsRepository';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const idRequirements = [
  {
    id: '1',
    title: 'Payslip dated within the last 3 months',
    criteria: [],
    allowedFormats: 'png/jpeg/jpg/pdf',
  },
];

const mockOrganisationList = [
  {
    volunteers: 'FALSE',
    code: 'HIGHWAYS',
    idRequirements: idRequirements,
    maxUploads: '1',
    trustedDomain: 'FALSE',
    tk: '39',
    sk: 'BRAND#BLC_UK',
    employed: 'TRUE',
    pk: 'ORGANISATION#0001',
    name: 'Highway Traffic Officers',
    retired: 'FALSE',
  },
];

const mockTransformedOrganisationList = [
  {
    organisationId: '0001',
    name: 'Highway Traffic Officers',
    type: 'HIGHWAYS',
    active: true,
    volunteer: false,
    idRequirements: JSON.stringify(idRequirements),
    retired: false,
    trustedDomains: [],
  },
];

const paramsWithOrgId = {
  TableName: 'testTable',
  KeyConditionExpression: '#pk = :pk AND #sk = :sk',
  ExpressionAttributeNames: {
    '#pk': 'pk',
    '#sk': 'sk',
  },
  ExpressionAttributeValues: {
    ':pk': 'ORGANISATION#123',
    ':sk': 'BRAND#BLC_UK',
  },
};

const paramsWithoutOrgId = {
  TableName: 'testTable',
  IndexName: 'gsi1',
  KeyConditionExpression: '#sk= :sk And begins_with(#pk, :pk)',
  ExpressionAttributeNames: {
    '#sk': 'sk',
    '#pk': 'pk',
  },
  ExpressionAttributeValues: {
    ':sk': 'BRAND#BLC_UK',
    ':pk': 'ORGANISATION#',
  },
};

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('OrganisationsRepository', () => {
  let repository: OrganisationsRepository;

  beforeEach(() => {
    mockDynamoDB.reset();
    repository = new OrganisationsRepository(mockDynamoDB as any, 'testTable');
  });

  it('should return validated organisation when found and orgId is present', async () => {
    const mockQueryResult = {
      Items: mockOrganisationList,
    } as never;
    mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

    const result = await repository.getOrganisations({ brand: 'BLC_UK', organisationId: '123' });

    expect(mockDynamoDB.calls()).toHaveLength(1);
    expect(mockDynamoDB.call(0).args[0].input).toEqual(paramsWithOrgId);
    expect(result).toEqual(mockTransformedOrganisationList);
  });

  it('should return validated organisations when found and orgId is not present', async () => {
    const mockQueryResult = {
      Items: mockOrganisationList,
    } as never;

    mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

    const result = await repository.getOrganisations({
      brand: 'BLC_UK',
      organisationId: undefined,
    });

    expect(mockDynamoDB.calls()).toHaveLength(1);
    expect(mockDynamoDB.call(0).args[0].input).toEqual(paramsWithoutOrgId);
    expect(result).toEqual(mockTransformedOrganisationList);
  });

  it('should return an empty array when no organizations are found', async () => {
    const mockQueryResult = {
      Items: [],
    };

    mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

    const result = await repository.getOrganisations({ brand: 'BLC_UK', organisationId: '123' });

    expect(mockDynamoDB.calls()).toHaveLength(1);
    expect(mockDynamoDB.call(0).args[0].input).toEqual(paramsWithOrgId);
    expect(result).toEqual([]);
  });
});
