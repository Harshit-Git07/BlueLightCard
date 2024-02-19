import { APIGatewayEvent } from 'aws-lambda';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { DatabaseConnectionManager } from '../../database/connection';
import { DatabaseInstanceType } from '../../database/type';

const logger = new LambdaLogger({ serviceName: `offers-database-handler` });

const db = await DatabaseConnectionManager.connect(DatabaseInstanceType.READER, logger);

export const handler = async (event: APIGatewayEvent) => {
  try {
    const [rows, fields] = await db.sql.query('SELECT 1 + 1 AS solution');
    const resultString = JSON.stringify(rows); // Assuming the query returns at least one row

    return { statusCode: 200, body: `Database connection successful - Query result: ${resultString}` };
  } catch (error) {
    return { statusCode: 500, body: `${error} - Database connection failed` };
  }
};
