import { APIGatewayEvent } from 'aws-lambda';
import { DatabaseInstanceType } from '../type';
import { migrationRunner } from './migrationRunner';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { DatabaseConnectionService, IDatabaseConnectionService } from '../../../services/databaseConnectionService';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

const service: string = getEnvRaw('service') ?? 'offers';
const logger = new LambdaLogger({ serviceName: `${service}-database-migration-handler` });

export const handler = async (event: APIGatewayEvent) => {
  const databaseConnectionService: IDatabaseConnectionService = new DatabaseConnectionService(logger);
  const connection = await databaseConnectionService.connect(DatabaseInstanceType.WRITER);
  logger.info({ message: `Running migration for service: ${service}` });
  await migrationRunner(connection.drizzleClient, 'migrations');
  logger.info({ message: `Migration complete for service: ${service}` });
};
