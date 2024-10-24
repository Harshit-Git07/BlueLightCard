import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { ConfiguredRetryStrategy } from "@smithy/util-retry";
import fs from 'fs';

const options = {
    region: "eu-west-2",
    retryStrategy: new ConfiguredRetryStrategy(
        5,
        (attempt) => 200 + (attempt * 1000)
    ),
};

const client = new DynamoDBClient(options);

let tableName = process.env["MEMBER_CODES_DYNAMO"];
if (tableName === undefined)
    throw new Error("Please set MEMBER_CODES_DYNAMO environmental variable for target tabel");

async function batchWriteItems(items) {
    const requestItems = items.map(item => ({
        PutRequest: {
            Item: {
                "pk": {
                    "S": item.pk
                },
                "sk": {
                    "S": item.sk
                },
                "Name": {
                    "S": item.Name
                },
                "Type": {
                    "S": item.Type
                },
                "IdRequirements": {
                    "S": item.IdRequirements
                },
                "IdUploadCount": {
                    "N": item.IdUploadCount.toString()
                },
                "BypassPayment": {
                    "BOOL": item.BypassPayment
                },
                "BypassId": {
                    "BOOL": item.BypassId
                },
                "Active": {
                    "BOOL": item.Active
                },
                "Updated": {
                    "S": item.Updated
                }
            },
        }
    }));

    const command = new BatchWriteItemCommand({
        RequestItems: {
            [tableName]: requestItems
        },
        ReturnConsumedCapacity: 'TOTAL'
    });

    const response = await client.send(command);
    return response;
};

async function addOrganisations() {
    const lines = fs.readFileSync('data/membercodes_orgs_upload.json', 'utf-8').split(/\r?\n/);
    const items = lines.map(line => JSON.parse(line));

    while (items.length) {
        const batch = items.splice(0, 25);
        try {
            await batchWriteItems(batch);
        } catch (error) {
            console.log('Batch Write Error:', error);
        }
    }
}

addOrganisations();
