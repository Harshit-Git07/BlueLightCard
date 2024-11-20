import { mockClient } from 'aws-sdk-client-mock';
import { EmployerRepository } from '../employerRepository';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const idRequirements = [
  {
    id: '1',
    title: 'Payslip dated within the last 3 months',
    criteria: [],
    allowedFormats: 'png/jpeg/jpg/pdf',
  },
];

const employerId = '000001';
const organisationId = '123';
const brand = 'BLC_UK';

const mockEmployerList = [
  {
    volunteers: 'FALSE',
    idRequirements: idRequirements,
    maxUploads: '1',
    trustedDomain: 'FALSE',
    tk: '39',
    sk: `EMPLOYER#${employerId}`,
    employed: 'TRUE',
    pk: `ORGANISATION#${organisationId}`,
    name: 'HM Coastguard',
    retired: 'FALSE',
  },
];

const mockTransformedEmployerList = [
  {
    employerId: employerId,
    name: 'HM Coastguard',
    type: '',
    active: true,
    volunteer: false,
    idRequirements: JSON.stringify(idRequirements),
    retired: false,
    trustedDomains: [],
  },
];

const paramsWithEmployerId = {
  TableName: 'testTable',
  KeyConditionExpression: '#pk = :pk AND #sk = :sk',
  ExpressionAttributeNames: {
    '#pk': 'pk',
    '#sk': 'sk',
  },
  ExpressionAttributeValues: {
    ':pk': `ORGANISATION#${organisationId}`,
    ':sk': `EMPLOYER#${employerId}`,
  },
};

const paramsWithoutEmployerId = {
  TableName: 'testTable',
  KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
  ExpressionAttributeNames: {
    '#pk': 'pk',
    '#sk': 'sk',
  },
  ExpressionAttributeValues: {
    ':pk': `ORGANISATION#${organisationId}`,
    ':sk': 'EMPLOYER#',
  },
};

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('EmployersRepository', () => {
  let repository: EmployerRepository;

  beforeEach(() => {
    mockDynamoDB.reset();
    repository = new EmployerRepository(mockDynamoDB as any, 'testTable');
  });

  it('should return validated employer when found and employerId is present', async () => {
    const mockQueryResult = {
      Items: mockEmployerList,
    } as never;

    mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

    const result = await repository.getEmployers({
      brand: brand,
      organisationId: organisationId,
      employerId: employerId,
    });

    expect(mockDynamoDB.calls()).toHaveLength(1);
    expect(mockDynamoDB.call(0).args[0].input).toEqual(paramsWithEmployerId);
    expect(result).toEqual(mockTransformedEmployerList);
  });

  it('should return validated employers when organisation found and employerId is not present', async () => {
    const mockQueryResult = {
      Items: mockEmployerList,
    } as never;

    mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

    const result = await repository.getEmployers({
      brand: brand,
      organisationId: organisationId,
      employerId: undefined,
    });

    expect(mockDynamoDB.calls()).toHaveLength(1);
    expect(mockDynamoDB.call(0).args[0].input).toEqual(paramsWithoutEmployerId);
    expect(result).toEqual(mockTransformedEmployerList);
  });

  it('should return an empty array when no organisation employers are found', async () => {
    const mockQueryResult = {
      Items: [],
    };
    mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);
    const result = await repository.getEmployers({
      brand: brand,
      organisationId: organisationId,
      employerId: undefined,
    });

    expect(mockDynamoDB.calls()).toHaveLength(1);
    expect(mockDynamoDB.call(0).args[0].input).toEqual(paramsWithoutEmployerId);
    expect(result).toEqual([]);
  });
});
