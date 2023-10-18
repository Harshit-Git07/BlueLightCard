import Redis from "ioredis";
import { isDev } from '../../../core/src/utils/checkEnvironment';

export class CacheService {

  private readonly redisClient = new Redis({
    host: process.env.REDIS_ENDPOINT!,
    port: parseInt(process.env.REDIS_PORT! as string),
  });

  constructor(private readonly stage: string) {}

  async set(key: string, value: any, ttl: number) {
    if (!isDev(this.stage)) {
      this.redisClient.set(key, value, 'EX', ttl);
    }
  }

  async get(key: string) {
    if (isDev(this.stage)) return null;

    return this.redisClient.get(key);
  }
}
