import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';

const service: string = process.env.service ?? '';
const logger = new LambdaLogger({ serviceName: `${service}-redeem-post` });

export const handler = async () => {
  logger.info({
    message: 'POST Redeem Input',
  });

  return Response.OK({ message: 'OK' });
};
