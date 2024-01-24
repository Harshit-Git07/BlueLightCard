import { Logger } from '@blc-mono/core/src/utils/logger/logger';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';

const service: string = process.env.service ?? '';
const logger = new Logger();

logger.init({ serviceName: `${service}-redeem-post` });

export const handler = async () => {
  logger.info({
    message: 'POST Redeem Input',
  });

  return Response.OK({ message: 'OK' });
};
