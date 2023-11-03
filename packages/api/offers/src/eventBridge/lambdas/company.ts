import { Logger } from '@aws-lambda-powertools/logger';
import { CompanyHandler } from './company/companyHandler';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-companyEvent` });
const companyHandler = new CompanyHandler();

export const handler = async (event: any) => {
  logger.info('Company event received', event);

  switch (event.source) {
    case 'company.create':
      await companyHandler.handleCompanyCreate(event);
      break;
    // case 'banner.updated':
    //   await new BannerHandler(event).handleBannerUpdated();
    //   break;
    // case 'banner.deleted':
    //   await new BannerHandler(event).handleBannerDeleted();
    //   break;
    default:
      logger.error('Invalid event source', event);
      throw new Error('Invalid event source');
  }
};
