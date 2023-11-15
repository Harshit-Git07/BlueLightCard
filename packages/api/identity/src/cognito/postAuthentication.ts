import {Logger} from "@aws-lambda-powertools/logger";

const service: string = process.env.SERVICE as string
const logger = new Logger({ serviceName: `${service}-postAuthentication` })

export const handler = async (event: any, context: any) => {
    logger.info('audit', {
        audit: true,
        action: 'signin',
        memberId : event.request.userAttributes['custom:blc_old_id']
    });
    return event;
}