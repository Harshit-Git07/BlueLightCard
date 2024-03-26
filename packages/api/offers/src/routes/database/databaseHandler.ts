import 'reflect-metadata';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { container } from 'tsyringe';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { APIGatewayEvent } from 'aws-lambda';
import { DatabaseConnectionService, IDatabaseConnectionService } from '../../services/databaseConnectionService';
import { DatabaseInstanceType } from '../../constructs/database/type';
import { Response } from '@blc-mono/core/utils/restResponse/response';

const logger = new LambdaLogger({ serviceName: `offers-database-handler` });
container.register(Logger.key, { useValue: logger });

export const handler = async (event: APIGatewayEvent) => {
  const dbService: IDatabaseConnectionService = container.resolve(DatabaseConnectionService);
  const [rows, fields] = await (
    await dbService.connect(DatabaseInstanceType.READER)
  ).directConnection.query('SELECT 1 + 1 AS solution');
  return Response.OK({ message: `successful`, data: rows });
};
