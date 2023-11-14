import { Logger } from '@aws-lambda-powertools/logger';
import { CompanyHandler } from './company/companyHandler';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-companyEvent` });

export const handler = async (event: any) => {
  logger.info('Company event received', event);
  const companyHandler = new CompanyHandler();

  switch (event.source) {
    case 'company.create':
      await companyHandler.handleCompanyCreate(event);
      break;
    case 'company.update':
      await companyHandler.handleCompanyUpdate(event);
      break;
    default:
      logger.error('Invalid event source', event);
      throw new Error('Invalid event source');
  }
};
