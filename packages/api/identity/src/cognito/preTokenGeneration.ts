import {Logger} from "@aws-lambda-powertools/logger";
import { PostAuthenticationTriggerEvent, PreTokenGenerationTriggerEvent } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const service: string = process.env.SERVICE as string
const logger = new Logger({ serviceName: `${service}-preTokenGeneration` })

export const handler = async (event: PreTokenGenerationTriggerEvent, context: any) => {
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        card_status: "test",
      },
    },
  };
  return event;
}
