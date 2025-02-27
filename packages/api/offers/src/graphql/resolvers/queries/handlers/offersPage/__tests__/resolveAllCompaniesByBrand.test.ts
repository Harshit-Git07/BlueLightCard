const COMPANY_BRAND_CONNECTION_TABLE = 'test-blc-mono-companyBrandConnection';
process.env.COMPANY_BRAND_CONNECTION_TABLE = COMPANY_BRAND_CONNECTION_TABLE;

const COMPANY_TABLE = 'test-blc-mono-company';
process.env.COMPANY_TABLE = COMPANY_TABLE;

import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { promises as fs } from 'fs'
import path from 'path'
import { handler } from '../../queryLambdaResolver'

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

jest.mock('ioredis');

describe('Test resolveGetAllCompaniesByBrandId', () => {

  beforeEach(() => {
    dynamoDbMock.reset();

  });


  it('should fetch the data from DynamoDB', async () => {
    
    const brandId = 'blc-uk';

    const companiesRaw = await fs.readFile(path.join(__dirname, '../../../../../../', 'seeds', 'offers', 'companies.json'))
    const companies = JSON.parse(companiesRaw.toString());

    const companyBrandConnectionRaw = await fs.readFile(path.join(__dirname, '../../../../../../', 'seeds', 'offers', 'companyBrandsConnection.json'))
    const companyBrandConnection = JSON.parse(companyBrandConnectionRaw.toString());

    dynamoDbMock.on(QueryCommand)
      .resolves({
        Items: companyBrandConnection
      })
      .on(BatchGetCommand)
      .resolves({
        Responses: {
          [COMPANY_TABLE]: companies
        }
      })

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getAllCompaniesByBrandId',
        selectionSetList: [
          'id', 'name'
        ]
      },
      arguments: {
        brandId,
        input: {
          isUnder18: false,
        }
      },
    }

    const result = await handler(event as any)
    
    expect(result.length).toBe(3);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('legacyId');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].id).toBe('1');
    expect(result[0].legacyId).toBe('1');
    expect(result[0].name).toBe('JD Sports');
  })

  it('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: ['deals', 'features', 'flexible', 'marketPlace'],
      },
      arguments: {},
    }

    await expect(handler(event as any)).rejects.toThrow('Invalid brandId undefined')
  })
});
