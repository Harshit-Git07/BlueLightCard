import getAllowedDomains from '../utils/getAllowedDomains';

process.env.allowedDomains = getAllowedDomains('staging');

import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from './ecFormOutputData';
const ddbMock = mockClient(DynamoDBDocumentClient);

jest.useFakeTimers({
    now: 1673445238335,
});

jest.mock('uuid', () => ({ v4: () => '1234' }));


describe('Add EC form Output data', () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    
    test('Returns 400 with message when invalid brand', async () => {
        
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers: { origin: "https://www.staging.bluelightcard.co.uk"},
                pathParameters: { brand: 'test_brand_name' },
                body: ''
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "https://www.staging.bluelightcard.co.uk"
            },
            statusCode: 400, body: JSON.stringify({ message: 'Please provide a valid brand' })
        });
    });

    test('Returns 400 with message when body is null', async () => {
        
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers: { origin: "https://www.staging.bluelightcard.co.uk"},
                pathParameters: { brand: 'blc_uk' },
                body: null
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "https://www.staging.bluelightcard.co.uk"
            },
            statusCode: 400, body: JSON.stringify({ message: 'Please provide a valid request body' })
        });
    });

    test('Returns 200 success when valid brand and valid request body with no employer', async () => {
        const item =     {
            organisation: "Some Organisation",
            jobRole: "Some Job Role",
            employer: "",
            employmentStatus: "Retired",
        }
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers: { origin: "https://www.staging.bluelightcard.co.uk"},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify(item)
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({
                message: 'Success',
                data: { pk: "1234", sk: "BRAND#BLC_UK", organisation: "Some Organisation", 
                jobRole: "Some Job Role", employer: "", dateTime: 1673445238335, employmentStatus: "Retired"}
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "https://www.staging.bluelightcard.co.uk"
            },
        });
    });

    test('Returns 200 success when valid brand and valid request body with only employer', async () => {
        const item =     {
            organisation: "",
            jobRole: "",
            employer: "Some employer",
            employmentStatus: "Employed",
        }
        const res = await handler(
            // @ts-expect-error - We're not testing the event object
            {
                headers: { origin: "https://www.staging.bluelightcard.co.uk"},
                pathParameters: { brand: 'blc_uk' },
                body: JSON.stringify(item)
            },
            {},
        );
        expect(res).toEqual({
            statusCode: 200, 
            body: JSON.stringify({
                message: 'Success',
                data: { pk: "1234", sk: "BRAND#BLC_UK", organisation: "", 
                jobRole: "", employer: "Some employer", dateTime: 1673445238335, employmentStatus: "Employed"}
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "https://www.staging.bluelightcard.co.uk"
            },
        });
    });

});
