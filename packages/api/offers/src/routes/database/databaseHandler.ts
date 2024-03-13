import { APIGatewayEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DatabaseConnectionManager } from '../../constructs/database/connection';
import { DatabaseInstanceType } from '../../constructs/database/type';

const logger = new Logger({ serviceName: `offers-database-handler` });
const db = await DatabaseConnectionManager.connect(DatabaseInstanceType.WRITER, logger);

export const handler = async (event: APIGatewayEvent) => {
  try {
    const [rows, fields] = await db.sql.query('SELECT 1 + 1 AS solution');
    const resultString = JSON.stringify(rows); // Assuming the query returns at least one row
    logger.info('Database connection successful', { resultString });
    return { statusCode: 200, body: `Database connection successful - Query result: ${resultString}` };
  } catch (error) {
    logger.error('Database connection failed', { error });
    return { statusCode: 500, body: `${error} - Database connection failed` };
  }
};
