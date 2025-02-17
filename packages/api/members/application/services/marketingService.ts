import { MarketingPreferencesEnvironment } from '@blc-mono/members/application/types/marketingPreferencesEnvironment';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';
import { BrazeClient } from '@blc-mono/members/application/services/braze/brazeClient';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';

let marketingServiceSingleton: MarketingService;

export class MarketingService {
  constructor(private readonly brazeClient = new BrazeClient()) {}

  async getAttributes(memberId: string, attributes: string[]): Promise<Record<string, unknown>> {
    try {
      logger.debug({ message: 'Fetching Braze attributes', memberId, attributes });
      return await this.brazeClient.getAttributes(memberId, attributes);
    } catch (error) {
      logger.error({ message: 'Error fetching Braze attributes', error });
      throw error;
    }
  }

  async getPreferences(
    memberId: string,
    environment: MarketingPreferencesEnvironment,
  ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    try {
      logger.debug({ message: 'Fetching marketing preferences', memberId, environment });
      return await this.brazeClient.getMarketingPreferences(memberId, environment);
    } catch (error) {
      logger.error({ message: 'Error fetching marketing preferences', error });
      throw error;
    }
  }

  async updateBraze(memberId: string, attributes: BrazeUpdateModel['attributes']): Promise<void> {
    try {
      logger.debug({ message: 'Updating marketing preferences', memberId });
      await this.brazeClient.updateBraze(memberId, attributes);
    } catch (error) {
      logger.error({ message: 'Error updating marketing preferences', error });
      throw error;
    }
  }
}

export function marketingService(): MarketingService {
  if (!marketingServiceSingleton) {
    marketingServiceSingleton = new MarketingService();
  }

  return marketingServiceSingleton;
}
