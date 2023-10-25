import Redis from "ioredis";
import { isDev } from '../../../core/src/utils/checkEnvironment';
import { Logger } from '@aws-lambda-powertools/logger';

export class CacheService {

  private redisClient: Redis | any;

  constructor(private readonly stage: string, private logger: Logger) {
    logger.info('CacheService Started');
    // if (!isDev(this.stage)) {
    //   logger.info('Creating Redis Client')
    //   this.redisClient = new Redis.Cluster([{
    //     host: process.env.REDIS_ENDPOINT,
    //     port: parseInt(process.env.REDIS_PORT as string),
    //   }]);
    // }
  }

  async set(key: string, value: any, ttl: number) {
    if (!isDev(this.stage)) {
      try {
        this.redisClient.set(key, value, 'EX', ttl);
      }catch (error) {
        this.logger.error('Error setting cache', { error, key });
      }
    }
  }

  async get(key: string) {
    if (isDev(this.stage)) return null;
    try {
      const data = await this.redisClient.get(key);
      return data
    }catch (error) {
      this.logger.error('Error getting cache', { error, key });
      return null;
    }
  }
}
