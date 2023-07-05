import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from './listService';
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('List organisation by brand', () => {
    beforeEach(() => {
        ddbMock.reset();
      });
  
  test('Returns 400 with message when brand is missing', async () => {
    
    const res = await handler(
     // @ts-expect-error - We're not testing the event object
      {
        headers: {},
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
        statusCode: 400, body: JSON.stringify({message: 'Please provide a valid brand'})
      });
  });

  test('Returns 400 with message with invalid brand', async () => {
    const res = await handler(
     // @ts-expect-error - We're not testing the event object
      {
        headers: {},
        pathParameters: {brand: 'test_brand_name'},
        body: ''
      },
      {},
    );
    expect(res).toEqual({
        statusCode: 400, body: JSON.stringify({message: 'Please provide a valid brand'})
      });
  });

  test('Returns 200 with list when valid brand and valid organisation id', async () => {
    ddbMock.on(QueryCommand).resolves({
        Items: [
          {
                pk: "ORGANISATION#test_org1", sk: "EMPLOYER#test_1", name:"test_emp1"
          },
          {
                pk: "ORGANISATION#test_org1", sk: "EMPLOYER#test_2",name:"test_emp2"
        }
        ],
      });
    const res = await handler(
     // @ts-expect-error - We're not testing the event object
      {
        headers: {},     
        pathParameters: {brand: 'blc_uk', organisationId: 'test_org1'},   
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
        statusCode: 200, body: JSON.stringify({employers: [{id:"test_1",name:"test_emp1"},{id:"test_2",name:"test_emp2"}]})
      });
  });

  test('Returns 400 with message when valid brand and no organisation id', async () => {
    ddbMock.on(QueryCommand).resolves({
        Items: [
          {
            
          },
        ],
      });
    const res = await handler(
     // @ts-expect-error - We're not testing the event object
      {
        headers: {},     
        pathParameters: {brand: 'blc_uk'},   
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
        statusCode: 400, body: JSON.stringify({message: 'Please provide a valid organisation Id'})
      });
  });

  
});
