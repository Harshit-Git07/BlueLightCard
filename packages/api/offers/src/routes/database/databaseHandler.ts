import { APIGatewayEvent } from 'aws-lambda';
import { DatabaseInstanceType } from '../../constructs/database/type';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import {
  DatabaseSafeFailConnectionType,
  SafeFailDatabaseConnectionService,
} from '../../services/databaseConnectionService';
import { Response } from '@blc-mono/core/utils/restResponse/response';

const logger = new LambdaLogger({ serviceName: `offers-database-handler` });

// This is a simple handler to test database connection, in real world scenario, this should be removed as we use Repositories.
export const handler = async (event: APIGatewayEvent) => {
  try {
    const safeFailConnection: DatabaseSafeFailConnectionType | null =
      await SafeFailDatabaseConnectionService.getConnection(logger, DatabaseInstanceType.READER);
    let connection;
    if (safeFailConnection && safeFailConnection.success) {
      connection = safeFailConnection.connection;
    } else {
      logger.error({ message: `Database connection failed`, body: safeFailConnection?.error?.message });
      return Response.Error(safeFailConnection?.error!);
    }

    const [rows, fields] = await connection!.directConnection.query('SELECT 1 + 1 AS solution');
    const resultString = JSON.stringify(rows); // Assuming the query returns at least one row
    logger.info({ message: `Database connection successful - Query result: ${resultString}` });
    return Response.OK({ message: `Database connection successful - Query result: ${resultString}`, data: rows });
  } catch (error) {
    logger.error({ message: `Database connection failed`, body: error });
    return Response.Error(error as Error);
  }
};
