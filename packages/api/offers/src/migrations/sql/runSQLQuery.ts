import createDBConnection from './createDBConnection';
import { Logger } from '@aws-lambda-powertools/logger';

const runSQLQuery = async (query: string, logger: Logger) => {
    const connection = await createDBConnection();

    const queryTimeStart = new Date().getTime()

    const [result] = await connection.query(query)

    logger.info(`Time taken to run query ${new Date().getTime() - queryTimeStart}ms`)

    if (Array.isArray(result) && result.length > 0) {
        return result
    }

    return [];
}

export default runSQLQuery;