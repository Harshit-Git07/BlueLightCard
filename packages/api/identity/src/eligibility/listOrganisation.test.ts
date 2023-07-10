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
            statusCode: 400, body: JSON.stringify({ message: 'Please provide a valid brand' })
        });
    });

    test('Returns 200 with list when valid brand and no retired params', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK",
                    pk: "ORGANISATION#test_500",
                    name: "test_HM C",
                    retired: "false",
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
            statusCode: 200, body: JSON.stringify({
                organisations: [
                    { id: "test_500", name: "test_HM C", retired: "false", idRequirements: [{ description: "current work ID", title: "ID", id: "1", allowedFormats: "png/jpeg/jpg/pdf" }, 
                { description: "payslip within the last 3 months", id: "2", title: "Payslip", allowedFormats: "png/jpeg/jpg/pdf" }], maxUploads: "1", isTrusted: "false" },
                { id: "test_600", name: "test_Mountain R", retired: "false", idRequirements: [{ description: "current work ID", title: "ID", id: "1", allowedFormats: "png/jpeg/jpg/pdf" }], "maxUploads": "1", isTrusted: "true" }
            ]
            })
        });
    });

    test('Returns 200 with list when valid brand and retired params set', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    sk: "BRAND#BLC_UK", pk: "ORGANISATION#test_100", name: "test_name", retired: "true"
                },
            ],
        });
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers:{},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify({ retired: 1 })
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, body: JSON.stringify({ organisations: [{ id: "test_100", name: "test_name", retired: "true" }] })
        });
    });


});
