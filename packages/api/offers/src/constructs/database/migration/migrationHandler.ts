import 'reflect-metadata';
import { APIGatewayEvent } from 'aws-lambda';
import { DatabaseInstanceType } from '../type';
import { migrationRunner } from './migrationRunner';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { DatabaseConnectionService, IDatabaseConnectionService } from '../../../services/databaseConnectionService';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { container } from 'tsyringe';
import { Logger } from '@blc-mono/core/utils/logger/logger';

const service: string = getEnvRaw('service') ?? 'offers';
const logger = new LambdaLogger({ serviceName: `${service}-database-migration-handler` });
container.register(Logger.key, { useValue: logger });
const dbService: IDatabaseConnectionService = container.resolve(DatabaseConnectionService);

export const handler = async (event: APIGatewayEvent) => {
  const connection = await dbService.connect(DatabaseInstanceType.WRITER);
  logger.info({ message: `Running migration for service: ${service}` });
  await migrationRunner(connection.drizzleClient, 'migrations');
  logger.info({ message: `Migration complete for service: ${service}` });
};
