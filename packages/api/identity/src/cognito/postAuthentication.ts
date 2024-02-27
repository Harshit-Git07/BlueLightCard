import { Logger } from "@aws-lambda-powertools/logger";
import { PostAuthenticationTriggerEvent } from "aws-lambda";
import { UnsuccessfulLoginAttemptsService } from "src/services/UnsuccessfulLoginAttemptsService";

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-postAuthentication` });
const TABLE_NAME = process.env.TABLE_NAME ?? "";

const unsuccessfulLoginAttemptsService = new UnsuccessfulLoginAttemptsService(TABLE_NAME, logger);

export const handler = async (event: PostAuthenticationTriggerEvent, context: any) => {
  const email = event.request.userAttributes.email;
  const userPoolId = event.userPoolId;

  logger.info("audit", {
    audit: true,
    action: "cognito hosted ui post authentication",
    email : email,
    userPoolId: userPoolId
  });

  const emailExists = await unsuccessfulLoginAttemptsService.checkIfDatabaseEntryExists(email, userPoolId);

  if (emailExists) {
    await unsuccessfulLoginAttemptsService.deleteRecord(email, userPoolId);
  }
  
  return event;
};

