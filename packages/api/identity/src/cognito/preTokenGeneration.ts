import {Logger} from "@aws-lambda-powertools/logger";
import { PreTokenGenerationTriggerEvent } from 'aws-lambda'

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
