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
      {
        headers: {},
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
        statusCode: 400,
        body: JSON.stringify({message: 'Please provide brand details'}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
      },
      });
  });

  test('Returns 400 with message with invalid brand', async () => {
    const res = await handler(
      {
        headers: {},
        pathParameters: {brand: 'test_brand_name'},
        body: ''
      },
      {},
    );
    expect(res).toEqual({
      statusCode: 400,
      body: JSON.stringify({message: 'Please provide a valid brand'}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      });
  });

  test('Returns 200 with list when valid brand and valid organisation id', async () => {
    ddbMock.on(QueryCommand).resolves({
        Items: [
          {
                pk: "ORGANISATION#test_org1", sk: "EMPLOYER#test_1", tk: "test_tk1", name:"test_emp1"
          },
          {
                pk: "ORGANISATION#test_org1", sk: "EMPLOYER#test_2", tk: "test_tk2", name:"test_emp2"
        }
        ],
      });
    const res = await handler(
      {
        headers: {},
        pathParameters: {brand: 'blc_uk', organisationId: 'test_org1'},
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
     statusCode: 200,
     body: JSON.stringify({
      message: 'Success',
      data: [{id:"test_1",tk: "test_tk1", name:"test_emp1"},
      {id:"test_2", tk: "test_tk2", name:"test_emp2"}]}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
      });
  });

  test('Returns 200 with list when valid brand and valid organisation id and retired params', async () => {
    ddbMock.on(QueryCommand).resolves({
        Items: [
          {
                pk: "ORGANISATION#test_org1", sk: "EMPLOYER#test_1", tk: "test_tk1", name:"test_emp1", retired: "TRUE"
          },
          {
                pk: "ORGANISATION#test_org1", sk: "EMPLOYER#test_2", tk: "test_tk2", name:"test_emp2", retired: "TRUE"
        }
        ],
      });
    const res = await handler(
      {
        headers: {},
        pathParameters: {brand: 'blc_uk', organisationId: 'test_org1'},
        body: JSON.stringify({retired: 1})
      },
      {},
    );
    expect(res).toEqual({
     statusCode: 200,
     body: JSON.stringify({
      message: 'Success',
      data: [{id:"test_1",tk: "test_tk1", name:"test_emp1", retired: "TRUE"},
      {id:"test_2", tk: "test_tk2", name:"test_emp2", retired: "TRUE"}]}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
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
      {
        headers: {},
        pathParameters: {brand: 'blc_uk'},
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
    statusCode: 400,
    body: JSON.stringify({message: 'Please provide a valid organisation Id'}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
      });
  });


});
