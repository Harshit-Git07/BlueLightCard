import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from './listOrganisation';
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('List organisation by brand', () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    
    test('Returns 400 with message when invalid brand', async () => {
        
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers: {},
                pathParameters: { brand: 'test_brand_name' },
                body: ''
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Please provide a valid brand' })
        });
    });

    test('Returns 200 with list when valid brand and no params', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK",
                    pk: "ORGANISATION#test_500",
                    name: "test_HM C",
                    retired: "false",
                    employed: "true",
                    volunteers: "false",
                    idRequirements: [
                        {
                            description: "current work ID",
                            title: "ID",
                            id: "1",
                            allowedFormats: "png/jpeg/jpg/pdf"
                        },
                        {
                            description: "payslip within the last 3 months",
                            id: "2",
                            title: "Payslip",
                            allowedFormats: "png/jpeg/jpg/pdf"
                        }
                    ],
                    maxUploads: "1",
                    trustedDomain: "false"
                },
                {
                    sk: "BRAND#BLC_UK",
                    pk: "ORGANISATION#test_600",
                    name: "test_Mountain R",
                    retired: "false",
                    employed: "true",
                    volunteers: "false",
                    idRequirements: [
                        {
                            description: "current work ID",
                            title: "ID",
                            id: "1",
                            allowedFormats: "png/jpeg/jpg/pdf"
                        }
                    ],
                    "maxUploads": "1",
                    trustedDomain: "true"
                }
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers: {},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({})
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({
                message: 'Success',
                data: [
                    { id: "test_500", name: "test_HM C", retired: "false", volunteers: "false", employed: "true", idRequirements: [{ description: "current work ID", title: "ID", id: "1", allowedFormats: "png/jpeg/jpg/pdf" }, 
                { description: "payslip within the last 3 months", id: "2", title: "Payslip", allowedFormats: "png/jpeg/jpg/pdf" }], maxUploads: "1", isTrusted: "false" },
                { id: "test_600", name: "test_Mountain R", retired: "false", volunteers: "false", employed: "true", idRequirements: [{ description: "current work ID", title: "ID", id: "1", allowedFormats: "png/jpeg/jpg/pdf" }], "maxUploads": "1", isTrusted: "true" }
            ]
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
        });
    });

    test('Returns 200 with list when valid brand and retired params set', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK", pk: "ORGANISATION#test_100", name: "test_name", retired: "true", volunteers: "false", employed: "false"
                },
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers:{},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({ retired: 1, volunteers: 0 })
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({ 
                message: 'Success',
                data: [{ id: "test_100", name: "test_name", retired: "true", volunteers: "false", employed: "false" }] 
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }, 
        });
    });

    test('Returns 200 with list when valid brand and employed params set', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK", pk: "ORGANISATION#test_100", name: "test_name", retired: "false", employed: "true", volunteers: "false"
                },
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers:{},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({ employed: 1 })
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({ 
                message: 'Success',
                data: [{ id: "test_100", name: "test_name", retired: "false", volunteers: "false", employed: "true" }] 
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }, 
        });
    });

    test('Returns 200 with list when valid brand and employed params set', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK", pk: "ORGANISATION#test_100", name: "test_name", retired: "false", employed: "true", volunteers: "false"
                },
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers:{},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({ employed: 1 })
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({ 
                message: 'Success',
                data: [{ id: "test_100", name: "test_name", retired: "false", volunteers: "false", employed: "true"  }] 
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }, 
        });
    });

    test('Returns 200 with list when valid brand and volunteers params set', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK", pk: "ORGANISATION#test_100", name: "test_name", retired: "false", employed: "false", volunteers: "true"
                },
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers:{},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({ volunteers: 1, employed: 0, retired: 0 })
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({ 
                message: 'Success',
                data: [{ id: "test_100", name: "test_name", retired: "false", volunteers: "true", employed: "false" }] 
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }, 
        });
    });

    test('Returns 200 with list when valid brand and test with uppercase boolean', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK", pk: "ORGANISATION#test_100", name: "test_name", retired: "TRUE", employed: "TRUE", volunteers: "TRUE"
                },
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers:{},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({ volunteers: 1, employed: 1, retired: 1 })
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({ 
                message: 'Success',
                data: [{ id: "test_100", name: "test_name", retired: "TRUE", volunteers: "TRUE", employed: "TRUE"  }] 
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }, 
        });
    });


});
