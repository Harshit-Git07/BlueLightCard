import { Logger } from '@aws-lambda-powertools/logger';
import { BannerHandler } from './banner/bannerHandler';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-banner` });

export const handler = async (event: any) => {
  logger.info('event received', event);

  switch (event.source) {
    case 'banner.created':
      await new BannerHandler(event).handleBannerCreated();
      break;
    case 'banner.updated':
      await new BannerHandler(event).handleBannerUpdated();
      break;
    case 'banner.deleted':
      await new BannerHandler(event).handleBannerDeleted();
      break;
    default:
      logger.error('Invalid event source', event);
      throw new Error('Invalid event source');
  }
}

