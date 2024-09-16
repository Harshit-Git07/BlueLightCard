import { Logger } from '@aws-lambda-powertools/logger';
import { EventBridgeEvent } from 'aws-lambda';
import { sendToDLQ } from '../../src/helpers/DLQ';
import { CompanyFollowsService, ICompanyFollowsService } from '../services/CompanyFollowsService';
import { IdMappingService, IIdMappingService } from 'src/services/IdMappingService';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logger = new Logger({ serviceName: `${service}-companyFollowsUpdate` });
const companyFollowsService: ICompanyFollowsService = new CompanyFollowsService();
const idMappingService: IIdMappingService = new IdMappingService();

export const handler = async (event: EventBridgeEvent<any, any>) => {
  logger.info('event received', { event });

  if (!event.detail) {
    logger.error('event detail is missing', { event });
  }
  const input = event.detail as Input;

  const result = await idMappingService.findByLegacyId(input.brand, input.legacy_id);

  if (result.Items === null || result.Items?.length === 0) {
    logger.error('user uuid not found', { input });
  }

  const user = result.Items?.at(0) as Record<string, string>;
  logger.info('user uuid found', { user });

  if (input.action === 'update') {
    try {
      const results = await companyFollowsService.updateCompanyFollows(
        user.uuid,
        input.company_id,
        input.likeType,
      );
      logger.debug('results', { results });
    } catch (err: any) {
      logger.error('error syncing company follows', { err });
      await sendToDLQ(event);
    }
  } else if (input.action === 'delete') {
    try {
      const results = await companyFollowsService.deleteCompanyFollows(user.uuid, input.company_id);
      logger.debug('results', { results });
    } catch (err: any) {
      logger.error('error deleting company follows', { err });
      await sendToDLQ(event);
    }
  }
};

type Input = {
  company_id: string;
  likeType: string;
  brand: string;
  legacy_id: string;
  action: string;
};
