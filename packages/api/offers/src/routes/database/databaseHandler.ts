import { APIGatewayEvent } from 'aws-lambda';
import { DatabaseConnectionManager } from '../../database/connection';
import { DatabaseInstanceType } from '../../database/type';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: `offers-database-handler` });
const db = await DatabaseConnectionManager.connect(DatabaseInstanceType.WRITER, logger);

export const handler = async (event: APIGatewayEvent) => {
  try {
    const [rows, fields] = await db.sql.query('SELECT 1 + 1 AS solution');
    const resultString = JSON.stringify(rows); // Assuming the query returns at least one row

    return { statusCode: 200, body: `Database connection successful - Query result: ${resultString}` };
  } catch (error) {
    logger.error('Database connection failed', { error });
    return { statusCode: 500, body: `${error} - Database connection failed` };
  }
};
